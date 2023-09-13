<div class="game-container">
	<div class="grid">
		{#each boardGrid as col, i}
			<div class="row">
				{#each col as _, j}
					<Square square_number={9 * i + j} />
				{/each}
			</div>
		{/each}
	</div>

	<div
		class="rack"
		use:dndzone={options}
		on:consider={(e) => (items = handleStockpileDnDConsider(e, items))}
		on:finalize={handleDnd}
	>
		{#each items as item (item.id)}
			<div>
				<Tile letter={item.display_name} />
			</div>
		{/each}
	</div>
	<PiecesZone tower_details={[]} bind:currently_dragged_stockpile_piece stack_turn={0} turn={0} board_state={[]} />
</div>

<script lang="ts">
	import PiecesZone from './../../lib/components/PiecesZone.svelte';
	import { dndzone } from 'svelte-dnd-action-gungi';

	import Tile from './Tile.svelte';
	import Square from './Square.svelte';
	import { handleStockpileDnDConsider } from '$lib/game';
	import type { Piece } from '$lib/pieces';

	let idx = 0;
	let currently_dragged_stockpile_piece: Piece | null = null;

	let items = [
		{
			id: 1,
			amount: 4,
			levels: 3,
			display_name: 'Major General',
			color: 'white'
		},
		{
			id: 2,
			amount: 4,
			levels: 3,
			display_name: 'Lieutenant General',
			color: 'white'
		},
		{
			id: 3,
			amount: 6,
			levels: 3,
			display_name: 'General',
			color: 'white'
		},
		{
			id: 4,
			amount: 2,
			levels: 3,
			display_name: 'Archer',
			color: 'white'
		},
		{
			id: 5,
			amount: 2,
			levels: 3,
			display_name: 'Knight',
			color: 'white'
		},
		{
			id: 6,
			amount: 1,
			levels: 3,
			display_name: 'Musketeer',
			color: 'white'
		},
		{
			id: 7,
			amount: 1,
			levels: 1,
			display_name: 'Captain',
			note: 'The captain takes on the movement ability of the piece (friendly or opponent) that is directly below it.',
			color: 'white'
		},
		{
			id: 8,
			amount: 2,
			levels: 3,
			display_name: 'Samurai',
			color: 'white'
		},
		{
			id: 9,
			amount: 1,
			levels: 1,
			display_name: 'Fortress',
			note: "Fortresses can't stack on other pieces; they can only be stacked upon.",
			color: 'white'
		},
		{
			id: 10,
			amount: 2,
			levels: 3,
			display_name: 'Cannon',
			color: 'white'
		},
		{
			id: 11,
			amount: 2,
			levels: 3,
			display_name: 'Spy',
			color: 'white'
		},
		{
			id: 12,
			amount: 9,
			levels: 3,
			display_name: 'Pawn',
			color: 'white'
		},
		{
			id: 14,
			amount: 1,
			levels: 1,
			display_name: 'Marshal (King)',
			note: 'The Marshal moves the same for all tiers. Pieces cannot be stacked on the Marshal.',
			color: 'white'
		}
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
		flex-direction: column;
		justify-content: center;
	}
	.row {
		display: flex;
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
