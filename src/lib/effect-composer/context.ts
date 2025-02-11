import type { EffectComposerContext } from "$lib/three-js/postprocessing/effect-composer/types";
import { setContext, getContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const START_CONTEXT_KEY = "1BYE_EFFECT_COMPOSER_CONTEXT_";

export function createEffectComposerContext(data: EffectComposerContext, id?: string): Writable<EffectComposerContext> {
    return setContext(`${START_CONTEXT_KEY}${id ?? ""}`, writable(data));
}

export function getEffectComposerContext(id?: string): Writable<EffectComposerContext> {
    return getContext(`${START_CONTEXT_KEY}${id ?? ""}`);
}