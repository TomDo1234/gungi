<div class="flex flex-col gap-y-6">
	<h2 class="font-bold text-4xl">Game Phase</h2>
	<div class="flex flex-col justify-between rounded-3xl bg-lime-950 text-white py-5 px-8">
		<h4>Tower details</h4>
		<div class="flex flex-wrap justify-around">
			{#each { length: 3 } as _, i}
				{@const piece = tower_details[i]}
				{@const piece_slug_name = piece?.display_name?.toLowerCase()?.replaceAll(' ', '')}
				<div class="flex flex-col gap-y-2 mt-2" class:invisible={!piece}>
					<h5 class="text-center font-medium">Tier {tower_details.length - i}</h5>
					{#if piece}
						<img
							class="block aspect-square h-14"
							src="/img/{piece?.color}-{piece_slug_name}-1.svg"
							alt="{piece?.color}-{piece_slug_name}-1"
						/>
					{:else}
						<div class="block aspect-square h-14" />
					{/if}
				</div>
			{/each}
		</div>
	</div>
	{#each player_data as player, i}
		<div class="flex flex-col justify-between rounded-3xl gap-y-5 bg-lime-950 text-white py-5 px-8">
			<div class="flex justify-between">
				<h4>{player.name}'s stockpile</h4>
				<h4>Army Size: ({army_count(board_state,player.color)} / 26)</h4>
			</div>
			<div
				class="grid grid-cols-3 tablet:grid-cols-7 laptop:grid-cols-6 desktop:grid-cols-8 gap-4"
				use:dndzone={{
					items: player.piece_data,
					dropFromOthersDisabled: true,
					dropTargetClasses: ['!outline-none'],
					dragDisabled: i === 1
				}}
				on:consider={(e) => handleConsider(e, i)}
				on:finalize={handleFinalize}
			>
				{#each player.piece_data as piece, i}
					{@const piece_slug_name = piece.display_name.toLowerCase().replaceAll(' ', '')}
					{#key `${piece.id}|${i}|${player.color}`}
						<div class="h-12 laptop:h-14 aspect-square relative" class:hidden={piece.amount <= 0}>
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
					{/key}
				{/each}
			</div>
		</div>
	{/each}
</div>

<script lang="ts">
	import { dndzone, type DndEventInfo, TRIGGERS } from 'svelte-dnd-action-gungi';
	import { handleStockpileDnDConsider, type PlayerData } from '$lib/game';
	import { piece_data, type Piece, type BoardState } from '$lib/pieces';

	export let tower_details: Piece[];
	export let board_state: BoardState;
	export let currently_dragged_stockpile_piece: Piece | null;

	const player_data: PlayerData[] = [
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

	function army_count(board_state: BoardState,color: 'white' | 'black'): number {
		//Essentially, count the pieces of the same color in the entire board in all stacks
		return board_state.reduce((a,b) => a + b.reduce((count,square) => count + square.pieces.filter(piece => piece.color === color).length,0),0)
	}

	function handleConsider(e: CustomEvent, player_number: number) {
		let updated_player_data = handleStockpileDnDConsider(e, player_data[player_number].piece_data);
		const { items: detailItems, info }: { items: Item[]; info: DndEventInfo } = e.detail;
		const dragged_item_index = detailItems.findIndex(
			(item) => item.id === 'id:dnd-shadow-placeholder-0000'
		);

		if (dragged_item_index !== -1 && info.trigger === TRIGGERS.DRAGGED_ENTERED) {
			const update_index = updated_player_data.findIndex(
				(item) => item?.display_name === detailItems[dragged_item_index]?.display_name
			);

			updated_player_data[update_index].amount -= currently_dragged_stockpile_piece ? 0 : 1;

			currently_dragged_stockpile_piece = updated_player_data[update_index];
		}

		player_data[player_number].piece_data = updated_player_data;
	}

	function handleFinalize() {
		currently_dragged_stockpile_piece = null;
	}
</script>

<style lang="postcss">
	h4 {
		@apply text-xl font-semibold;
	}
</style>
