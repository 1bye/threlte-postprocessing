import type { Snippet } from "svelte";
import type { Group, Object3D } from "three";
import type { Props } from "@threlte/core";

export type SelectionContextProps = {
    selected: Object3D[];
    enabled: boolean;
}

export type SelectionProps = {
    enabled?: boolean;
    children?: Snippet;
}

export type SelectProps = Props<Group> & {
    enabled?: boolean;
}