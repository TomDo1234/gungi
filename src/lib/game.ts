import { SHADOW_ITEM_MARKER_PROPERTY_NAME, TRIGGERS } from "svelte-dnd-action-gungi";
import type { Piece } from "./pieces";

export type PlayerData = {
    name: string;
    color: string;
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

function getMovesIn2DForm({ display_name, current_level }: Piece): [number,number][] {
    if (display_name === 'Pawn') {
        switch(current_level) {
            case 1:
                return [[-1,0]]
            default:
                return [[-1,0],[-1,-1],[-1,1]]
        }
    }
    else if (display_name === "Marshal (King)") {
        return [[-1,0],[-1,-1],[-1,1],[0,1],[0,-1],[1,1],[1,-1],[1,0]]
    }
    else if (display_name === 'Spy') {
        switch(current_level) {
            case 1:
                return [[-1,0]]
            case 2:
                return [[1,1],[1,-1],[-1,-1],[-1,1]]
            default: {
                const moves: [number,number][] = [];
                for (let i = 0;i < 9; i++) {
                    moves.push([-i,-i])
                    moves.push([-i,i])
                    moves.push([i,i])
                    moves.push([i,-i])
                    moves.push([0,-i])
                    moves.push([0,i])
                    moves.push([i,0])
                    moves.push([-i,0])
                }
                return moves;
            }
        }
    }
    return []
}

function getLegalMoves(position: number,moves: [number,number][]): number[] {
    const row = Math.floor(position / 9)
    const col = position % 9;
    const result: number[] = [];
    for (const [vertical_movement,horizontal_movement] of moves) {
        if (row + vertical_movement > 8 || row + vertical_movement < 0 || col + horizontal_movement > 8 || col + horizontal_movement < 0) {
            continue;
        }
        result.push((row + vertical_movement) * 9 + col + horizontal_movement)
    }
    return result
}

export function availableMoves(piece: Piece | undefined) {
    if (!piece?.position) {
        return []
    }
    const { position } = piece;

    const moves_in_2d = getMovesIn2DForm(piece);

    return getLegalMoves(position,moves_in_2d)
}

export function availableStockpileMoves(piece: Piece | null,board_state: Array<{ id: number, pieces: Piece[] }>[]) {
    if (!piece) {
        return []
    }

    const default_moves = Array.from({ length: 27 }, (_, i) => 54 + i);
    if (piece.display_name === "Pawn") {
        const pawn_taken_columns: number[] = [];
        for (const row of board_state) {
            for (const [i,square] of row.entries()) {
                for (const square_piece of square.pieces) {
                    if (square_piece?.display_name === "Pawn" && square_piece?.color === piece.color) {
                        pawn_taken_columns.push(i)
                        break;
                    }
                }
            }
        }

        return default_moves.filter(i => !pawn_taken_columns.includes(i % 9))
    }

    return default_moves;
}