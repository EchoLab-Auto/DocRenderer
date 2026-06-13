import type { ProDocNode } from '@prodoc/core';
export interface DocViewerProps {
    /** 文档树根节点 */
    root: ProDocNode;
    /** 初始选中的文档路径 */
    initialPath?: string;
    /** 自定义样式类名 */
    className?: string;
}
declare const _default: import("vue").DefineComponent<DocViewerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    docLink: (path: string) => any;
}, string, import("vue").PublicProps, Readonly<DocViewerProps> & Readonly<{
    onDocLink?: ((path: string) => any) | undefined;
}>, {
    className: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=DocViewer.vue.d.ts.map