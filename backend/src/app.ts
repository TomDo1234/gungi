import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

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

game_io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Express Server is running on port ${port}`);
}); 