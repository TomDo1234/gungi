<div class="square">
	<div class="letter no-select">
		{letter.toUpperCase()}
	</div>
</div>

<script lang="ts" >
	export let letter: string;
</script>

<style>
	.square {
		height: calc(min(5vmin, 50px));
		width: calc(min(5vmin, 50px));
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
