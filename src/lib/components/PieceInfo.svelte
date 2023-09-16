{#if piece}
	<div class="flex flex-col gap-y-5 bg-lime-900 p-8 rounded-3xl">
		<div class="flex justify-between w-full">
			<h4 class="capitalize text-xl font-semibold">
				{piece.display_name}
				<span class="normal-case">x{piece.amount}</span>
			</h4>
			{#if piece.note}
				<span><b>Note:</b> {piece.note}</span>
			{/if}
		</div>
		<div class="flex justify-between w-full">
			{#each { length: 3 } as _, i}
				{#if i + 1 <= piece.levels}
					<img
						src="/img/board/{piece_slug_name}{i + 1}.svg"
						class="max-h-60"
						alt="{piece_slug_name}{i + 1}"
					/>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<script lang="ts">
	import type { Piece } from '$lib/pieces';

	export let piece: Piece;
	$: piece_slug_name = piece?.display_name?.toLowerCase()?.replaceAll(' ', '');
</script>
