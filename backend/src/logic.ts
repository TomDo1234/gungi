import { randomBytes } from "node:crypto";
import { BoardState, GameState } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function check_legality(prev_state: GameState | null | undefined, current_state: GameState) {
    if (prev_state === null || prev_state === undefined) {
        return true
    }
    return true
}

export function generate_token() {
    const encodeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^*()[]{};<>?";
    const rb = randomBytes(32);
    let token = "";
    for (let i = 0; i < rb.length; i++) {
        const j = rb[i] % encodeChars.length;
        token += encodeChars[j];
    }
    return token;
}

export function flip_board(board: BoardState): BoardState {
    const flippedBoard = [];

    for (let i = 8; i >= 0; i--) {
        const newRow = [];
        for (let j = 8; j >= 0; j--) {
            const square = board[i][j]
            square.id = (8 - i) * 9 + 8 - j
            for (let k = 0; k < square.pieces.length ; k++) {
                square.pieces[k].position = (8 - i) * 9 + 8 - j
            }
            newRow.push(square);
        }
        flippedBoard.push(newRow);
    }

    return flippedBoard;
}





