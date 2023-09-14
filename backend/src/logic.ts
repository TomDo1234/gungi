import { randomBytes } from "node:crypto";
import { GameState } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function check_legality(prev_state: GameState | null,current_state: GameState) {
    if (prev_state === null) {
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