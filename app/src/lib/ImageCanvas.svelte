<script lang="ts">
    import type { ImageManip } from "@model/image.model";
    import { Mode } from "@model/mode.model";
    import { TransformHelper } from "@model/transform.model";
    import { CharData } from "@model/chardata.model";
    import { CANVAS_HEIGHT } from "@model/consts";
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
            const data = await transform.getImage(mode);
            applyImage(data);
        } catch (e) {
            console.error(e);
        }
    }

    $: modeChanged(mode);
    async function modeChanged(mode: Mode) {
        try {
            const data = await transform.getImage(mode);
            applyImage(data);
        } catch (e) {
            console.error(e);
        }
    }

    $: pixelsChanged(pixels);
    async function pixelsChanged(pixels: number) {
        debouncePixels(pixels);
    }

    // Data

    let canvas: HTMLCanvasElement;
    let transform: TransformHelper = new TransformHelper();

    // Methods

    const applyImage = (data: CharData | ImageData) => {
        if (!canvas) return;

        canvas.width = image.width * canvas.height / image.height;

        const context = canvas.getContext("2d");

        if (data instanceof CharData) {
            applyCharData(context, data);
        } else {
            context.putImageData(data, 0, 0, 0, 0, canvas.width, canvas.height);
        }
    };

    const applyCharData = (
        context: CanvasRenderingContext2D,
        data: CharData
    ) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = pixels + "px monospace";

        for (let j = 0; j < data.height; j++) {
            for (let i = 0; i < data.width; i++) {
                context.fillStyle = data.colors[j][i].toHex();
                context.fillText(
                    data.data[j][i],
                    i * pixels + pixels / 2,
                    j * pixels + pixels
                );
            }
        }
    };

    const applyPixels = (p: number) => {
        if (mode == Mode.Pixelate || mode == Mode.Ascii) {
            transform.setPixelSize(p);
            transform
                .getImage(mode)
                .then((data: CharData | ImageData) => applyImage(data));
        }
    };

    const debouncePixels = _.debounce(applyPixels, 500);
</script>

<canvas class="image-canvas" bind:this={canvas} height={CANVAS_HEIGHT} />
