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
							{square_is_valid_move}
							is_client_turn={turn % 2 === (player_color === 'white' ? 1 : 0)}
							on:tower_details={showTowerDetails}
							on:mouseleave={clearTowerDetails}
							on:dropped_piece_info={update_board_state}
							bind:currently_dragged_board_piece
							bind:players_ready
						/>
					{/key}
				{/each}
			{/each}
		</div>
		<PiecesZone
			tower_details={currently_hovered_tower_details}
			{board_state}
			{turn}
			client_player_name={player_name}
			bind:currently_dragged_stockpile_piece
			bind:stack_turn
			bind:players_ready
		/>
	</div>
	<PlayerNameModal on:submit={(e) => (player_name = e.detail.name)} />
</main>

<script lang="ts">
	import PlayerNameModal from './../../lib/components/PlayerNameModal.svelte';
	import Square from '$lib/components/Square.svelte';
	import PiecesZone from '$lib/components/PiecesZone.svelte';
	import type { BoardState, Piece } from '$lib/pieces';
	import { availableMoves, availableStockpileMoves } from '$lib/game';
	import { socket } from '$lib/ws';

	let player_name: string | null = null;
	let player_color: 'white' | 'black' | null = null;
	let stack_turn = 1;
	let turn = 1;
	let players_ready = false;

	let board_state: BoardState = Array.from({ length: 9 }, (_, i) =>
		Array.from({ length: 9 }, (_, j) => ({ id: i * 9 + j, pieces: [] }))
	);

	socket.on('connect',() => {
		socket.on('joined_room',(message) => {
			if (message.socket_id === socket.id) {
				player_color = message.color;
				console.log(player_color)
			}
		})

		socket.on('received_data_after_turn',(message: SocketPayload) => {
			if (players_ready && message.turn % 2 === (player_color === 'white' ? 1 : 0)) {
				return;
			}
			if (!players_ready && message.stack_turn % 2 === (player_color === 'white' ? 1 : 0)) {
				return;
			}
			board_state = message.board_state
		})
	});

	function update_board_state(e: CustomEvent) {
		const { piece, square_number, mode } = e.detail;
		const currently_dragged_piece_position = currently_dragged_board_piece?.position;
		if (mode === 'add') {
			piece.id = square_number;
			const square = board_state[Math.floor(square_number / 9)][square_number % 9];
			square.pieces.unshift(piece);
		} else if (currently_dragged_piece_position) {
			//position only not null and recorded when the piece was already on the board
			//It prevents Army Size from ticking up when you drag to the same place or anywhere else
			const square =
				board_state[Math.floor(currently_dragged_piece_position / 9)][
					currently_dragged_piece_position % 9
				];
			square.pieces.shift();
			turn += 1;
			socket.emit("send_data_after_turn",{board_state, turn, stack_turn});
		}

		board_state = board_state;
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
		available_moves = [];
		if (currently_dragged_board_piece || currently_hovered_tower_details.length > 0) {
			available_moves = availableMoves(
				currently_hovered_tower_details?.[0] ?? currently_dragged_board_piece
			);
		}
		if (currently_dragged_stockpile_piece) {
			available_moves = availableStockpileMoves(currently_dragged_stockpile_piece, board_state);
		}
	}
</script>

<style lang="postcss">
	:global(#dnd-action-dragged-el > .number_img) {
		@apply hidden;
	}
</style>
