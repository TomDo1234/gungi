import { PUBLIC_WS_ENDPOINT } from "$env/static/public";
import { io } from "socket.io-client";

export const socket = io(`${PUBLIC_WS_ENDPOINT}/game_ws`);
export const lobby_socket = io(`${PUBLIC_WS_ENDPOINT}/lobby_ws`);