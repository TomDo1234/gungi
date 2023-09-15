import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import type { GameState } from './types';
import { check_legality, flip_board, generate_token } from './logic';

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "https://gungi.net",
    methods: ["GET", "POST"]
  }
});

const game_io = io.of('/game_ws');
const port = 8080;

app.get('/', ( _, res) => {
  res.send('Healthy');
});

const players: Record<string,{player_color: 'white' | 'black',name: string | null,ready: boolean}> = {};
let previous_game_state: null | GameState = null;

game_io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  
  socket.on('send_token',({token}) => {
    if (token in players) {
      return;
    }
    const new_token = generate_token();
    socket.emit('get_token',{ token: new_token })
  })

  socket.on('join_game',(message) => {  
    socket.join(message.game_id);
    if (message.token in players) {
      game_io.emit("joined_room",{player_data: players[message.token],socket_id: socket.id});
      return;
    }
    const player_list = Object.keys(players);
    const color = (player_list.length > 1 && player_list[0] !== message.token) ? 'black' : 'white';
    players[message.token] = {player_color: color, name: null,ready: false};
    game_io.to(message.game_id).emit("joined_room",{player_data: players[message.token] , socket_id: socket.id});
  })

  socket.on('declare_name',(message) => {
    game_io.to(message.game_id).emit("other_player_declare_name",{name: message.name,socket_id: socket.id})
    if (message.token in players) {
      players[message.token].name = message.name;
    }
  })

  socket.on('player_ready',(message) => {
    game_io.to(message.game_id).emit("other_player_ready",{ready: message.ready,socket_id: socket.id})
    if (message.token in players) {
      players[message.token].ready = true;
    }
  })

  socket.on('send_data_after_turn',(message) => {
    if (!check_legality(previous_game_state,message)) {
      return;
    }
    previous_game_state = message;
    message.board_state = flip_board(message.board_state)
    game_io.to(message.game_id).emit('received_data_after_turn',message) //flip board because the players have mirrored views, their color is always towards the bottom
    //of their screens
  })
});

server.listen(port, () => {
  console.log(`Express Server is running on port ${port}`);
}); 