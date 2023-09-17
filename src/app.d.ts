// See https://kit.svelte.dev/docs/types#app

import type { PlayerData } from "$lib/game";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

	}
	declare type Item = import("svelte-dnd-action").Item;
	declare type DndEvent<ItemType = Item> = import("svelte-dnd-action").DndEvent<ItemType>;
	declare type SocketPayload = {board_state: BoardState,turn: number,stack_turn: number,player_data: PlayerData[]};
	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			"on:consider"?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
			"on:finalize"?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		}
	}
}




export { };
