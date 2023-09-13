import { BoardState } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function check_legality(prev_state: BoardState | null,current_state: BoardState) {
    if (prev_state === null) {
        return true
    }
    return true
}