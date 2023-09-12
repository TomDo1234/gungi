<div
	class="bg-[#eecaa0] border-[#bc7e38] border-t tablet:border-t-2 border-r p-1.5 tablet:border-r-2 border-solid tablet:w-16 laptop:w-20 desktop:w-24 aspect-square
	{i % 9 === 0 && 'border-l tablet:border-l-2'} {i >= 72 && 'border-b tablet:border-b-2'}"
	style={items.find((tile) => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME])
		? 'background: rgba(255, 255, 255, 0.2)'
		: ''}
	use:dndzone={options}
	on:consider={handleDnd}
	on:finalize={handleDndFinalize}
>
	{#each items as tile, i (tile.id)}
		<Tile letter={tile.display_name} hidden={i > 0 && finalized} />
	{/each}
</div>

<script lang="ts">
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action-gungi';

	import Tile from './Tile.svelte';
	let items: Item[] = [];
	export let i: number;
	let finalized = false;
	function handleDnd(e: CustomEvent) {
		finalized = false;
		items = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent) {
		items = e.detail.items;
		finalized = true;
	}

	$: options = {
		items
	};
</script>

<style>
	.square {
		border: 2px solid #272727;
		height: calc(2px + min(5vmin, 50px));
		width: calc(2px + min(5vmin, 50px));
		border-radius: calc(min(5vmin, 50px) / 6.25);
		background-color: #393939;
	}
</style>
