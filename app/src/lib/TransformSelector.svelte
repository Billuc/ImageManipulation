<script lang="ts">
    import { Mode } from "@model/mode.model";
    import { createEventDispatcher } from "svelte";

    // Props

    export let mode: Mode;
    export let pixels: number;
    export let column: boolean = false;

    // Data

    let dispatch = createEventDispatcher();
    const modes = Object.entries(Mode).filter((el) => isNaN(Number(el[0])));

    // Methods

    const setMode = (newMode: Mode) => {
        dispatch("input", newMode);
    };

    const setValue = (event: any) => {
        dispatch("change", Number(event.target.value));
    };
</script>

<div class="transform-selector" class:column>
    <div class="transform-picker" class:column>
        {#each modes as [m, v]}
            <button
                on:click={(_) => setMode(v)}
                class={v == mode ? "active" : ""}
            >
                <span>{m}</span>
            </button>
        {/each}
    </div>

    {#if mode == Mode.Pixelate || mode == Mode.Ascii}
        <div class="transform-slider" class:column>
            <span>Pixel size : {pixels}</span>
            <input
                type="range"
                min="1"
                max="100"
                value={pixels}
                on:input={setValue}
            />
        </div>
    {/if}
</div>

<style>
    .transform-selector {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }

    .transform-picker {
        display: flex;
        flex-flow: row wrap;
    }

    .transform-picker.column {
        flex-flow: column nowrap;
    }

    button {
        padding: 0.5em;
        margin: 0.5em;

        border-radius: 2px;
        background-color: black;
        border: 2px solid rgb(34, 233, 34);
        color: rgb(34, 233, 34);

        transform: skewX(345deg);
        cursor: pointer;
        box-shadow: 0px 0px 8px 4px #22e922;
    }

    button > * {
        display: inline-block;
        transform: skewX(15deg);
    }

    button.active {
        color: black;
        background-color: rgb(34, 233, 34);
    }

    .transform-slider {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;

        column-gap: 1em;
        margin: 0.5em;

        color: rgb(34, 233, 34);
    }

    .transform-slider.column {
        flex-flow: column nowrap;
        row-gap: 0.5em;
    }

    .transform-slider > input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        border-radius: 3px;
        outline: none;
        background-color: #184c11;
    }

    .transform-slider > input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background-color: rgb(34, 233, 34);
        cursor: pointer;
        border-radius: 50%;
    }

    .transform-slider > input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background-color: rgb(34, 233, 34);
        cursor: pointer;
        border-radius: 50%;
    }

    .transform-slider > input[type="range"]:hover::-webkit-slider-thumb {
        box-shadow: 0px 0px 8px 4px rgba(34, 233, 34, 1);
    }

    .transform-slider > input[type="range"]:hover::-webkit-slider-thumb {
        box-shadow: 0px 0px 8px 4px rgba(34, 233, 34, 1);
    }
</style>
