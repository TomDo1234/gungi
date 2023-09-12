<main
	class="bg-lime-800 min-w-screen min-h-screen text-white pt-12 tablet:pt-20 font-primaryfont flex flex-col justify-center items-center gap-y-5"
>
	<div
		class="flex flex-col laptop:flex-row gap-y-5 gap-x-6 laptop:gap-x-12 w-full justify-around items-center px-3 tablet:px-8 laptop:px-12"
	>
		<div class="grid grid-cols-9 h-fit w-full tablet:w-[unset]">
			{#each board_state as row,i}
				{#each row as _, j}
					<Square square_number={9*i + j} square_is_valid_move={true} on:tower_details={showTowerDetails} on:mouseleave={clearTowerDetails}  />
				{/each}
			{/each}
		</div>
		<PiecesZone tower_details={currently_hovered_tower_details} />
	</div>
</main>

<script lang="ts">
	import Square from '$lib/components/Square.svelte';
	import PiecesZone from '$lib/components/PiecesZone.svelte';
	import type { Piece } from '$lib/pieces';

	let board_state: {id: number}[][] = Array.from({ length: 9 }, (_, i) =>
		Array.from({ length: 9 }, (_, j) => ({ id: i * 9 + j }))
	);

	let currently_hovered_tower_details: Piece[] = [];
	function showTowerDetails(e: CustomEvent) {
		currently_hovered_tower_details = e.detail.items
	}
	function clearTowerDetails() {
		currently_hovered_tower_details = [];
	}
</script>

<style lang="postcss">

	:global(#dnd-action-dragged-el > .number_img) {
		@apply hidden;
	}
</style>
