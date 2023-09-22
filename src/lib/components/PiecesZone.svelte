<div class="flex flex-col gap-y-6">
	<h2 class="font-bold text-4xl">
		{players_ready ? 'Game' : 'Draft'} Phase {players_ready ? `- Turn ${turn}` : ''}
	</h2>
	<div class="flex flex-col gap-y-4 tablet:flex-row items-center tablet:items-start justify-between">
		{#each player_data ?? [] as player, i}
			<div class="flex gap-x-4 items-center flex-1">
				<h4 class="text-4xl font-bold {can_stack(i, stack_turn,players_ready) && 'text-purple-500'}">
					{player.name}
				</h4>
				<img
					class="h-10"
					src="/img/{player?.color}-marshal(king)-1.svg"
					alt="{player?.color}-marshal(king)-1"
				/>
			</div>
			{#if i === 0}
				<div class="flex-1 flex justify-center">
					<button
						class="rounded-2xl px-6 py-3 bg-dark-blue {stack_turn <=
							(client_player_color === 'black' ? 1 : 2) && 'opacity-70 pointer-events-none'}"
						on:click={player_ready ? forfeit : ready_player}
					>
						{player_ready ? 'FORFEIT' : 'READY'}
					</button>
				</div>
			{/if}
		{/each}
	</div>
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
	{#each player_data ?? [] as player, i (i)}
		<div class="flex flex-col justify-between rounded-3xl gap-y-5 bg-lime-950 text-white py-5 px-8">
			<div class="flex justify-between items-center">
				<h4>
					{player.name}'s stockpile
					<span
						class="text-purple-500 font-medium"
						class:hidden={players_ready || (i === 0 ? !player_ready : !other_player_ready)}
						>(Ready!)</span
					>
				</h4>
				{#if can_stack(i, stack_turn,players_ready) && stack_turn <= 2 && i === 0}
					<p class="text-purple-500 font-medium">*Move your Marshal first</p>
				{/if}
				<h4>Army Size: ({army_count(board_state, player.color)} / 26)</h4>
			</div>
			<div
				class="grid grid-cols-3 tablet:grid-cols-7 laptop:grid-cols-6 desktop:grid-cols-8 gap-4"
				use:dndzone={{
					items: player.piece_data,
					dropFromOthersDisabled: true,
					dropTargetClasses: ['!outline-none'],
					dragDisabled:
						i === 1 || army_count(board_state, player.color) >= 26 || !can_stack(i, stack_turn,players_ready)
				}}
				on:consider={(e) => handleConsider(e, i)}
				on:finalize={handleFinalize}
			>
				{#each player.piece_data as piece, j}
					{@const piece_slug_name = piece.display_name.toLowerCase().replaceAll(' ', '')}
					{#key `${piece.id}|${i}|${j}|${player.color}|${piece.amount}`}
						<div
							class="h-12 laptop:h-14 aspect-square relative
							{piece.display_name !== 'Marshal (King)' && stack_turn <= 2 ? 'pointer-events-none' : ''}"
							class:hidden={piece.amount <= 0}
						>
							<img
								class="block border-purple-600"
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
	import { dndzone, type DndEventInfo, TRIGGERS } from 'svelte-dnd-action';
	import { handleStockpileDnDConsider, type PlayerData } from '$lib/game';
	import type { Piece,BoardState } from '$lib/pieces';
	import type { Socket } from 'socket.io-client';

	export let tower_details: Piece[];
	export let board_state: BoardState;
	export let currently_dragged_stockpile_piece: Piece | null;
	export let client_player_color: 'white' | 'black' | null;
	export let turn: number;
	export let stack_turn: number;
	export let players_ready: boolean;
	export let player_ready: boolean;
	export let other_player_ready: boolean;
	export let game_id: string | null;
	export let player_data: PlayerData[];
	export let socket: Socket;

	function can_stack(player_number: number, stack_turn: number,players_ready: boolean) {
		if (players_ready) {
			return turn % 2 === (player_data[player_number].color === 'white' ? 1 : 0);
		}
		if ((player_number === 0 ? player_ready : other_player_ready) && !players_ready) {
			return false;
		}

		const normal_turn_condition =
			stack_turn % 2 === (player_data[player_number].color === 'black' ? 1 : 0);
		if (player_number === 0) {
			return normal_turn_condition || (other_player_ready && !players_ready);
		}
		return normal_turn_condition || (player_ready && !players_ready);
	}

	function army_count(board_state: BoardState, color: 'white' | 'black'): number {
		//Essentially, count the pieces of the same color in the entire board in all stacks
		return board_state.reduce(
			(a, b) =>
				a +
				b.reduce(
					(count, square) => count + square.pieces.filter((piece) => piece.color === color).length,
					0
				),
			0
		);
	}

	function forfeit() {}

	function ready_player() {
		player_ready = true;
		socket.emit('player_ready', { ready: true, game_id });
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

	function handleFinalize(e: CustomEvent) {
		const { items: detailItems, info }: { items: Item[]; info: DndEventInfo } = e.detail;
		if (info.trigger !== TRIGGERS.DROPPED_INTO_ANOTHER) {
			const dragged_item_index = detailItems.findIndex(
				(item) => item.id === currently_dragged_stockpile_piece?.id
			);
			const player_piece_data = player_data[0].piece_data;
			player_piece_data[dragged_item_index].amount += 1;
		}

		currently_dragged_stockpile_piece = null;
	}
</script>

<style lang="postcss">
	h4 {
		@apply text-xl font-semibold;
	}
</style>
