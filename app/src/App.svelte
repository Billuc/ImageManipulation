<script lang="ts">
  import ImageInput from "@lib/ImageInput.svelte";
  import ImageCanvas from "@lib/ImageCanvas.svelte";

  import type { ImageManip } from "@model/image.model";

  // Data

  let image: ImageManip | null = null;
</script>

<main>
  <header>!</header>

  <ImageCanvas image="{image}" />

  <ImageInput image="{image}" preview="{false}" on:imageloaded="{ img => image = img.detail }" />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 0 1em;
    margin: 0 auto;
  }

  header {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
  }
</style>
