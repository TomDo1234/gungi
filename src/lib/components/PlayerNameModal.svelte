{#if $open}
	<div class="w-screen h-screen fixed flex justify-center items-center top-0 bg-transparent">
		<div class="fixed bg-lime-950 py-10 px-12">
			<div use:melt={$overlay} />
			<div use:melt={$content} class="flex-col flex gap-y-5 items-start">
				<h2 use:melt={$title}>Enter your name</h2>
				<form class="flex flex-col gap-y-4" on:submit|preventDefault={onSubmit} >
					<input
						placeholder="Name"
						required
						class="px-6 rounded-2xl py-3 text-2xl text-lime-950 font-medium"
						bind:value={name}
					/>
					<button
						class="font-medium text-xl bg-lime-600 px-4 py-2 rounded-2xl w-fit">Submit</button
					>
				</form>
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	const {
		elements: { overlay, content, title },
		states: { open }
	} = createDialog({ defaultOpen: true });

	let name = '';

    const dispatch = createEventDispatcher()

	function onSubmit() {
        dispatch('submit',{ name })
		$open = false;
	}
</script>

<style lang="postcss">
	h2 {
		@apply text-4xl;
	}
</style>
