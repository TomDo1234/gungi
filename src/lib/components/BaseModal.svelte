<div class="w-screen h-screen fixed flex justify-center items-center top-0 shadowy">
    <div class="fixed bg-lime-950 py-10 px-12">
        <slot />
    </div>
</div>

<style lang="postcss">
    .shadowy {
        background-color: rgba(0, 0, 0, 0.6); /* 60% opacity black */
        backdrop-filter: blur(10px); /* add a blur effect */
    }
</style>
