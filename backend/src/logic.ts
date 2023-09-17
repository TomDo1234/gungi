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
    const numRows = 9;
    const numCols = 9;

    const flippedBoard = [];

    for (let i = numRows - 1; i >= 0; i--) {
        const newRow = [];
        for (let j = numCols - 1; j >= 0; j--) {
            const square = board[i][j]
            square.id = (8 - i) * 9 + 8 - j
            if (square.pieces.length > 0) {
                square.pieces[0].position = 80 - (square.pieces[0]?.position ?? 0)
            }
            newRow.push(square);
        }
        flippedBoard.push(newRow);
    }

    return flippedBoard;
}





