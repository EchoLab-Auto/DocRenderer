export interface MarkdownEditorProps {
    /** Markdown 内容 */
    value: string;
    /** 自定义样式类名 */
    className?: string;
}
declare const _default: import("vue").DefineComponent<MarkdownEditorProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value: string) => any;
    docLink: (path: string) => any;
}, string, import("vue").PublicProps, Readonly<MarkdownEditorProps> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onDocLink?: ((path: string) => any) | undefined;
}>, {
    className: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=MarkdownEditor.vue.d.ts.map