<main
	class="bg-lime-800 min-w-screen min-h-screen text-white pt-12 tablet:pt-20 font-primaryfont flex flex-col justify-center items-center gap-y-5"
>
	<div
		class="flex flex-col laptop:flex-row gap-y-5 gap-x-6 laptop:gap-x-12 w-full justify-around items-center px-3 tablet:px-8 laptop:px-12"
	>
		<div class="grid grid-cols-9 h-fit w-full tablet:w-[unset]">
			{#each board_state as row, i}
				{#each row as _, j}
					{@const square_number = 9 * i + j}
					{@const square_is_valid_move = available_moves.includes(square_number)}
					{#key square_number}
						<Square
							{square_number}
							{ square_is_valid_move }
							on:tower_details={showTowerDetails}
							on:mouseleave={clearTowerDetails}
							on:dropped_piece_info={update_board_state}
							bind:currently_dragged_board_piece
						/>
					{/key}
				{/each}
			{/each}
		</div>
		<PiecesZone
			tower_details={currently_hovered_tower_details}
			bind:currently_dragged_stockpile_piece
		/>
	</div>
</main>

<script lang="ts">
	import Square from '$lib/components/Square.svelte';
	import PiecesZone from '$lib/components/PiecesZone.svelte';
	import type { Piece } from '$lib/pieces';
	import { availableMoves, availableStockpileMoves } from '$lib/game';

	let board_state: Array<{ id: number, pieces: Piece[] }>[] = Array.from({ length: 9 }, (_, i) =>
		Array.from({ length: 9 }, (_, j) => ({ id: i * 9 + j,pieces:[] }))
	);

	function update_board_state(e: CustomEvent) {
		const { piece,square_number } = e.detail;
		piece.id = square_number;
		const square = board_state[Math.floor(square_number / 9)][square_number % 9]
		square.pieces.unshift(piece);
		board_state = board_state
	}

	let currently_hovered_tower_details: Piece[] = [];
	function showTowerDetails(e: CustomEvent) {
		currently_hovered_tower_details = e.detail.items;
	}

	function clearTowerDetails() {
		currently_hovered_tower_details = [];
	}

	let currently_dragged_stockpile_piece: Piece | null = null;
	let currently_dragged_board_piece: Piece | null = null;

	let available_moves: number[] = [];
	$: {
		available_moves = []
		if (currently_dragged_board_piece || currently_hovered_tower_details.length > 0) {
			available_moves = availableMoves(currently_hovered_tower_details?.[0] ?? currently_dragged_board_piece);
		}
		if (currently_dragged_stockpile_piece) {
			available_moves = availableStockpileMoves(currently_dragged_stockpile_piece,board_state);
		}
	}
</script>

<style lang="postcss">
	:global(#dnd-action-dragged-el > .number_img) {
		@apply hidden;
	}
</style>
