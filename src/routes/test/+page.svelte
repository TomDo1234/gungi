<div class="game-container">
	<div class="grid">
		{#each boardGrid as col}
			<div class="col">
				{#each col as _}
					<Square />
				{/each}
			</div>
		{/each}
	</div>

	<div class="rack" use:dndzone={options} on:consider={(e) => items = handleStockpileDnDConsider(e,items)} on:finalize={handleDnd}>
		{#each items as item (item.id)}
			<div>
				<Tile letter={item.letter} />
			</div>
		{/each}
	</div>
</div>

<script lang="ts" >
	import { dndzone } from 'svelte-dnd-action-gungi';

	import Tile from './Tile.svelte';
	import Square from './Square.svelte';
	import { handleStockpileDnDConsider } from '$lib/game';

	let idx = 0;

	let items = [
		{ id: idx++, letter: 'A' },
		{ id: idx++, letter: 'B' },
		{ id: idx++, letter: 'C' },
		{ id: idx++, letter: 'D' },
		{ id: idx++, letter: 'E' },
		{ id: idx++, letter: 'F' },
		{ id: idx++, letter: 'G' }
	];

	function handleDnd(e: CustomEvent) {
		items = e.detail.items;
	}

	// of type { id: number }[][];
	const boardGrid = Array.from({ length: 9 }, (_, i) =>
		Array.from({ length: 9 }, (_, j) => ({ id: i * 9 + j }))
	);

	$: options = {
		items,
		morphDisabled: true
	};
</script>

<style>
	:global(body *) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.game-container {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #272727;
	}

	.grid {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.col {
		display: flex;
		flex-direction: column;
	}

	.rack {
		display: flex;
		justify-content: flex-start;
		flex-grow: 0;
		width: calc((min(5vmin, 50px) + 4px) * 7);
	}
	.rack > * {
		margin: 2px;
	}
</style>
