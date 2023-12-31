<main
	class="bg-lime-800 min-w-screen min-h-screen text-white pt-12 tablet:pt-20 font-primaryfont flex flex-col justify-center items-center gap-y-5"
>
	<div
		class="flex flex-col laptop:flex-row gap-y-5 gap-x-6 laptop:gap-x-12 w-full justify-around items-center px-3 tablet:px-8 laptop:px-12"
	>
		<div class="grid grid-cols-9 h-fit w-full tablet:w-[unset]">
			{#each board_state as row, i}
				{#each row as square, j}
					{@const square_number = 9 * i + j}
					{@const square_is_valid_move = available_moves.includes(square_number)}
					{#key `${square.id}|${JSON.stringify(square.pieces?.[0])}` }
						<Square
							{square_number}
							{square_is_valid_move}
							client_player_color={player_color}
							is_client_turn={turn % 2 === (player_color === 'white' ? 1 : 0)}
							items={square.pieces}
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
			client_player_color={player_color}
			bind:currently_dragged_stockpile_piece
			bind:stack_turn
			bind:players_ready 
			bind:player_ready
			bind:other_player_ready
			bind:player_data
			{ game_id }
			{ socket }
		/>
	</div>
	<PlayerNameModal bind:show={name_modal_show} on:submit={(e) => {player_name = e.detail.name;socket.emit("declare_name",{name: player_name, game_id})}} />
	<CaptureModal on:choose={TakeOrCapture} bind:show={show_take_capture_modal} { capturing_piece } />
</main>

<script lang="ts">
	import CaptureModal from './../../lib/components/CaptureModal.svelte';
	import PlayerNameModal from './../../lib/components/PlayerNameModal.svelte';
	import Square from '$lib/components/Square.svelte';
	import PiecesZone from '$lib/components/PiecesZone.svelte';
	import { piece_data, type BoardState,type Piece } from '$lib/pieces';
	import { availableMoves, availableStockpileMoves, type PlayerData } from '$lib/game';
	import type { PageData } from './$types';
	import { PUBLIC_WS_ENDPOINT } from '$env/static/public';
	import { io } from 'socket.io-client';
	import { afterNavigate } from '$app/navigation';

	let player_name: string | null = null;
	let other_player_name: string | null = null;
	let player_color: 'white' | 'black' | null = null;
	$: opponent_color = (player_color === 'white' ? 'black' : 'white') as 'white' | 'black';
	let stack_turn = 1;
	let turn = 1;
	let player_ready = false;
	let other_player_ready = false;
	$: players_ready = player_ready && other_player_ready;
	let access_token: string | null = null;
	let show_take_capture_modal = false;
	let name_modal_show = true;
	let capturing_piece: Piece | null = null;
	const socket = io(`${PUBLIC_WS_ENDPOINT}/game_ws`);
	export let data: PageData;
	const { game_id } = data;

	afterNavigate(() => {
		access_token = localStorage.getItem('gungi_token')
		socket.on('connect',() => {
			socket.emit('send_token',{token: access_token,game_id});
	
			socket.on('get_token',(message) => {
				access_token = message.token ?? access_token
				localStorage.setItem('gungi_token',access_token as string);
				console.log(access_token)
				socket.emit('join_game',{ token: access_token,game_id })
			})
			
			socket.on('joined_room',(message) => {
				if (message.socket_id === socket.id) {
					player_color = message.player_data.player_color;
					if (message.previous_game_state) {
						name_modal_show = false;
						turn = message.previous_game_state?.turn ?? 1
						stack_turn = message.previous_game_state?.stack_turn ?? 1
						board_state = message.previous_game_state?.board_state ?? board_state
						player_data = message.previous_game_state?.player_data ?? player_data
						player_ready = message.previous_game_state?.player_ready ?? player_ready
						other_player_ready = message.previous_game_state?.other_player_ready ?? other_player_ready
					}
				}
			})
	
			socket.on("other_player_declare_name",(message) => {
				if (message.socket_id !== socket.id) {
					other_player_name = message.name;
				}
			})
	
			socket.on("other_player_ready",(message) => {
				if (message.socket_id !== socket.id) {
					other_player_ready = message.ready;
				}
			})
	
			socket.on('received_data_after_turn',(message: SocketPayload) => {
				console.log(message)
				if (players_ready && message.turn % 2 !== (player_color === 'white' ? 1 : 0)) {
					return;
				}
				if (!players_ready && !player_ready && (message.stack_turn % 2 !== (player_color === 'black' ? 1 : 0))) {
					return;
				}
				if (!players_ready && other_player_ready) {
					return;
				}
				turn = message.turn;
				stack_turn = message.stack_turn;
				board_state = message.board_state;
				player_data = message.player_data;
				playSound();
			})
		});
	})

	let board_state: BoardState = Array.from({ length: 9 }, (_, i) =>
		Array.from({ length: 9 }, (_, j) => ({ id: i * 9 + j, pieces: [] }))
	);

	let player_data: PlayerData[] = [
		{
			name: player_name ?? 'Anonymous (Player 1)',
			color: player_color ?? 'white',
			piece_data: structuredClone(piece_data).map((piece: Piece) => {
				piece.color = player_color ?? 'white';
				return piece;
			})
		},
		{
			name: other_player_name ?? 'Anonymous (Player 2)',
			color: opponent_color ?? 'black',
			piece_data: structuredClone(piece_data).map((piece: Piece) => {
				piece.color = opponent_color ?? 'black';
				return piece;
			})
		}
	]

	$: player_data[0].name = player_name ?? 'Anonymous (Player 1)'
	$: player_data[1].name = other_player_name ?? 'Anonymous (Player 1)'
	$: player_data[0].color = player_color ?? 'white'
	$: player_data[1].color = opponent_color ?? 'black'
	$: player_data[0].piece_data = player_data[0].piece_data.map((piece: Piece) => {
		piece.color = player_color ?? 'white';
		return piece;
	})
	$: player_data[1].piece_data = player_data[1].piece_data.map((piece: Piece) => {
		piece.color = opponent_color ?? 'black';
		return piece;
	})

	function TakeOrCapture(e: CustomEvent) {
		if (capturing_piece === null) {
			return;
		}

		const { choice } = e.detail;
		const square_number = capturing_piece.id as number; //id is square_number is guaranteed due to the logic in update_board_state
		const square = board_state[Math.floor(square_number / 9)][square_number % 9];
		square.pieces.unshift(capturing_piece);
		if (choice === 'take') { //if take then delete everything below
			square.pieces.splice(1,1);
		}
		square.pieces[0].current_level = square.pieces.length
		stack_turn += 1;
		turn += players_ready ? 1 : 0;
		board_state = board_state // to rerender
		playSound();
		socket.emit("send_data_after_turn",{board_state, turn, stack_turn, game_id,player_data,player_ready,other_player_ready});
		show_take_capture_modal = false;
	}

	function playSound() {
      const audio = new Audio('/move_sound.mp3');
      audio.play();
    }

	function update_board_state(e: CustomEvent) {
		const { piece, square_number, mode }: {piece: Piece,square_number: number,mode: "add" | "remove"} = e.detail;
		const currently_dragged_piece_position = currently_dragged_board_piece?.position;
		if (mode === "add" && board_state[Math.floor(square_number / 9)][square_number % 9].pieces?.[0]?.color === opponent_color) {
			piece.id = square_number;
			capturing_piece = piece;
			show_take_capture_modal = true;
			return;
		}
		else if (mode === 'add') {
			piece.id = square_number;
			board_state[Math.floor(square_number / 9)][square_number % 9].pieces.unshift(piece);
			if (currently_dragged_piece_position !== square_number) {// check if it wasnt dropped in same position
				stack_turn += 1;
				turn += players_ready ? 1 : 0;
				playSound();
				socket.emit("send_data_after_turn",{board_state, turn, stack_turn, game_id,player_data,player_ready,other_player_ready});
			}
		} 
		else if (currently_dragged_piece_position) {
			//position only not null and recorded when the piece was already on the board
			//It prevents Army Size from ticking up when you drag to the same place or anywhere else
			board_state[Math.floor(currently_dragged_piece_position / 9)][currently_dragged_piece_position % 9].pieces.shift();
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
				currently_hovered_tower_details?.[0] ?? currently_dragged_board_piece,
				board_state,
				player_color
			);
		}
		if (currently_dragged_stockpile_piece) {
			available_moves = availableStockpileMoves(currently_dragged_stockpile_piece, board_state,players_ready,opponent_color);
		}
	}
</script>

<style lang="postcss">
	:global(#dnd-action-dragged-el > .number_img) {
		@apply hidden;
	}
</style>
