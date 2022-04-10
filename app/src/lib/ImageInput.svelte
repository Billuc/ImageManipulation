<script lang="ts">
    import type { ImageManip } from "@model/image.model";
    import ImageService from "@services/image.service";
    import { onMount, createEventDispatcher } from "svelte";

    // Props

    export let preview = true;
    export let image: ImageManip | null = null;

    // Data

    let fileInput: HTMLInputElement;
    let dispatch = createEventDispatcher();

    // Methods

    const uploadFile = async (e: Event) => {
        const input: HTMLInputElement = e.target as HTMLInputElement;
        const img = await ImageService.upload(input.files[0]);

        dispatch('imageloaded', img);
    };

    // Lifecycle

    onMount(async () => {
        const img = await ImageService.upload(
            "https://images.unsplash.com/photo-1649392118384-5c9892d747e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
        );
        dispatch('imageloaded', img);
    });
</script>

<div class="image-input">
    <div class="image-display">
        {#if image && preview}
            <img src={image.imageData} alt="Couldn't load" />
        {:else if preview}
            Loading...
        {/if}
    </div>

    <div class="upload-button" on:click={(_) => fileInput.click()}>
        Upload image
    </div>
    <input
        style="display: none;"
        type="file"
        accept=".jpg, .jpeg, .png, .webp, .ico"
        on:change={(e) => uploadFile(e)}
        bind:this={fileInput}
    />
</div>

<style>
    .image-input {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        max-width: 200px;
    }

    .image-display {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        width: 100%;
        height: auto;
        max-width: 200px;
        max-height: 200px;
    }

    .image-display img {
        max-width: inherit;
        max-height: inherit;
        width: auto;
        height: auto;
    }
</style>
