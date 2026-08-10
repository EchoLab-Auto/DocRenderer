/**
 * 文档图（DocGraph）构建
 *
 * 新 ProDoc 模型的核心：目录下的每个 md 文件对应图上的一个框（DocBox）。
 * 框的属性（id、标题、位置、尺寸等）来自文件最前方的框架参数区；
 * 缺少位置参数的框按 link 连线结构分层自动排布（根框在顶层，逐层向下）。
 * 正文 H2 标题提取为文档内分块（≥2 个时），在框内渲染为可跳转子块。
 * 同一 id 重复声明时后者覆盖前者并记录警告。
 */
/** 文档内分块（从正文 H2 提取） */
export interface DocBlock {
    /** 锚点 slug（与 ui-frame MarkdownRenderer 的标题 id 后缀一致） */
    anchor: string;
    /** 分块标题（H2 纯文本） */
    title: string;
}
/** 图上的一个框，对应一个 md 文件 */
export interface DocBox {
    /** 框标识（参数 id；缺省为文件相对路径去 .md） */
    id: string;
    /** 框面文字（参数 title；缺省取正文第一个 H1，再缺省用 id） */
    title: string;
    /** 对应的文档路径（相对文档根） */
    docPath: string;
    /** 层级深度：根框（无入边）为 0，逐层 +1；回边不参与计算 */
    depth: number;
    /** 文档内分块（正文 H2 ≥ 2 时提取，用于框内子块渲染） */
    blocks: DocBlock[];
    /** 画布坐标与尺寸（px）；高度随分块内容自适应（不小于声明值） */
    x: number;
    y: number;
    w: number;
    h: number;
    /** 参数区中除框架保留字段外的自定义参数 */
    attrs: Record<string, unknown>;
}
/** 框的边：连线可指定连接在哪条边的中点 */
export type LinkSide = 'top' | 'right' | 'bottom' | 'left';
/** 文档间的有向连线；方向为声明方文档 → 目标文档。 */
export interface DocRelation {
    id: string;
    type: 'link';
    from: string;
    to: string;
    /** 连线标签（link 条目 `目标 | 标签` 中 | 后的文字；省略时不显示文字） */
    label?: string;
    /** 连接边覆盖（link 条目第三段 `b>l`）；缺省时按主导方向自动选边 */
    fromSide?: LinkSide;
    toSide?: LinkSide;
}
/** 一份文档群的图 */
export interface DocGraph {
    boxes: DocBox[];
    relations: DocRelation[];
    warnings: string[];
}
/** 框的默认尺寸与分层布局参数 */
export declare const BOX_DEFAULT_W = 220;
export declare const BOX_DEFAULT_H = 96;
/** 悬停展开的分块面板最多展示的条目数（超出折叠为 +N 项） */
export declare const MAX_BLOCK_SLOTS = 6;
/**
 * 解析 link 条目：`目标 | 标签 | 源边>目标边`。
 * 标签与连接边均可省略；连接边按 `t/r/b/l`（上/右/下/左）模式识别，
 * 因此 `user | r>l` 等价于无标签仅指定连接边。
 */
export declare function parseLinkEntry(raw: string): {
    ref: string;
    label?: string;
    fromSide?: LinkSide;
    toSide?: LinkSide;
};
/** 组装 link 条目（parseLinkEntry 的逆操作；连接边需成对给出） */
export declare function buildLinkEntry(parts: {
    ref: string;
    label?: string;
    fromSide?: LinkSide;
    toSide?: LinkSide;
}): string;
/** 与 ui-frame slugify 一致：小写、去除非字母数字字符、空白转连字符 */
export declare function slugify(text: string): string;
/**
 * 对一组框整体计算分层布局坐标（忽略现有坐标），用于查看器的
 * 「分层重排」：不改文件，只返回每个框应有的位置。
 */
export declare function computeLayeredLayout(boxes: ReadonlyArray<Pick<DocBox, 'id' | 'w' | 'h'>>, relations: DocRelation[]): Map<string, {
    x: number;
    y: number;
}>;
/**
 * 从文件映射构建文档图。
 *
 * @param files 相对路径 → 文件完整内容
 */
export declare function buildDocGraph(files: Record<string, string>): DocGraph;
//# sourceMappingURL=graph.d.ts.map