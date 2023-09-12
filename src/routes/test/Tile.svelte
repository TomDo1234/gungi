<div class="square h-full" class:!hidden={hidden} >
	<div class="letter no-select">
		{letter.toUpperCase()}
	</div>
</div>

<script lang="ts" >
	export let letter: string;
	export let hidden = false;
</script>

<style>
	.square {
		border-radius: calc(min(5vmin, 50px) / 6.25);
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff6eb;
	}

	.letter {
		font-size: 2vmin;
		color: #707070;
	}
</style>
