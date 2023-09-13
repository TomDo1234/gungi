import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { GameState } from './types';
import { check_legality } from './logic';

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

const players = [];
let previous_game_state: null | GameState = null;
game_io.on('connection', (socket) => {
  console.log('a user connected');

  socket.join('room'); //one and only room for now
  players.push(socket)

  socket.on('send_data_after_turn',(message) => {
    if (!check_legality(previous_game_state,message)) {
      return;
    }
    previous_game_state = message;
    console.log(message);
    game_io.emit('received_data_after_turn',message)
  })
});

server.listen(port, () => {
  console.log(`Express Server is running on port ${port}`);
}); 