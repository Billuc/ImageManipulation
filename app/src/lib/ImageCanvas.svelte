<script lang="ts">
    import type { ImageManip } from "@model/image.model";
    import { Mode } from "@model/mode.model";
    import { TransformHelper } from "@model/transform.model";
    import _ from "lodash";

    // Props

    export let image: ImageManip | null = null;
    export let mode!: Mode;
    export let pixels!: number;

    $: imageChanged(image);
    async function imageChanged(image: ImageManip) {
        if (!image) return;

        transform.setImage(image);

        try {
            const imageData = await transform.getImage(mode);

            if (!canvas) return;

            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").putImageData(imageData, 0, 0);
        } catch {}
    }

    $: modeChanged(mode);
    async function modeChanged(mode: Mode) {
        try {
            const imageData = await transform.getImage(mode);

            if (!canvas) return;

            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").putImageData(imageData, 0, 0);
        } catch {}
    }

    $: pixelsChanged(pixels);
    async function pixelsChanged(pixels: number) {
        debouncePixels(pixels);
    }

    // Data

    let canvas: HTMLCanvasElement;
    let transform: TransformHelper = new TransformHelper();

    // Methods

    const applyPixels = (p: number) => {
        if (mode == Mode.Pixellized || mode == Mode.Ascii) {
            transform.setPixelationSize(p);
            transform.getImage(mode).then((imageData: ImageData) => {
                if (!canvas) return;

                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext("2d").putImageData(imageData, 0, 0);
            });
        }
    };

    const debouncePixels = _.debounce(applyPixels, 300);
</script>

<canvas class="image-canvas" bind:this={canvas} />
