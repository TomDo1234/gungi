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

export function availableMoves(piece: Piece | undefined) {
    if (!piece?.position) {
        return []
    }
    const { position,display_name } = piece;
    const row = Math.floor(position / 9)
    const col = position % 9;
    return []
}

export function availableStockpileMoves(piece: Piece | null) {
    if (!piece) {
        return []
    }

    return Array.from({ length: 27 }, (_, i) => 54 + i);
}