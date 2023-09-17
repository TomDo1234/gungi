import { SHADOW_ITEM_MARKER_PROPERTY_NAME, TRIGGERS } from "svelte-dnd-action-gungi";
import type { BoardState, Piece } from "./pieces";

export type PlayerData = {
    name: string;
    color: 'white' | 'black';
    piece_data: Piece[];
}

let shouldIgnoreDndEvents = false;
export function handleStockpileDnDConsider(e: CustomEvent, data: Item[]): Item[] {
    const { trigger, id } = e.detail.info;
    let items = data;
    if (trigger === TRIGGERS.DRAG_STARTED) {
        const idx = items.findIndex((item) => item.id === id);
        const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`;
        // the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above
        e.detail.items = e.detail.items.filter(
            (item: Piece) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME as keyof Piece]
        );
        e.detail.items.splice(idx, 0, { ...items[idx], id: newId });
        items = e.detail.items;
        shouldIgnoreDndEvents = true;
    } else if (!shouldIgnoreDndEvents) {
        items = e.detail.items;
    } else {
        items = [...items];
    }

    return items
}

function getMovesIn2DForm({ display_name, current_level, position,color }: Piece, board_state: BoardState, square_data: BoardState[number][number], saved_level_for_captain: number | null = null): [number, number][] {
    current_level = saved_level_for_captain ?? current_level;
    if (display_name === 'Pawn') {
        switch (current_level) {
            case 1:
                return [[-1, 0]]
            default:
                return [[-1, 0], [-1, -1], [-1, 1]]
        }
    }
    else if (display_name === "Marshal (King)") {
        return [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 1], [1, -1], [1, 0]]
    }
    else if (display_name === "Fortress") {
        const default_moves: [number,number][] = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 1], [1, -1], [1, 0]]
        const moves: [number,number][] = [];
        for (const move of default_moves) {
            if (position === undefined) {
                continue;
            }
            const ver_position = Math.floor(position / 9) + move[0]; //move[0] is always negative 2 btw
            const horiz_position = (position % 9) + move[1];
            const not_out_of_bounds = position !== undefined && ver_position >= 0 && ver_position <= 8 && horiz_position >= 0 && horiz_position <= 8
            const pieces = board_state?.[ver_position]?.[horiz_position]?.pieces;
            if (not_out_of_bounds && pieces.length > (pieces?.[0]?.color === color ? 0 : 1)) { //coincidence btw, if the square piece is nothing then color is undefined so no skip, cause undefined will never equal to the checked piece color
                continue;
            }
            moves.push(move);
        }
        return moves;
    }
    else if (display_name === 'Captain') {
        if (square_data.pieces.length > 1) {
            //length + 1 line right below is for cases where the bottom piece is another captain;
            square_data.pieces.splice(0, 1);
            return getMovesIn2DForm(square_data.pieces[0], board_state, square_data, current_level);
        }
        return [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 1], [1, -1], [1, 0]]
    }
    else if (display_name === 'Spy') {
        switch (current_level) {
            case 1:
                return [[-1, 0]]
            case 2:
                return [[1, 1], [1, -1], [-1, -1], [-1, 1]]
            default: {
                const directions: [number, number][] = [[-1, 0], [1, 0], [0, 1], [0, -1],[-1, -1], [1, -1], [-1, 1], [1, 1]];
                const moves: [number, number][] = [];
                for (const direction of directions) {
                    for (let i = 1; i < 9; i++) {
                        moves.push([i * direction[0], i * direction[1]]);
                        if (position === undefined) {
                            break;
                        }
                        const ver_position = Math.floor(position / 9) + direction[0] * i; //move[0] is always negative 2 btw
                        const horiz_position = (position % 9) + direction[1] * i;
                        const not_out_of_bounds = position !== undefined && ver_position >= 0 && ver_position <= 8 && horiz_position >= 0 && horiz_position <= 8
                        if (not_out_of_bounds && board_state?.[ver_position]?.[horiz_position]?.pieces.length > 0) {
                            break;
                        }
                    }
                }
                return moves;
            }
        }
    }
    else if (display_name === 'Cannon') {
        switch (current_level) {
            case 1:
                return [[-1, 0], [1, 0], [0, 1], [0, -1]]
            default: {
                const directions: [number, number][] = [[-1, 0], [1, 0], [0, 1], [0, -1]];
                const moves: [number, number][] = [];
                for (const direction of directions) {
                    for (let i = 1; i <= (current_level === 2 ? 2 : 9); i++) {
                        moves.push([i * direction[0], i * direction[1]]);
                        if (position === undefined) {
                            break;
                        }
                        const ver_position = Math.floor(position / 9) + direction[0] * i; //move[0] is always negative 2 btw
                        const horiz_position = (position % 9) + direction[1] * i;
                        const not_out_of_bounds = position !== undefined && ver_position >= 0 && ver_position <= 8 && horiz_position >= 0 && horiz_position <= 8
                        if (not_out_of_bounds && board_state?.[ver_position]?.[horiz_position]?.pieces.length > 0) {
                            break;
                        }
                    }
                }
                return moves;
            }
        }
    }
    else if (display_name === 'Samurai') {
        switch (current_level) {
            case 1:
                return [[1, 1], [1, -1], [-1, -1], [-1, 1]]
            case 2:
                return [[2, 2], [2, -2], [-2, -2], [-2, 2]]
            default: {
                const directions: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
                const moves: [number, number][] = [];
                for (const direction of directions) {
                    for (let i = 1; i < 9; i++) {
                        moves.push([i * direction[0], i * direction[1]]);
                        if (position === undefined) {
                            break;
                        }
                        const ver_position = Math.floor(position / 9) + direction[0] * i; //move[0] is always negative 2 btw
                        const horiz_position = (position % 9) + direction[1] * i;
                        const not_out_of_bounds = position !== undefined && ver_position >= 0 && ver_position <= 8 && horiz_position >= 0 && horiz_position <= 8
                        if (not_out_of_bounds && board_state?.[ver_position]?.[horiz_position]?.pieces.length > 0) {
                            break;
                        }
                    }
                }
                return moves;
            }
        }
    }
    else if (display_name === 'Musketeer') {
        switch (current_level) {
            case 1:
                return [[-1, 0]]
            default: {
                const moves: [number, number][] = [];
                for (let i = 1; i <= (current_level === 2 ? 2 : 9); i++) {
                    moves.push([-i, 0])
                    if (position === undefined) {
                        break;
                    }
                    const ver_position = Math.floor(position / 9) - i; //move[0] is always negative 2 btw
                    const not_out_of_bounds = position !== undefined && ver_position >= 0 && ver_position <= 8
                    if (not_out_of_bounds && board_state[ver_position][position % 9]?.pieces.length > 0) {
                        break;
                    }
                }
                return moves;
            }
        }
    }
    else if (display_name === 'Knight') {
        switch (current_level) {
            case 1:
                return [[0, -1], [0, 1], [-2, 1], [-2, -1]]
            case 2:
                return [[-1, -2], [-1, 2], [-2, 1], [-2, -1]]
            default: {
                return [[-1, -2], [-1, 2], [-2, 1], [-2, -1], [1, 2], [1, -2], [2, -1], [2, 1]]
            }
        }
    }
    else if (display_name === 'Archer') {
        switch (current_level) {
            case 1:
                return [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 1], [1, -1], [1, 0]]
            case 2:
                return [[-2, 0], [-2, -2], [-2, 2], [0, 2], [0, -2], [2, 2], [2, -2], [2, 0], [-1, -2], [-1, 2], [-2, 1], [-2, -1], [1, 2], [1, -2], [2, -1], [2, 1]]
            default: {
                return [[-3, -3], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-3, 3], [3, -3],
                [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [3, 3], [-2, 3], [-1, 3], [0, 3], [1, 3], [2, 3], [-2, -3], [-1, -3], [0, -3], [1, -3], [2, -3]]
            }
        }
    }
    else if (display_name === 'General') {
        switch (current_level) {
            case 1:
                return [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 0]]
            case 2:
                return [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 1], [1, -1], [1, 0]]
            default: {
                const default_moves: [number, number][] = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 1], [1, -1], [1, 0]];
                const conditional_moves: [number, number][] = [[-2, 0], [-2, 1], [-2, -1]];
                for (const move of conditional_moves) {
                    if (position === undefined) {
                        break;
                    }

                    const ver_position = Math.floor(position / 9) + move[0]; //move[0] is always negative 2 btw
                    const horiz_position = (position % 9) + move[1];
                    const not_out_of_bounds = position !== undefined && ver_position >= 0 && ver_position <= 8 && horiz_position >= 0 && horiz_position <= 8
                    if (not_out_of_bounds && board_state[ver_position + 1][horiz_position]?.pieces.length > 0) {
                        continue;
                    }
                    default_moves.push(move) //out of bounds is ok btw because getLegalMoves purges that anyway
                }
                return default_moves
            }
        }
    }
    else if (display_name === 'Lieutenant General') {
        switch (current_level) {
            case 1:
                return [[-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]
            case 2:
                return [[-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1], [1, 0]]
            default: {
                return [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 1], [1, -1], [1, 0]]
            }
        }
    }
    else if (display_name === 'Major General') {
        switch (current_level) {
            case 1:
                return [[-1, 1], [-1, -1]]
            case 2:
                return [[-1, 1], [-1, -1], [-1, 0], [1, 1], [1, -1]]
            default: {
                return [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 0]]
            }
        }
    }
    return []
}

function getLegalMoves(position: number, moves: [number, number][],flip: boolean): number[] {
    const row = Math.floor(position / 9)
    const col = position % 9;
    const result: number[] = [];
    for (let [vertical_movement, horizontal_movement] of moves) {
        vertical_movement *= flip ? -1 : 1
        horizontal_movement *= flip ? -1 : 1
        if (row + vertical_movement > 8 || row + vertical_movement < 0 || col + horizontal_movement > 8 || col + horizontal_movement < 0) {
            continue;
        }
        result.push((row + vertical_movement) * 9 + col + horizontal_movement)
    }
    return result
}

export function availableMoves(piece: Piece | undefined, board_state: BoardState,client_player_color: 'white' | 'black' | null) {
    if (!piece?.position) {
        return []
    }
    const { position } = piece;

    const moves_in_2d = getMovesIn2DForm(piece, board_state, structuredClone(board_state[Math.floor(position / 9)][position % 9]));
    const legal_moves = getLegalMoves(position, moves_in_2d,client_player_color !== piece?.color);
    return legal_moves
}

export function availableStockpileMoves(piece: Piece | null, board_state: BoardState, players_ready: boolean, opponent_color: "white" | "black") {
    if (!piece) {
        return []
    }

    const default_moves = players_ready ? Array.from({ length: 54 }, (_, i) => 27 + i) : Array.from({ length: 27 }, (_, i) => 54 + i);

    const pawn_taken_columns: number[] = [];
    const owned_by_opponent: number[] = [];
    const already_owned_by_you: number[] = [];
    for (const [i, row] of board_state.entries()) {
        for (const [j, square] of row.entries()) {
            if (square.pieces?.[0]?.color === opponent_color) {
                owned_by_opponent.push(i * 9 + j)
                continue;
            }
            if (square.pieces?.[0]?.color !== opponent_color && square.pieces?.[0]?.color !== undefined) { //this means its your color, relevant for fortress
                already_owned_by_you.push(i * 9 + j)
            }
            for (const square_piece of square.pieces) {
                if (square_piece?.display_name === "Pawn" && square_piece?.color === piece.color) {
                    pawn_taken_columns.push(j)
                    break;
                }
            }
        }
    }

    if (piece.display_name === "Pawn") {
        return default_moves.filter(i => !pawn_taken_columns.includes(i % 9) && !owned_by_opponent.includes(i));
    }
    else if (piece.display_name === "Fortress") {
        return default_moves.filter(i => !already_owned_by_you.includes(i) && !owned_by_opponent.includes(i));
    }

    return default_moves.filter(i => !owned_by_opponent.includes(i));
}