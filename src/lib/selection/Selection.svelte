<script lang="ts">
    import type { SelectionProps } from "./types";
    import { createSelectionContext } from "./context";

    let {
        children,
        enabled = true
    }: SelectionProps = $props();

    const context = createSelectionContext({
        selected: [],
        enabled,
    });
</script>

{@render children?.()}

