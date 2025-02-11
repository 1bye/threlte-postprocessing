<script lang="ts">
    import type { EffectProps } from "../types";
    import { FluidEffect } from "./FluidEffect";
    import { type Props, T } from "@threlte/core";
    import { onMount, tick } from "svelte";
    import { getEffectComposerContext } from "../../../../effect-composer/context";
    // import { ShaderPass } from "three/examples/jsm/Addons.js";

    let {
        ref = $bindable(),
        children,

        ...props
    }: EffectProps & Props<FluidEffect> = $props();

    const context = getEffectComposerContext();
    const _effect = new FluidEffect(props);

    $effect(() => {
        _effect.state = { ...props };
        _effect.update();

        return () => {
            _effect.dispose();
        }
    });

    onMount(() => {
        tick().then(() => {
            $context.push(_effect);
        })
    })
</script>

<!--<T bind:ref is={_effect} dispose={false}>-->
<!--    {#if ref}-->
<!--        {@render children?.({ ref })}-->
<!--    {/if}-->
<!--</T>-->

