<script lang="ts">
    import type { Object3D } from "three";
    import type { SelectProps } from "./types";
    import { getSelectionContext } from "./context";
    import { T } from "@threlte/core";

    const context = getSelectionContext();

    let {
        enabled,
        children,
        ref: group = $bindable(),

        ...props
    }: SelectProps = $props();

    $effect(() => {
        if ($context && enabled && group) {
            let changed = false;
            const current: Object3D[] = [];

            group.traverse((o) => {
                o.type === "Mesh" && current.push(o);

                if ($context.selected.indexOf(o) === -1)
                    changed = true;
            });

            if (changed) {
                context.update(value => {
                    value.selected = [
                        ...value.selected,
                        ...current
                    ];

                    return value;
                });

                return () => {
                    context.update(value => {
                        value.selected = value.selected.filter((selected) => !current.includes(selected))

                        return value;
                    });
                }
            }
        }
    });
</script>

<T.Group bind:ref={group} {...props}>
    {#if group}
        {@render children?.({ ref: group })}
    {/if}
</T.Group>

