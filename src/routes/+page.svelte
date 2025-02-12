<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./scene.svelte";
</script>

<div style="height: 100vh; width: 100%">
    <Canvas>
        <Scene />
    </Canvas>
</div>

<style>
    :global(body) {
        padding: 0;
        margin: 0;
    }
</style>