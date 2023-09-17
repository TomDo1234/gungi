{#if $open}
	<BaseModal>
		<div use:melt={$content} class="flex-col flex gap-y-5 items-start">
			<h2 use:melt={$title}>Enter your name</h2>
			<form class="flex flex-col gap-y-4" on:submit|preventDefault={onSubmit}>
				<input
					placeholder="Name"
					required
					class="px-6 rounded-2xl py-3 text-2xl text-lime-950 font-medium"
					bind:value={name}
				/>
				<button class="font-medium text-xl bg-lime-600 px-4 py-2 rounded-2xl w-fit">Submit</button>
			</form>
		</div>
	</BaseModal>
{/if}

<script lang="ts">
	import { melt, createDialog } from '@melt-ui/svelte';
	import BaseModal from './BaseModal.svelte';
	import { createEventDispatcher } from 'svelte';

	let name = '';
	export let show: boolean;
	const {
		elements: { title, content },
		states: { open }
	} = createDialog({ defaultOpen: true, closeOnOutsideClick: false });
	
	$: $open = show;

	const dispatch = createEventDispatcher();

	function onSubmit() {
		dispatch('submit', { name });
		$open = false;
	}
</script>

<style lang="postcss">
	h2 {
		@apply text-4xl;
	}
</style>
