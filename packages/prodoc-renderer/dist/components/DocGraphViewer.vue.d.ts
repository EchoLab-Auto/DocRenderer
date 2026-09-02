/** 写盘结果：对象形式可携带失败原因（409 冲突 / 其他错误），布尔为兼容旧契约 */
type SaveResult = {
    ok: boolean;
    status?: number;
    error?: string;
};
type __VLS_Props = {
    /** 相对路径 → 文件完整内容 */
    files: Record<string, string>;
    /** 保存处理器（可选）：返回写盘结果；提供时优先于 save 事件（可感知失败） */
    saveHandler?: (path: string, content: string, base?: string) => Promise<boolean | SaveResult>;
    /** 删除处理器（可选）：删除磁盘文件；提供时图编辑模式开放节点删除 */
    deleteHandler?: (path: string, base?: string) => Promise<boolean | SaveResult>;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    navigate: (path: string) => any;
    save: (path: string, content: string, base?: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onNavigate?: ((path: string) => any) | undefined;
    onSave?: ((path: string, content: string, base?: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=DocGraphViewer.vue.d.ts.map