<div class="w-screen h-screen fixed flex justify-center items-center top-0 bg-transparent" >
	<div class="fixed bg-lime-950 py-10 px-12">
		{#if $open}
			<div use:melt={$overlay} />
			<div use:melt={$content} class="flex-col flex gap-y-5">
				<h2 use:melt={$title}>Enter your name</h2>
				<input placeholder="Name" class="px-6 rounded-2xl py-3 text-2xl text-lime-950 font-medium" />
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	const {
		elements: { overlay, content, title },
		states: { open }
	} = createDialog({ defaultOpen: true });
</script>

<style lang="postcss">
	h2 {
		@apply text-4xl;
	}
</style>
