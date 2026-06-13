export interface MarkdownRendererProps {
    /** Markdown 内容 */
    content: string;
    /** 自定义样式类名 */
    className?: string;
    /** 是否显示目录 */
    showToc?: boolean;
}
declare const _default: import("vue").DefineComponent<MarkdownRendererProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    docLink: (path: string) => any;
}, string, import("vue").PublicProps, Readonly<MarkdownRendererProps> & Readonly<{
    onDocLink?: ((path: string) => any) | undefined;
}>, {
    className: string;
    showToc: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=MarkdownRenderer.vue.d.ts.map