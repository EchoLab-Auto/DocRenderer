import type { DocTreeNode } from '@prodoc/core';
type __VLS_Props = {
    node: DocTreeNode;
    expanded: Record<string, boolean>;
    currentPath: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    toggle: (node: DocTreeNode) => any;
    open: (node: DocTreeNode) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onToggle?: ((node: DocTreeNode) => any) | undefined;
    onOpen?: ((node: DocTreeNode) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=DocTreeItem.vue.d.ts.map