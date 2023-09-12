<div class="relative !visible" class:hidden={hidden} on:mouseover on:focus role="application" >
    <img
        class="block"
        src="/img/{piece?.color}-{name_slug}-1.svg"
        alt="{piece?.color}-{name_slug}-1"
    />
    <div
        class:hidden={stack_length <= 1}
        class="rounded-full number_img h-7 bg-blue-950 aspect-square flex justify-center items-center absolute -top-3 -right-3"
    >
        {stack_length}
    </div>
</div>

<script lang="ts" >
	import type { Piece } from "$lib/pieces";

    export let piece: Piece;
    export let stack_length: number;
    export let hidden = false;
    $: name_slug = piece.display_name.replaceAll(' ', '').toLowerCase()
</script>