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

import { asRefs, parseFrameBlock } from './frame.js';

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
export const BOX_DEFAULT_W = 220;
export const BOX_DEFAULT_H = 96;
/** 悬停展开的分块面板最多展示的条目数（超出折叠为 +N 项） */
export const MAX_BLOCK_SLOTS = 6;
/** 分组区域内边距：左右/下为 GROUP_PAD，顶部为 GROUP_LABEL_H（留组名标签位） */
export const GROUP_PAD = 24;
export const GROUP_LABEL_H = 34;
const LAYER_GAP_X = 64;
const LAYER_GAP_Y = 72;
const LAYOUT_PADDING = 48;

/** 框架保留字段（不进入 attrs） */
const RESERVED_KEYS = new Set(['id', 'title', 'x', 'y', 'w', 'h', 'link', 'group']);

function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

const SIDE_CODES: Record<string, LinkSide> = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
const SIDE_LABELS: Record<LinkSide, string> = { top: 't', right: 'r', bottom: 'b', left: 'l' };
/** 连接边段：`源边>目标边`，`_` 表示该端保持自动选边 */
const SIDES_PATTERN = /^([trbl_])>([trbl_])$/;

/**
 * 解析 link 条目：`目标 | 标签 | 源边>目标边`。
 * 标签与连接边均可省略；连接边按 `t/r/b/l`（上/右/下/左）模式识别，
 * `_` 表示该端自动，因此 `user | r>l`、`user | t>_` 均合法。
 */
export function parseLinkEntry(raw: string): {
  ref: string;
  label?: string;
  fromSide?: LinkSide;
  toSide?: LinkSide;
} {
  const parts = raw.split('|').map((part) => part.trim());
  const result: ReturnType<typeof parseLinkEntry> = { ref: parts[0] };
  for (const seg of parts.slice(1)) {
    const m = seg.match(SIDES_PATTERN);
    if (m) {
      if (m[1] !== '_') result.fromSide = SIDE_CODES[m[1]];
      if (m[2] !== '_') result.toSide = SIDE_CODES[m[2]];
    } else if (seg !== '') {
      result.label = seg;
    }
  }
  return result;
}

/** 组装 link 条目（parseLinkEntry 的逆操作；只给一端时另一端写 `_` 占位） */
export function buildLinkEntry(parts: {
  ref: string;
  label?: string;
  fromSide?: LinkSide;
  toSide?: LinkSide;
}): string {
  let entry = parts.ref;
  if (parts.label) entry += ` | ${parts.label}`;
  if (parts.fromSide || parts.toSide) {
    const f = parts.fromSide ? SIDE_LABELS[parts.fromSide] : '_';
    const t = parts.toSide ? SIDE_LABELS[parts.toSide] : '_';
    entry += ` | ${f}>${t}`;
  }
  return entry;
}

/** 组条目几何段：`名称 @ x, y, w, h`（沿用 prodoc-flow 的 @ 坐标语法，扩展为四元组） */
const GROUP_GEO_PATTERN = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;

/**
 * 解析 group 条目：`名称` 或 `名称 @ x, y, w, h`。
 * 几何段不完整/不匹配时整个值视为组名（容错，不中断）。
 */
export function parseGroupEntry(raw: string): { name: string; geo?: GroupGeometry } {
  const m = raw.match(GROUP_GEO_PATTERN);
  if (!m || !m[1].trim()) return { name: raw.trim() };
  return {
    name: m[1].trim(),
    geo: { x: Number(m[2]), y: Number(m[3]), w: Number(m[4]), h: Number(m[5]) },
  };
}

/** 组装 group 条目（parseGroupEntry 的逆操作；几何四元组缺一即只写组名） */
export function buildGroupEntry(parts: { name: string } & Partial<GroupGeometry>): string {
  const { name, x, y, w, h } = parts;
  const nums = [x, y, w, h];
  if (nums.every((v): v is number => typeof v === 'number' && Number.isFinite(v))) {
    return `${name} @ ${x}, ${y}, ${w}, ${h}`;
  }
  return name;
}

/**
 * 分组区域几何：显式声明优先（原样采用）；
 * 否则取成员包围盒 + 内边距（左右/下 GROUP_PAD，顶部 GROUP_LABEL_H 留标签位）。
 */
