"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const logic_1 = require("./logic");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"]
    }
});
const game_io = io.of('/game_ws');
const port = 5000;
app.get('/', (_, res) => {
    res.send('Healthy');
});
const players = [];
let previous_game_state = null;
game_io.on('connection', (socket) => {
    console.log('a user connected');
    socket.join('room'); //one and only room for now
    players.push(socket);
    socket.on('send_data_after_turn', (message) => {
        if (!(0, logic_1.check_legality)(previous_game_state, message)) {
            return;
        }
        previous_game_state = message;
        console.log(message);
        game_io.emit('received_data_after_turn', message);
    });
});
server.listen(port, () => {
    console.log(`Express Server is running on port ${port}`);
});
