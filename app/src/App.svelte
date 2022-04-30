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

  <div class="main">
    <div class="left-column">
      <ImageInput
        {image}
        preview={false}
        on:imageloaded={(img) => (image = img.detail)}
      />

      <TransformSelector
        on:input={(m) => (mode = m.detail)}
        on:change={(v) => (pixels = v.detail)}
        {mode}
        {pixels}
        column
      />
    </div>

    <div class="content">
      <ImageCanvas {image} {mode} {pixels} />
    </div>
  </div>
</main>

<style>
  :root {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, sans-serif;

    background-color: black;
  }

  main {
    padding: 0 1em;
    margin: 0 auto;

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: stretch;
  }

  header {
    color: rgb(34, 233, 34);
    text-transform: uppercase;
    font-size: 2rem;
    line-height: 1.1;
    margin: 1.5rem auto;
    text-shadow: rgb(34, 233, 34) 2px 2px 4px;
  }

  .main {
    display: flex;
    flex-flow: row nowrap;
    
    width: 100%;
  }

  .left-column {
    width: 250px;
    max-width: 25%;
    margin-right: 1em;
    padding: 0.5em;
    flex-shrink: 0;

    box-shadow: 0 0 8px 4px rgb(34, 233, 34);
  }

  .content {
    flex-grow: 1;
    text-align: center;
  }
</style>
