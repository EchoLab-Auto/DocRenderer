type __VLS_Props = {
    /** 相对路径 → 文件完整内容 */
    files: Record<string, string>;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    navigate: (path: string) => any;
    save: (path: string, content: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onNavigate?: ((path: string) => any) | undefined;
    onSave?: ((path: string, content: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=DocGraphViewer.vue.d.ts.map