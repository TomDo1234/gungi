{#if $open}
	<BaseModal>
		<div use:melt={$content} class="flex-col flex gap-y-5 items-start">
			<h2 use:melt={$title}>Take or Stack?</h2>
			<div class="flex justify-between w-full">
				<button
					on:click={() => onChoose('take')}
					class="font-medium text-xl bg-purple-500 px-4 py-2 rounded-2xl w-fit">Take</button
				>
				{#if capturing_piece?.display_name !== 'Fortress'}
					<button
						on:click={() => onChoose('stack')}
						class="font-medium text-xl bg-lime-600 px-4 py-2 rounded-2xl w-fit">Stack</button
					>
				{/if}
			</div>
		</div>
	</BaseModal>
{/if}

<script lang="ts">
	import { melt, createDialog } from '@melt-ui/svelte';
	import BaseModal from './BaseModal.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Piece } from '$lib/pieces';

	export let show: boolean;
	export let capturing_piece: Piece | null;

	const {
		elements: { title, content },
		states: { open }
	} = createDialog({ closeOnOutsideClick: false });

	$: $open = show;

	const dispatch = createEventDispatcher();

	function onChoose(choice: 'take' | 'stack') {
		dispatch('choose', { choice });
		$open = false;
	}
</script>

<style lang="postcss">
	h2 {
		@apply text-4xl;
	}
</style>
