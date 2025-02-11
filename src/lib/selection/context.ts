import { writable, type Writable } from "svelte/store";
import type { SelectionContextProps } from "$lib/three-js/postprocessing/selection/types";
import { setContext, getContext } from "svelte";

const START_CONTEXT_KEY = "1BYE_EFFECT_SELECTION_CONTEXT_";

export function createSelectionContext(props: SelectionContextProps): Writable<SelectionContextProps> {
    return setContext(START_CONTEXT_KEY, writable(props));
}

export function getSelectionContext(): Writable<SelectionContextProps> {
    return getContext(START_CONTEXT_KEY);
}