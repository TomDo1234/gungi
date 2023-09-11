<div class="flex flex-col gap-y-6">
	<h2 class="font-bold text-4xl">Game Phase</h2>
	<div class="flex flex-col justify-between rounded-3xl bg-lime-950 text-white py-5 px-8">
		<h4>Tower details</h4>
	</div>
	{#each player_data as player, i}
		<div class="flex flex-col justify-between rounded-3xl gap-y-5 bg-lime-950 text-white py-5 px-8">
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
				on:consider={(e) => (player_data[i].piece_data = handleStockpileDnDConsider(e, player_data[i].piece_data))}
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

<script lang="ts">
	import { dndzone } from 'svelte-dnd-action-gungi';
	import { handleStockpileDnDConsider } from '$lib/game';
	import { piece_data, type Piece } from '$lib/pieces';

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
</style>
