<main
	class="bg-lime-800 min-w-screen min-h-screen text-white pt-12 tablet:pt-20 font-primaryfont flex flex-col justify-center items-center gap-y-5"
>
	<div
		class="flex flex-col laptop:flex-row gap-y-5 gap-x-6 laptop:gap-x-12 w-full justify-around items-center px-3 tablet:px-8 laptop:px-12"
	>
		<div class="grid grid-cols-9 h-fit w-full tablet:w-[unset]">
			{#each board_state as row}
				{#each row as square, i}
					<Square {i} />
				{/each}
			{/each}
		</div>
		<PiecesZone />
	</div>
</main>

<script lang="ts">
	import Square from '$lib/components/Square.svelte';
	import PiecesZone from '$lib/components/PiecesZone.svelte';

	let board_state: {id: number}[][] = Array.from({ length: 9 }, (_, i) =>
		Array.from({ length: 9 }, (_, j) => ({ id: i * 9 + j }))
	);
</script>

<style lang="postcss">

	:global(#dnd-action-dragged-el > .number_img) {
		@apply hidden;
	}
</style>
