<script lang="ts">
    import type { SMAAEffectProps } from "./types";
    import type { EffectProps } from "../../types";
    import { SMAAEffect } from "postprocessing";
    import { getEffectComposerContext } from "../../effect-composer/context";
    import { onMount, tick } from "svelte";

    let {
        composerId,
        ...props
    }: EffectProps<SMAAEffectProps> = $props();

    const context = getEffectComposerContext(composerId);
    const _effect = new SMAAEffect(props);

    onMount(() => {
        tick().then(() => {
            $context.push(_effect);
        });

        return () => {
            _effect.dispose();
        };
    });

    $effect(() => {
        const {
            preset,
            predicationMode,
            edgeDetectionMode
        } = props;

        preset && _effect.applyPreset(preset);

        if (edgeDetectionMode)
            _effect.edgeDetectionMaterial.edgeDetectionMode = edgeDetectionMode;

        if (predicationMode)
            _effect.edgeDetectionMaterial.predicationMode = predicationMode;

        $context.render();
    })
</script>