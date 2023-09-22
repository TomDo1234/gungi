import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import type { GameState, Players, SocketDataAfterTurn } from './types';
import { check_legality, flip_board, generate_token } from './logic';

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"]
  }
});

const game_io = io.of('/game_ws');
const lobby_io = io.of('/lobby_ws');
const port = 8080;

app.get('/', ( _, res) => {
  res.send('Healthy');
});

const rooms: Record<string,{previous_game_state: null | GameState,players: Players}> = {}

lobby_io.on('connection',(socket: Socket) => {
  socket.join('the_lobby');
  socket.on('get_games', () => {
    const open_rooms = [];
    for (const [game_id,room] of Object.entries(rooms)) {
      const players = Object.values(room.players);
      if (players.length <= 1) {
        open_rooms.push({game_id, host_name: players?.[0]?.name})
      }
    }
    lobby_io.to('the_lobby').emit('get_games',open_rooms)
  })
})

game_io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  
  socket.on('send_token',({token,game_id}) => {
    if (!(game_id in rooms)) {
      rooms[game_id] = {previous_game_state: null, players: {}};
    }
    if (token in rooms[game_id].players) {
      socket.emit('get_token',{ token: null })
      return;
    }
    const new_token = generate_token();
    socket.emit('get_token',{ token: new_token })
  })

  socket.on('join_game',(message) => {  
    socket.join(message.game_id);
    if (!(message.game_id in rooms)) {
      rooms[message.game_id] = {previous_game_state: null, players: {}};
    }
    const { players,previous_game_state: ref_previous_game_state } = rooms[message.game_id];
    if (message.token in players) {
      const previous_game_state = structuredClone(ref_previous_game_state);
      const flip = (previous_game_state?.stack_turn ?? 0) % 2 === (players[message.token].player_color === 'white' ? 1 : 0)
      if (flip && previous_game_state) {
        previous_game_state.board_state = flip_board(previous_game_state?.board_state)
        previous_game_state.player_data.reverse()
      }
      game_io.emit("joined_room",{player_data: players[message.token],previous_game_state,socket_id: socket.id});
      return;
    }
    const player_list = Object.keys(players);
    const color = (player_list.length > 0 && player_list[0] !== message.token) ? 'black' : 'white';
    players[message.token] = {player_color: color, name: null,ready: false};
    game_io.to(message.game_id).emit("joined_room",{player_data: players[message.token] , socket_id: socket.id});
  })

  socket.on('declare_name',(message) => {
    if (!(message.game_id in rooms)) {
      rooms[message.game_id] = {previous_game_state: null, players: {}};
    }
    const players = rooms[message.game_id].players;
    game_io.to(message.game_id).emit("other_player_declare_name",{name: message.name,socket_id: socket.id})
    if (message.token in players) {
      players[message.token].name = message.name;
    }
  })

  socket.on('player_ready',(message) => {
    if (!(message.game_id in rooms)) {
      rooms[message.game_id] = {previous_game_state: null, players: {}};
    }
    const players = rooms[message.game_id].players;
    game_io.to(message.game_id).emit("other_player_ready",{ready: message.ready,socket_id: socket.id})
    if (message.token in players) {
      players[message.token].ready = true;
    }
  })

  socket.on('send_data_after_turn',(message: SocketDataAfterTurn) => {
    if (!check_legality(rooms?.[message.game_id]?.previous_game_state,message)) {
      return;
    }
    rooms[message.game_id].previous_game_state = message;
    message.board_state = flip_board(message.board_state)
    message.player_data?.reverse()
    game_io.to(message.game_id).emit('received_data_after_turn',message) //flip board because the players have mirrored views, their color is always towards the bottom
    //of their screens
  })
});

server.listen(port, () => {
  console.log(`Express Server is running on port ${port}`);
}); 