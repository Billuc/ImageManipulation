<script lang="ts">
    import type { ImageManip } from "@model/image.model";

    // Props

    export let image: ImageManip | null = null;

    $: imageChanged(image);
    async function imageChanged(image: ImageManip) {
        if (!canvas) return;

        const pixels = await image.getPixels();
        const width = image.width;
        const height = image.height;
        const imageData = new ImageData(pixels, width, height);

        canvas.getContext("2d").putImageData(imageData, 0, 0);
    }

    // Data

    let canvas: HTMLCanvasElement;
</script>

<canvas class="image-canvas" bind:this="{canvas}" />