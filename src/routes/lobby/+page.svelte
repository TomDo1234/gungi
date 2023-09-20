<main class="bg-lime-800 w-screen h-screen text-white font-primaryfont flex flex-col pt-16 items-center gap-y-5" >
    <h1 class="text-8xl" >
        Open Games
    </h1>
    <div class="grid grid-cols-3 container gap-x-8" >
        {#each games as game}
            <div class="flex gap-x-16 mt-12 text-4xl border-white border-2 rounded-3xl px-12 py-8 justify-between items-center w-full" >
                <div class="overflow-ellipsis text-3xl" >
                    Host: <br/> {game.host_name}
                </div>
                <a href="/play?game_id={game.game_id}" >
                    <button class="round_button" >Join</button>
                </a>
            </div>
        {/each}
    </div>
</main>

<script lang="ts" >
	import { lobby_socket } from "$lib/ws";
	import { onMount } from "svelte";

    let games: {game_id: string, host_name: string}[] = [];

    onMount(() => {
        lobby_socket.on('connect',() => {
            lobby_socket.emit('get_games');
            lobby_socket.on('get_games',(message) => {
                console.log(222)
                games = message
            })
        })
    })
</script>

<style lang="postcss" >
    .round_button {
        @apply text-lime-800 bg-white px-8 py-2 rounded-full hover:text-white hover:bg-lime-950;
    }
</style>
