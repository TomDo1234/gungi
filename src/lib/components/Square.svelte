<div
	class="bg-[#eecaa0] border-[#bc7e38] {items.length < 3 &&
		square_is_valid_move &&
		'border-purple-600'} p-1.5
	border-[0.5px] tablet:border border-solid tablet:w-16 laptop:w-20 desktop:w-24 aspect-square"
	use:dndzone={options}
	on:consider={handleDnd}
	on:finalize={handleDnd}
	role="application"
	on:mouseleave
>
	{#each items as piece, i (`${piece?.id}${i}`)}
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
	import { dndzone, type DndEventInfo, TRIGGERS } from 'svelte-dnd-action-gungi';
	import type { Piece } from '$lib/pieces';
	import Tile from '$lib/components/Tile.svelte';
	import { createEventDispatcher } from 'svelte';

	export let square_number: number; //Square number
	export let square_is_valid_move = false;
	export let currently_dragged_board_piece: Piece | null;

	let items: Piece[] = [];
	const dispatch = createEventDispatcher();

	function emitStackInfo() {
		dispatch('tower_details', { items });
	}

	function emitPieceInfo(piece: Piece) {
		dispatch('dropped_piece_info', { piece, square_number });
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
			emitPieceInfo(detailItems[0]);
			currently_dragged_board_piece = null;
		}

		items = detailItems;
	}

	$: options = {
		items,
		morphDisabled: true,
		dropFromOthersDisabled: items.length >= 3 || !square_is_valid_move,
		dropTargetClasses: ['border-purple-600'],
		dropTargetStyle: {}
	};
</script>
