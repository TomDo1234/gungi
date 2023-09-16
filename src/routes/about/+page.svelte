<main
	class="bg-lime-800 min-w-screen min-h-screen text-white font-primaryfont pt-16 flex flex-col justify-center items-center gap-y-5"
>
	<div class="flex flex-col gap-y-5 container">
		<h1>What is Gungi?</h1>
		<p>
			Gungi is a two-player strategy board game created by Yoshihiro Togashi and is featured in the
			in the popular manga Hunter x Hunter. <br /><br />

			It is played on a non-checkered gameboard with 81 squares arranged in a 9x9 grid. At the
			beginning of the game, players can choose how their pieces will be arranged on their side of
			the board. <br /><br />
			Additionally, unlike its spiritual brethren, chess, shogi, and go, in Gungi pieces can be stacked
			on top of each other, adding a third dimension to the game leading to billions and billions of
			possibilities. As in chess and shogi, the goal is to trap the king.
		</p>
		<h1>Pieces and Mobility</h1>
		<p>
			There are 13 unique pieces with different ranges of mobility at different tiers. <br />
			<small>
				Note: Blue means the piece can move into that square. Green symbolizes the ability of that
				piece to move in a continuous line along the path of that square.
			</small>
		</p>
	</div>
	<div class="flex flex-col gap-y-12 container">
		{#each piece_data as piece}
			<PieceInfo { piece } />
		{/each}
	</div>
	<div class="container flex-col gap-y-5 text-xl">
		<h1>Rules of Gameplay</h1>
		<span
			>Visit the link to the original reddit post which details the ruleset for Gungi and was the
			main inspiration for this website.</span
		>
		<ol class="list-decimal [&>li]:ml-6 flex flex-col gap-y-4">
			<li>Each player is provided a total of 38 pieces as enumerated above.</li>
			<li>
				In the draft phase, pieces are put on the board in the first three rows, trading off
				one-by-one. Black places first. The Marshal must always be put first.
			</li>
			<li>
				The minimum pieces that must be placed in the beginning is one. This piece must be the
				Marshal. The maximum number of pieces you can have on the board at any time is 26.
			</li>
			<li>
				White takes the first turn after all pieces have been set up and the game phase begins.
			</li>
			<li>
				A turn can be used for one of four things:
				<div class="flex flex-col gap-y-4 ml-4 mt-4">
					a. Move - choose one piece to move (see section above on how pieces move); remember that
					towers themselves do not move, they only increase range of mobility of the top piece <br/><br/>
					b. Attack - if an enemy piece occupies a square within your range of movement, you can
					attack; if there is only one piece, your piece must then move into and occupy that square
					but if you’re attacking a tower, the result is that the tower loses the top and your piece
					now controls it <br/><br/>
                    c. Stack - if either a friendly piece or an enemy piece is within your range
					of movement, you can stack on top of that piece to form a tower (the top piece of the
					tower controls the tower regardless of pieces of a different team below it) <br/><br/>
                    d. Place - if you have less than the maximum pieces on the board, you may take a piece from your remaining
					pieces (captured pieces cannot be used) and place it anywhere on the board with following
					exceptions:
                    <ol class="list-decimal ml-10 flex-col flex gap-y-4" >
                        <li>Multiple pawns cannot be placed in the same file</li>
                        <li>Pawns cannot place the opposing Marshal into check mate (although check is allowed)</li>
                        <li>Pieces cannot be placed within the first three ranks of the opposing team's side of the board</li>
                    </ol>
				</div>
			</li>
			<li>
				The game concludes when the Marshal is mated. The player who checkmates their opponent wins.
				If a player at any given point has no legal moves to make and is not currently in check then
				a stalemate occurs and the game is a tie. Alternatively, the game may end if one side
				forfeits during the game.
			</li>
		</ol>
	</div>
</main>

<script lang="ts">
	import PieceInfo from '$lib/components/PieceInfo.svelte';
	import { piece_data } from '$lib/pieces';
</script>

<style lang="postcss">
	h1 {
		@apply font-semibold text-6xl;
	}
	p {
		@apply text-xl;
	}
	small {
		@apply text-base;
	}
</style>
