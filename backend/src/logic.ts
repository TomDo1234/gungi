import { GameState } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function check_legality(prev_state: GameState | null,current_state: GameState) {
    if (prev_state === null) {
        return true
    }
    return true
}