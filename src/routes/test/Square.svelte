<div
	class="square"
	style={items.find((tile) => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME])
		? 'background: rgba(255, 255, 255, 0.2)'
		: ''}
	use:dndzone={options}
	on:consider={handleDnd}
	on:finalize={handleDnd}
>
	{#each items as tile (tile.id)}
		<Tile letter={tile.letter} />
	{/each}
</div>

<script lang="ts" >
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action-gungi';

	import Tile from './Tile.svelte';
	let items: Item[] = [];

	function handleDnd(e: CustomEvent) {
		items = e.detail.items;
	}

	$: options = {
		dropFromOthersDisabled: items.length > 0,
		items,
		dropTargetStyle: {}
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
