<main
	class="bg-lime-800 min-w-screen min-h-screen text-white pt-12 tablet:pt-20 font-primaryfont flex flex-col justify-center items-center gap-y-5"
>
	<div
		class="flex flex-col laptop:flex-row gap-y-5 gap-x-6 laptop:gap-x-12 w-full justify-around items-center px-3 tablet:px-8 laptop:px-12"
	>
		<div class="grid grid-cols-9 h-fit w-full tablet:w-[unset]">
			{#each board_state as square, i}
				<Square { i } />
			{/each}
		</div>
		<div class="flex flex-col gap-y-6">
			<h2 class="font-bold text-4xl">Game Phase</h2>
			<div class="flex flex-col justify-between rounded-3xl bg-lime-950 text-white py-5 px-8">
				<h4>Tower details</h4>
			</div>
			{#each player_data as player, i}
				<div
					class="flex flex-col justify-between rounded-3xl gap-y-5 bg-lime-950 text-white py-5 px-8"
				>
					<div class="flex justify-between">
						<h4>{player.name}'s stockpile</h4>
					</div>
					<div
						class="grid grid-cols-3 tablet:grid-cols-7 laptop:grid-cols-6 desktop:grid-cols-8 gap-4"
						use:dndzone={{
							items: player.piece_data,
							dropFromOthersDisabled: true,
							dropTargetClasses: ['!outline-none']
						}}
						on:consider={(e) => (player_data[i] = handleStockpileDnDConsider(e, player_data[i]))}
					>
						{#each player.piece_data as piece (piece.id)}
							{@const piece_slug_name = piece.display_name.toLowerCase().replaceAll(' ', '')}
							<div class="h-12 laptop:h-14 aspect-square cursor-pointer relative">
								<img
									class="block"
									draggable="true"
									src="/img/{player.color}-{piece_slug_name}-1.svg"
									alt="{player.color}-{piece_slug_name}-1"
								/>
								<div
									class="rounded-full number_img h-7 bg-blue-950 aspect-square flex justify-center items-center absolute -top-3 -right-3"
								>
									{piece.amount}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>

<script lang="ts">
	import { dndzone } from 'svelte-dnd-action-gungi';
	import { piece_data, type BoardSquare, type Piece } from '$lib/pieces';
	import { handleStockpileDnDConsider } from '$lib/game';
	import Square from '$lib/components/Square.svelte';

	let board_state: BoardSquare[] = Array.from({ length: 81 }, (_, i) => {
		return { id: i, pieces: [] };
	});

	const player_data = [
		{
			name: 'Player 1',
			color: 'white',
			piece_data: structuredClone(piece_data).map((piece: Piece) => {
				piece.color = 'white';
				return piece;
			})
		},
		{
			name: 'Player 2',
			color: 'black',
			piece_data: structuredClone(piece_data).map((piece: Piece) => {
				piece.color = 'black';
				return piece;
			})
		}
	];
</script>

<style lang="postcss">
	h4 {
		@apply text-xl font-semibold;
	}

	:global(#dnd-action-dragged-el > .number_img) {
		@apply hidden;
	}
</style>