export function computeGroupRegion(
  members: ReadonlyArray<Pick<DocBox, 'x' | 'y' | 'w' | 'h'>>,
  explicit?: GroupGeometry,
): GroupGeometry {
  if (explicit) return { ...explicit };
  if (members.length === 0) return { x: 0, y: 0, w: 0, h: 0 };
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const m of members) {
    x1 = Math.min(x1, m.x);
    y1 = Math.min(y1, m.y);
    x2 = Math.max(x2, m.x + m.w);
    y2 = Math.max(y2, m.y + m.h);
  }
  return {
    x: x1 - GROUP_PAD,
    y: y1 - GROUP_LABEL_H,
    w: x2 - x1 + GROUP_PAD * 2,
    h: y2 - y1 + GROUP_LABEL_H + GROUP_PAD,
  };
}

function firstH1(body: string): string | undefined {
  const m = body.match(/^#[ \t]+(.+)$/m);
  return m ? m[1].trim() : undefined;
}

/** 与 ui-frame slugify 一致：小写、去除非字母数字字符、空白转连字符 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 提取行内 markdown 的纯文本（链接取文字、去除强调/代码/标签） */
function inlineText(raw: string): string {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/** 从正文提取 H2 分块；跳过代码围栏，不足 2 个时不视为可分块 */
function extractBlocks(body: string): DocBlock[] {
  const blocks: DocBlock[] = [];
  let fenceChar: string | null = null;

  for (const line of body.split('\n')) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (fenceChar === null) fenceChar = fence[1][0];
      else if (fence[1][0] === fenceChar) fenceChar = null;
      continue;
    }
    if (fenceChar !== null) continue;

    const m = line.match(/^##[ \t]+(.+?)\s*#*\s*$/);
    if (m) {
      const title = inlineText(m[1]);
      if (title) blocks.push({ anchor: slugify(title), title });
    }
  }

  return blocks.length >= 2 ? blocks : [];
}

/**
 * 计算各框的层级深度：根框（无入边）为 0，其余取父框最大深度 +1。
 * 环上的回边不参与深度贡献，保证任意图都可收敛。
 */
function computeDepths(boxes: ReadonlyArray<{ id: string }>, relations: DocRelation[]): Map<string, number> {
  const preds = new Map<string, string[]>();
  for (const r of relations) {
    const list = preds.get(r.to);
    if (list) list.push(r.from);
    else preds.set(r.to, [r.from]);
  }

  const depth = new Map<string, number>();
  const visiting = new Set<string>();

  function visit(id: string): number {
    const cached = depth.get(id);
    if (cached !== undefined) return cached;
    if (visiting.has(id)) return -1; // 回边：忽略贡献

    visiting.add(id);
    let d = 0;
    for (const p of preds.get(id) ?? []) {
      const pd = visit(p);
      if (pd >= 0) d = Math.max(d, pd + 1);
    }
    visiting.delete(id);
    depth.set(id, d);
    return d;
  }

  for (const box of boxes) visit(box.id);
  return depth;
}

/** 参与分层布局计算的最小框形状 */
type LayoutBox = Pick<DocBox, 'id' | 'x' | 'y' | 'w' | 'h'>;

/** 框的原始坐标声明（分层布局时区分显式坐标与缺省坐标） */
interface BoxParams {
  rawX?: number;
  rawY?: number;
}

/**
 * 分层自动布局：缺省 x/y 的框按深度分层（顶层为根），层内按父框
 * 平均横坐标排序以减少交叉；层过宽时按 √n 列换行。
 * 显式声明了某个轴的框，该轴坐标保持不变。
 */
function applyLayeredLayout(
  boxes: LayoutBox[],
  relations: DocRelation[],
  depthOf: Map<string, number>,
  paramsOf: Map<string, BoxParams>,
) {
  interface AutoBox {
    box: LayoutBox;
    depth: number;
  }
  const autos: AutoBox[] = boxes
    .filter((box) => {
      const p = paramsOf.get(box.id)!;
      return p.rawX === undefined || p.rawY === undefined;
    })
    .map((box) => ({ box, depth: depthOf.get(box.id) ?? 0 }));
  if (autos.length === 0) return;

  const maxCols = Math.max(2, Math.ceil(Math.sqrt(autos.length)));
  const centerX = (box: LayoutBox) => box.x + box.w / 2;

  // 已定位框的横中心（显式坐标框先行可用，自动框随层推进逐步可用）
  const placedX = new Map<string, number>();
  for (const box of boxes) {
    if (paramsOf.get(box.id)!.rawX !== undefined) placedX.set(box.id, centerX(box));
  }
  const preds = new Map<string, string[]>();
  for (const r of relations) {
    const list = preds.get(r.to);
    if (list) list.push(r.from);
    else preds.set(r.to, [r.from]);
  }

  // 分层：深度相同的框同属一层
  const layers = new Map<number, AutoBox[]>();
  for (const auto of autos) {
    const layer = layers.get(auto.depth);
    if (layer) layer.push(auto);
    else layers.set(auto.depth, [auto]);
  }
  const depths = [...layers.keys()].sort((a, b) => a - b);

  let layerY = LAYOUT_PADDING;
  for (const depth of depths) {
    const layer = layers.get(depth)!;

    // 层内排序：有父框的按父框平均横坐标（重心），无父框的保持文件顺序排右侧
    const keyed = layer.map((auto, idx) => {
      const parentXs = (preds.get(auto.box.id) ?? [])
        .map((p) => placedX.get(p))
        .filter((x): x is number => x !== undefined);
      const bary = parentXs.length
        ? parentXs.reduce((a, b) => a + b, 0) / parentXs.length
        : Number.MAX_SAFE_INTEGER - (layer.length - idx);
      return { auto, bary };
    });
    keyed.sort((a, b) => a.bary - b.bary);
    const ordered = keyed.map((k) => k.auto);

    // 换行：每行最多 maxCols 个；行高取行内最高框
    let rowTop = layerY;
    let maxRowH = 0;
    let x = LAYOUT_PADDING;
    let inRow = 0;
    for (const { box } of ordered) {
      if (inRow === maxCols) {
        rowTop += maxRowH + LAYER_GAP_Y;
        maxRowH = 0;
        x = LAYOUT_PADDING;
        inRow = 0;
      }
      const p = paramsOf.get(box.id)!;
      if (p.rawX === undefined) box.x = x;
      if (p.rawY === undefined) box.y = rowTop;
      placedX.set(box.id, centerX(box));
      x += box.w + LAYER_GAP_X;
      maxRowH = Math.max(maxRowH, box.h);
      inRow++;
    }
    layerY = rowTop + maxRowH + LAYER_GAP_Y;
  }
}

/**
 * 对一组框整体计算分层布局坐标（忽略现有坐标），用于查看器的
 * 「分层重排」：不改文件，只返回每个框应有的位置。
 */
export function computeLayeredLayout(
  boxes: ReadonlyArray<Pick<DocBox, 'id' | 'w' | 'h'>>,
  relations: DocRelation[],
): Map<string, { x: number; y: number }> {
  const stubs: LayoutBox[] = boxes.map((box) => ({ ...box, x: 0, y: 0 }));
  const depthOf = computeDepths(stubs, relations);
  const paramsOf = new Map<string, BoxParams>(stubs.map((box) => [box.id, {}]));
  applyLayeredLayout(stubs, relations, depthOf, paramsOf);
  return new Map(stubs.map((box) => [box.id, { x: box.x, y: box.y }]));
}

/**
 * 从文件映射构建文档图。
 *
 * @param files 相对路径 → 文件完整内容
 */
export function buildDocGraph(files: Record<string, string>): DocGraph {
  const paths = Object.keys(files).sort();
  const warnings: string[] = [];
  const byId = new Map<string, DocBox>();
  const paramsOf = new Map<string, BoxParams>();
  /** 框 id → group 声明（成员关系 + 可选显式几何） */
  const groupDecls = new Map<string, { name: string; geo?: GroupGeometry }>();

  for (const docPath of paths) {
    const { params, body } = parseFrameBlock(files[docPath]);

    const id =
      typeof params.id === 'string' && params.id.trim() !== ''
        ? params.id.trim()
        : docPath.replace(/\.md$/, '');
    const title =
      (typeof params.title === 'string' && params.title.trim() !== '' && params.title.trim()) ||
      firstH1(body) ||
      id;

    const blocks = extractBlocks(body);
    const w = asNumber(params.w) ?? BOX_DEFAULT_W;
    const h = asNumber(params.h) ?? BOX_DEFAULT_H;

    const attrs: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params)) {
      if (!RESERVED_KEYS.has(key)) attrs[key] = value;
    }

    const box: DocBox = {
      id,
      title,
      docPath,
      depth: 0,
      blocks,
      // 坐标先按显式值/0 占位，分层布局阶段统一计算
      x: asNumber(params.x) ?? 0,
      y: asNumber(params.y) ?? 0,
      w,
      h,
      attrs,
    };
    paramsOf.set(id, { rawX: asNumber(params.x), rawY: asNumber(params.y) });

    // group 声明：单值；声明多个（列表）时仅取第一个并告警
    if (params.group !== undefined) {
      const rawList = Array.isArray(params.group) ? params.group : [params.group];
      const entries = rawList
        .map((item) => (typeof item === 'string' ? item : typeof item === 'number' ? String(item) : ''))
        .filter((item) => item.trim() !== '');
      if (entries.length > 1) {
        warnings.push(`文档 "${id}" 声明了多个 group，仅取第一个 "${parseGroupEntry(entries[0]).name || entries[0]}"`);
      }
      if (entries.length > 0) {
        const { name, geo } = parseGroupEntry(entries[0]);
        if (name) groupDecls.set(id, { name, geo });
      }
    }

    if (byId.has(id)) {
      warnings.push(`重复 id "${id}"：${byId.get(id)!.docPath} 被 ${docPath} 覆盖`);
    }
    byId.set(id, box);
  }

  const boxes = [...byId.values()];
  const byPath = new Map(boxes.map((box) => [box.docPath, box]));
  const relations: DocRelation[] = [];
  const relationKeys = new Set<string>();

  function resolveRef(raw: string): DocBox | undefined {
    const ref = raw.trim();
    const docPath = ref.endsWith('.md') ? ref : ref + '.md';
    return byId.get(ref) ?? byPath.get(ref) ?? byPath.get(docPath);
  }

  function addRelation(
    fromRef: string,
    toRef: string,
    extra: { label?: string; fromSide?: LinkSide; toSide?: LinkSide },
    declaredBy: string,
  ) {
    const from = resolveRef(fromRef);
    const to = resolveRef(toRef);
    if (!from || !to) {
      const missing = !from ? fromRef : toRef;
      warnings.push("连线 " + declaredBy + " 引用了不存在的文档 \"" + missing + "\"");
      return;
    }
    if (from.id === to.id) {
      warnings.push("文档 \"" + from.id + "\" 不能连线自身");
      return;
    }

    const key = from.id + '->' + to.id;
    if (relationKeys.has(key)) return;
    relationKeys.add(key);
    relations.push({
      id: key,
      type: 'link',
      from: from.id,
      to: to.id,
      label: extra.label,
      fromSide: extra.fromSide,
      toSide: extra.toSide,
    });
  }

  for (const box of boxes) {
    const { params } = parseFrameBlock(files[box.docPath]);
    for (const entry of asRefs(params.link)) {
      const { ref, label, fromSide, toSide } = parseLinkEntry(entry);
      if (ref) addRelation(box.id, ref, { label, fromSide, toSide }, box.id + '.link');
    }
  }

  // 层级深度 + 分层自动布局
  const depthOf = computeDepths(boxes, relations);
  for (const box of boxes) box.depth = depthOf.get(box.id) ?? 0;
  applyLayeredLayout(boxes, relations, depthOf, paramsOf);

  // 分组：相同组名的框围入同一区域。几何取「几何持有者」（按路径字典序首个
  // 声明了显式几何的成员）的声明值；多成员声明且不一致时取首个并告警；
  // 无显式几何时区域 = 成员包围盒 + 内边距（随成员移动自动重算）。
  const groupMap = new Map<string, { members: DocBox[]; geo?: GroupGeometry; holder?: string }>();
  for (const box of boxes) {
    const decl = groupDecls.get(box.id);
    if (!decl) continue;
    let group = groupMap.get(decl.name);
    if (!group) {
      group = { members: [] };
      groupMap.set(decl.name, group);
    }
    group.members.push(box);
    if (decl.geo) {
      if (!group.geo) {
        group.geo = decl.geo;
        group.holder = box.docPath;
      } else if (
        group.geo.x !== decl.geo.x ||
        group.geo.y !== decl.geo.y ||
        group.geo.w !== decl.geo.w ||
        group.geo.h !== decl.geo.h
      ) {
        warnings.push(`组 "${decl.name}" 的显式几何被多个成员声明且不一致，取 ${group.holder} 的声明`);
      }
    }
  }
  const groups: DocGroup[] = [...groupMap.entries()].map(([name, group]) => ({
    name,
    members: group.members.map((box) => box.id),
    ...computeGroupRegion(group.members, group.geo),
    explicit: group.geo !== undefined,
    holder: group.holder ?? group.members[0].docPath,
  }));

  return { boxes, relations, groups, warnings };
}
