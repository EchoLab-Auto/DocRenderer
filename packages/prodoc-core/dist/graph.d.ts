/**
 * 文档图（DocGraph）构建
 *
 * 新 ProDoc 模型的核心：目录下的每个 md 文件对应图上的一个框（DocBox）。
 * 框的属性（id、标题、位置、尺寸等）来自文件最前方的框架参数区；
 * 缺少位置参数的框按 link 连线结构分层自动排布（根框在顶层，逐层向下）。
 * 正文 H2 标题提取为文档内分块（≥2 个时），在框内渲染为可跳转子块。
 * group 参数把同组框围入一个圆角矩形分组区域（几何可显式声明）。
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
/** 文档间的有向关系；方向为声明方文档 → 目标文档。
 * `link` = 导航连线（实线箭头）；`parent` = 包含关系（parent 参数，虚线）。 */
export interface DocRelation {
    id: string;
    type: 'link' | 'parent';
    from: string;
    to: string;
    /** 连线标签（link 条目 `目标 | 标签` 中 | 后的文字；省略时不显示文字） */
    label?: string;
    /** 连接边覆盖（link 条目第三段 `b>l`）；缺省时按主导方向自动选边 */
    fromSide?: LinkSide;
    toSide?: LinkSide;
}
/** 组区域的显式几何（`group: "名称 @ x, y, w, h"`） */
export interface GroupGeometry {
    x: number;
    y: number;
    w: number;
    h: number;
}
/** 文档分组：相同 group 名的框被围入同一个圆角矩形区域 */
export interface DocGroup {
    /** 组名（group 参数值，即区域标签文字） */
    name: string;
    /** 成员框 id（按文件路径字典序） */
    members: string[];
    /** 区域位置与尺寸（px）：显式几何为声明值，否则为成员包围盒 + 内边距 */
    x: number;
    y: number;
    w: number;
    h: number;
    /** 是否显式声明了几何；显式时区域不随成员移动自动重算 */
    explicit: boolean;
    /** 几何持有者的文档路径（声明了几何的首个成员；无显式几何时为首个成员）——画布调整的写回目标 */
    holder: string;
}
/** 一份文档群的图 */
export interface DocGraph {
    boxes: DocBox[];
    relations: DocRelation[];
    groups: DocGroup[];
    warnings: string[];
}
/** 框的默认尺寸与分层布局参数 */
export declare const BOX_DEFAULT_W = 220;
export declare const BOX_DEFAULT_H = 96;
/** 悬停展开的分块面板最多展示的条目数（超出折叠为 +N 项） */
export declare const MAX_BLOCK_SLOTS = 6;
/** 分组区域内边距：左右/下为 GROUP_PAD，顶部为 GROUP_LABEL_H（留组名标签位） */
export declare const GROUP_PAD = 24;
export declare const GROUP_LABEL_H = 34;
/**
 * 解析 link 条目：`目标 | 标签 | 源边>目标边`。
 * 标签与连接边均可省略；连接边按 `t/r/b/l`（上/右/下/左）模式识别，
 * `_` 表示该端自动，因此 `user | r>l`、`user | t>_` 均合法。
 */
export declare function parseLinkEntry(raw: string): {
    ref: string;
    label?: string;
    fromSide?: LinkSide;
    toSide?: LinkSide;
};
/** 组装 link 条目（parseLinkEntry 的逆操作；只给一端时另一端写 `_` 占位） */
export declare function buildLinkEntry(parts: {
    ref: string;
    label?: string;
    fromSide?: LinkSide;
    toSide?: LinkSide;
}): string;
/**
 * 解析 group 条目：`名称` 或 `名称 @ x, y, w, h`。
 * 几何段不完整/不匹配时整个值视为组名（容错，不中断）。
 */
export declare function parseGroupEntry(raw: string): {
    name: string;
    geo?: GroupGeometry;
};
/** 组装 group 条目（parseGroupEntry 的逆操作；几何四元组缺一即只写组名） */
export declare function buildGroupEntry(parts: {
    name: string;
} & Partial<GroupGeometry>): string;
/**
 * 分组区域几何：显式声明优先（原样采用）；
 * 否则取成员包围盒 + 内边距（左右/下 GROUP_PAD，顶部 GROUP_LABEL_H 留标签位）。
 */
export declare function computeGroupRegion(members: ReadonlyArray<Pick<DocBox, 'x' | 'y' | 'w' | 'h'>>, explicit?: GroupGeometry): GroupGeometry;
/** 与 ui-frame slugify 一致：小写、去除非字母数字字符、空白转连字符 */
export declare function slugify(text: string): string;
/** 框的原始坐标声明（分层布局时区分显式坐标与缺省坐标） */
interface BoxParams {
    rawX?: number;
    rawY?: number;
}
/**
 * 对一组框整体计算分层布局坐标（忽略现有坐标），用于查看器的
 * 「分层重排」：不改文件，只返回每个框应有的位置。
 */
export declare function computeLayeredLayout(boxes: ReadonlyArray<Pick<DocBox, 'id' | 'w' | 'h'>>, relations: DocRelation[]): Map<string, {
    x: number;
    y: number;
}>;
/**
 * 树状布局：基于 parent（包含关系）关系组织，无 parent 的文档为根并列顶层；
 * 深度 = parent 链长；同层按 DFS 中序分配水平位置（子树连续区间）。
 * 未声明 parent 的文档（孤立/仅 link）作为独立根排在右侧。
 * 返回坐标覆盖表（id → {x,y}），不写回文件；与分层布局一样是临时视图。
 */
export declare function computeTreeLayout(boxes: ReadonlyArray<Pick<DocBox, 'id' | 'title' | 'w' | 'h'>>, relations: DocRelation[], paramsOf?: Map<string, BoxParams>): Map<string, {
    x: number;
    y: number;
}>;
/**
 * 从文件映射构建文档图。
 *
 * @param files 相对路径 → 文件完整内容
 */
export declare function buildDocGraph(files: Record<string, string>): DocGraph;
export {};
//# sourceMappingURL=graph.d.ts.map