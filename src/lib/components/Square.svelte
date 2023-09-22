<div
	class="bg-[#eecaa0] border-[#bc7e38] {(items.length < 3 || client_player_color !== items[0].color) &&
		square_is_valid_move &&
		'border-purple-600'} p-1.5
	border-[0.5px] tablet:border border-solid tablet:w-16 laptop:w-20 desktop:w-24 aspect-square"
	use:dndzone={options}
	on:consider={handleDnd}
	on:finalize={handleDnd}
	role="application"
	on:mouseleave
>
	{#each items as piece, i (`${piece?.id}|${i}|${piece.display_name}|${piece.color}`)}
		<Tile
			on:mouseover={emitStackInfo}
			on:focus={emitStackInfo}
			{piece}
			stack_length={items.length}
			hidden={i > 0}
		/>
	{/each}
</div>

<script lang="ts">
	import { dndzone, type DndEventInfo, TRIGGERS } from 'svelte-dnd-action';
	import type { Piece } from '$lib/pieces';
	import Tile from '$lib/components/Tile.svelte';
	import { createEventDispatcher } from 'svelte';

	export let square_number: number; //Square number
	export let square_is_valid_move = false;
	export let currently_dragged_board_piece: Piece | null;
	export let is_client_turn: boolean;
	export let players_ready: boolean;
	export let client_player_color: 'white' | 'black' | null;

	export let items: Piece[];
	const dispatch = createEventDispatcher();

	function emitStackInfo() {
		dispatch('tower_details', { items });
	}

	function emitPieceInfo(piece: Piece,mode: 'add' | 'remove') {
		dispatch('dropped_piece_info', { piece, square_number, mode });
	}

	function handleDnd(e: CustomEvent) {
		const { items: detailItems, info }: { items: Piece[]; info: DndEventInfo } = e.detail;
		const dragged_item_index = detailItems.findIndex(
			(item) => item?.id === 'id:dnd-shadow-placeholder-0000'
		);

		if (dragged_item_index !== -1) {
			const moved_item = detailItems.splice(dragged_item_index, 1)[0];
			detailItems.unshift(moved_item);
			currently_dragged_board_piece = moved_item;
		} else if (info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			detailItems[0].position = square_number;
			detailItems[0].current_level = detailItems.length;
			emitPieceInfo(currently_dragged_board_piece as Piece,'remove')
			emitPieceInfo(detailItems[0],'add');
			currently_dragged_board_piece = null;
		}

		items = detailItems;
	}

	$: options = {
		items,
		morphDisabled: true,
		flipDurationMs: 0,
		dropFromOthersDisabled: (items.length >= 3 && items[0].color === client_player_color ) || !square_is_valid_move,
		dropTargetClasses: ['border-purple-600'],
		dropTargetStyle: {},
		dragDisabled: !is_client_turn || !players_ready || items.at(0)?.color !== client_player_color
	};
</script>
