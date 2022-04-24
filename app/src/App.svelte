<script lang="ts">
  import ImageInput from "@lib/ImageInput.svelte";
  import ImageCanvas from "@lib/ImageCanvas.svelte";
  import TransformSelector from "@lib/TransformSelector.svelte";

  import type { ImageManip } from "@model/image.model";
  import { Mode } from "@model/mode.model";

  // Data

  let image: ImageManip | null = null;
  let mode: Mode = Mode.Default;
  let pixels: number = 15;
</script>

<main>
  <header>Image Manipulation</header>

  <ImageCanvas {image} {mode} {pixels} />

  <ImageInput
    {image}
    preview={false}
    on:imageloaded={(img) => (image = img.detail)}
  />

  <TransformSelector on:input={(m) => (mode = m.detail)} on:change={(v) => (pixels = v.detail)} {mode} {pixels} />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

    background-color: black;
  }

  main {
    padding: 0 1em;
    margin: 0 auto;

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  header {
    color: rgb(34, 233, 34);
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
  }
</style>
