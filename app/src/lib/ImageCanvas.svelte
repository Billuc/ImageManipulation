<script lang="ts">
    import type { ImageManip } from "@model/image.model";
    import { Mode } from "@model/mode.model";
    import { TransformHelper } from "@model/transform.model";
    import { CharData } from "@model/chardata.model";
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
        } catch {}
    }

    $: modeChanged(mode);
    async function modeChanged(mode: Mode) {
        try {
            const data = await transform.getImage(mode);
            applyImage(data);
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

    const applyImage = (data: CharData | ImageData) => {
        if (!canvas) return;

        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d");

        if (data instanceof CharData) {
            applyCharData(context, data);
        } else {
            context.putImageData(data, 0, 0);
        }
    };

    const applyCharData = (
        context: CanvasRenderingContext2D,
        data: CharData
    ) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        const letterSize = image.width / data.width;
        context.font = letterSize + "px monospace";

        for (let j = 0; j < data.height; j++) {
            for (let i = 0; i < data.width; i++) {
                context.fillStyle = data.colors[j][i].toHex();
                context.fillText(
                    data.data[j][i],
                    i * letterSize + letterSize / 2,
                    j * letterSize + letterSize / 2
                );
            }
        }
    };

    const applyPixels = (p: number) => {
        if (mode == Mode.Pixellized || mode == Mode.Ascii) {
            transform.setPixelationSize(p);
            transform
                .getImage(mode)
                .then((data: CharData | ImageData) => applyImage(data));
        }
    };

    const debouncePixels = _.debounce(applyPixels, 300);
</script>

<canvas class="image-canvas" bind:this={canvas} />
