import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import type { GameState } from './types';
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
const port = 5000;

app.get('/', ( _, res) => {
  res.send('Healthy');
});

const players: Record<string,{player_color: 'white' | 'black'}> = {};
let previous_game_state: null | GameState = null;

game_io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.join('room'); //one and only room for now
  
  socket.on('send_token',({token}) => {
    if (token in players) {
      return;
    }
    const new_token = generate_token();
    socket.emit('get_token',{ token: new_token })
  })

  socket.on('join_game',(message) => {  
    if (message.token in players) {
      game_io.emit("joined_room",{color: players[message.token]?.player_color,socket_id: socket.id});
      return;
    }
    const player_list = Object.keys(players);
    const color = (player_list.length > 1 && player_list[0] !== message.token) ? 'black' : 'white';
    game_io.to('room').emit("joined_room",{color , socket_id: socket.id});
    players[message.token] = {player_color: color};
  })

  socket.on('send_data_after_turn',(message) => {
    if (!check_legality(previous_game_state,message)) {
      return;
    }
    previous_game_state = message;
    message.board_state = flip_board(message.board_state)
    game_io.to('room').emit('received_data_after_turn',message) //flip board because the players have mirrored views, their color is always towards the bottom
    //of their screens
  })
});

server.listen(port, () => {
  console.log(`Express Server is running on port ${port}`);
}); 