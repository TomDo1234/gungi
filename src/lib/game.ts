import { SHADOW_ITEM_MARKER_PROPERTY_NAME, TRIGGERS } from "svelte-dnd-action-gungi";
import type { BoardPiece, BoardSquare, Piece } from "./pieces";

type PlayerData = {
    name: string;
    color: string;
    piece_data: Piece[];
}

export function handleGameMove(e: CustomEvent, board_state: BoardSquare[]): { id: number; pieces: BoardPiece[] }[] {
    const { items, info } = e.detail;
    const index = items.findIndex((item: BoardSquare | Piece) => {
        if ("pieces" in item) { //Checking if it is BoardSquare and not Piece
            return false
        }
        return info.id === item.id
    });

    if (index === -1) {
        return board_state
    }

    const piece_data: Piece = items[index];
    board_state[index].pieces.unshift({
        color: piece_data.color ?? 'black',
        piece_type: piece_data.display_name?.toLowerCase()?.replaceAll(' ', '') as BoardPiece['piece_type']
    })
    return board_state
}

let shouldIgnoreDndEvents = false;
export function handleStockpileDnDConsider(e: CustomEvent, player_data: PlayerData): PlayerData {
    const { trigger, id } = e.detail.info;
    const items = player_data.piece_data;
    if (trigger === TRIGGERS.DRAG_STARTED) {
        const idx = items.findIndex((item) => item.id === id);
        const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`;
        // the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above
        e.detail.items = e.detail.items.filter(
            (item: Piece) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME as keyof Piece]
        );
        e.detail.items.splice(idx, 0, { ...items[idx], id: newId });
        player_data.piece_data = e.detail.items;
        shouldIgnoreDndEvents = true;
    } else if (!shouldIgnoreDndEvents) {
        player_data.piece_data = e.detail.items;
    } else {
        player_data.piece_data = [...items];
    }

    return player_data
}
