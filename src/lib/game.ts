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

function getMovesIn2DForm({ display_name, current_level }: Piece): [number,number][] {
    if (display_name === 'Pawn') {
        switch(current_level) {
            case 1:
                return [[-1,0]]
            default:
                return [[-1,0],[-1,-1],[-1,1]]
        }
    }
    else if (display_name === "Marshal (King)" || display_name === "Fortress" || display_name === 'Captain') {
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
    else if (display_name === 'Cannon') {
        switch(current_level) {
            case 1:
                return [[-1,0],[1,0],[0,1],[0,-1]]
            case 2:
                return [[-1,0],[1,0],[0,1],[0,-1],[-2,0],[2,0],[0,2],[0,-2]]
            default: {
                const moves: [number,number][] = [];
                for (let i = 0;i < 9; i++) {
                    moves.push([0,-i])
                    moves.push([0,i])
                    moves.push([i,0])
                    moves.push([-i,0])
                }
                return moves;
            }
        }
    }
    else if (display_name === 'Samurai') {
        switch(current_level) {
            case 1:
                return [[1,1],[1,-1],[-1,-1],[-1,1]]
            case 2:
                return [[2,2],[2,-2],[-2,-2],[-2,2]]
            default: {
                const moves: [number,number][] = [];
                for (let i = 0;i < 9; i++) {
                    moves.push([-i,-i])
                    moves.push([-i,i])
                    moves.push([i,i])
                    moves.push([i,-i])
                }
                return moves;
            }
        }
    }
    else if (display_name === 'Musketeer') {
        switch(current_level) {
            case 1:
                return [[-1,0]]
            case 2:
                return [[-1,0],[-2,0]]
            default: {
                const moves: [number,number][] = [];
                for (let i = 0;i < 9; i++) {
                    moves.push([-i,0])
                }
                return moves;
            }
        }
    }
    else if (display_name === 'Knight') {
        switch(current_level) {
            case 1:
                return [[0,-1],[0,1],[-2,1],[-2,-1]]
            case 2:
                return [[-1,-2],[-1,2],[-2,1],[-2,-1]]
            default: {
                return [[-1,-2],[-1,2],[-2,1],[-2,-1],[1,2],[1,-2],[2,-1],[2,1]]
            }
        }
    }
    else if (display_name === 'Archer') {
        switch(current_level) {
            case 1:
                return [[-1,0],[-1,-1],[-1,1],[0,1],[0,-1],[1,1],[1,-1],[1,0]]
            case 2:
                return [[-2,0],[-2,-2],[-2,2],[0,2],[0,-2],[2,2],[2,-2],[2,0],[-1,-2],[-1,2],[-2,1],[-2,-1],[1,2],[1,-2],[2,-1],[2,1]]
            default: {
                return [[-3,-3],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-3,3],[3,-3],
                [3,-2],[3,-1],[3,0],[3,1],[3,2],[3,3],[-2,3],[-1,3],[0,3],[1,3],[2,3],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3]]
            }
        }
    }
    else if (display_name === 'General') {
        switch(current_level) {
            case 1:
                return [[-1,0],[-1,-1],[-1,1],[0,1],[0,-1],[1,0]]
            case 2:
                return [[-1,0],[-1,-1],[-1,1],[0,1],[0,-1],[1,1],[1,-1],[1,0]]
            default: {
                return [[-1,0],[-1,-1],[-1,1],[0,1],[0,-1],[1,1],[1,-1],[1,0],[-2,0],[-2,1],[-2,-1]]
            }
        }
    }
    else if (display_name === 'Lieutenant General') {
        switch(current_level) {
            case 1:
                return [[-1,0],[-1,-1],[-1,1],[1,1],[1,-1]]
            case 2:
                return [[-1,0],[-1,-1],[-1,1],[1,1],[1,-1],[1,0]]
            default: {
                return [[-1,0],[-1,-1],[-1,1],[0,1],[0,-1],[1,1],[1,-1],[1,0]]
            }
        }
    }
    else if (display_name === 'Major General') {
        switch(current_level) {
            case 1:
                return [[-1,1],[-1,-1]]
            case 2:
                return [[-1,1],[-1,-1],[-1,0],[1,1],[1,-1]]
            default: {
                return [[-1,0],[-1,-1],[-1,1],[0,1],[0,-1],[1,0]]
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

export function availableStockpileMoves(piece: Piece | null,board_state: BoardState,players_ready: boolean) {
    if (!piece) {
        return []
    }

    const default_moves = players_ready ? Array.from({ length: 54 }, (_, i) => 27 + i) : Array.from({ length: 27 }, (_, i) => 54 + i);
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