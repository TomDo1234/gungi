<div
	class="bg-[#eecaa0] border-[#bc7e38] border-t tablet:border-t-2 border-r p-1.5 tablet:border-r-2 border-solid tablet:w-16 laptop:w-20 desktop:w-24 aspect-square
					{i % 9 === 0 && 'border-l tablet:border-l-2'} {i >= 72 && 'border-b tablet:border-b-2'}"
	use:dndzone={{ items }}
	on:consider={(e) => (items = e.detail.items)}
	on:finalize={(e) => (items = e.detail.items)}
>
	{#each items.slice(0, 1) as piece}
		{@const name_slug = piece.display_name.replaceAll(' ', '').toLowerCase()}
		<div class="relative">
			<img
				class="block"
				src="/img/{piece?.color}-{name_slug}-1.svg"
				alt="{piece?.color}-{name_slug}-1"
			/>
			<div
				class:hidden={items.length <= 1}
				class="rounded-full number_img h-7 bg-blue-950 aspect-square flex justify-center items-center absolute -top-3 -right-3"
			>
				{items.length}
			</div>
		</div>
	{/each}
</div>

<script lang="ts">
	import { dndzone } from 'svelte-dnd-action-gungi';
	import type { BoardSquare, Piece } from '$lib/pieces';

	// export let square: BoardSquare;
	export let i: number; //Square number

	let items: Piece[] = [];
</script>
