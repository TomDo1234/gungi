<div
	class="bg-[#eecaa0] border-[#bc7e38] border-t tablet:border-t-2 border-r p-1.5 tablet:border-r-2 border-solid tablet:w-16 laptop:w-20 desktop:w-24 aspect-square
				{square_number % 9 === 0 && 'border-l tablet:border-l-2'} {square_number >= 72 &&
		'border-b tablet:border-b-2'}"
	use:dndzone={options}
	on:consider={handleDnd}
	on:finalize={handleDnd}
	role="application"
	on:mouseleave
>
	{#each items as tile, i (tile.id)}
		<Tile
			on:mouseover={emitStackInfo}
			on:focus={emitStackInfo}
			piece={tile}
			stack_length={items.length}
			hidden={i > 0}
		/>
	{/each}
</div>

<script lang="ts">
	import { dndzone, type DndEventInfo } from 'svelte-dnd-action';

	import Tile from '$lib/components/Tile.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Piece } from '$lib/pieces';
	let items: Piece[] = [];
	const dispatch = createEventDispatcher();

	function emitStackInfo() {
		dispatch('tower_details', { items });
	}
	export let square_number: number;
	function handleDnd(e: CustomEvent) {
		const { items: detailItems }: { items: Piece[]; info: DndEventInfo } = e.detail;
		const dragged_item_index = detailItems.findIndex(
			(item) => item.id === 'id:dnd-shadow-placeholder-0000'
		);

		if (dragged_item_index !== -1) {
			const moved_item = detailItems.splice(dragged_item_index, 1)[0];
			detailItems.unshift(moved_item);
		}

		items = detailItems;
	}

	$: options = {
		items,
		morphDisabled: true,
		flipDurationMs: 0,
		dropFromOthersDisabled: items.length >= 3,
		dropTargetClasses: ['!outline-none']
	};
</script>
