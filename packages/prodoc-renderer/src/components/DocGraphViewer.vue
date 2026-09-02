<script setup lang="ts">
/**
 * DocGraphViewer — 新 ProDoc 模型的查看器
 *
 * 文档群 = 一张图；每个 md 文件 = 图上一个框（属性来自其框架参数区）。
 * 默认展示图画布（可平移/缩放/适配），点击框跳转到该文档正文；
 * 正文渲染基于剥离框架参数区后的内容。地址栏 hash 同步当前文档路径。
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  NeumorphismBadge,
  NeumorphismCanvas,
  NeumorphismModal,
  NeumorphismPopover,
  NeumorphismThemeToggle,
  NeumorphismToastProvider,
  useTouchDevice,
} from '@echolab-auto/ui-frame';
import { MarkdownEditor, MarkdownRenderer, writeFlowNodePosition } from '@echolab-auto/ui-frame/doc';
import {
  buildDocGraph,
  computeLayeredLayout,
  computeGroupRegion,
  parseFrameBlock,
  parseLinkEntry,
  buildLinkEntry,
  buildGroupEntry,
  readFrameLinks,
  writeFrameLinks,
  writeFrameGroup,
  writeFramePosition,
  MAX_BLOCK_SLOTS,
  GROUP_PAD,
  BOX_DEFAULT_W,
  BOX_DEFAULT_H,
  slugify,
  type DocGraph,
  type DocBox,
  type DocGroup,
  type LinkSide,
} from '@prodoc/core';

/** 写盘结果：对象形式可携带失败原因（409 冲突 / 其他错误），布尔为兼容旧契约 */
type SaveResult = { ok: boolean; status?: number; error?: string };

const props = defineProps<{
  /** 相对路径 → 文件完整内容 */
  files: Record<string, string>;
  /** 保存处理器（可选）：返回写盘结果；提供时优先于 save 事件（可感知失败） */
  saveHandler?: (path: string, content: string, base?: string) => Promise<boolean | SaveResult>;
  /** 删除处理器（可选）：删除磁盘文件；提供时图编辑模式开放节点删除 */
  deleteHandler?: (path: string, base?: string) => Promise<boolean | SaveResult>;
}>();

const emit = defineEmits<{
  /** 点击框或正文内文档链接时触发 */
  navigate: [path: string];
  /** 保存文档（原始完整内容，含框架参数区）；base 为客户端依据的磁盘内容，用于服务端冲突检测 */
  save: [path: string, content: string, base?: string];
}>();

/** 统一通知通道（ui-frame toast，替代原生 alert） */
const toastRef = ref<{ addToast: (o: { message: string; type?: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => string } | null>(null);
function notify(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration = 4000) {
  toastRef.value?.addToast({ message, type, duration });
}

/** 保存通道：优先 saveHandler prop，否则 fire-and-forget 的 save 事件；统一归一为 SaveResult */
async function requestSave(path: string, content: string, base?: string): Promise<SaveResult> {
  if (props.saveHandler) {
    const r = await props.saveHandler(path, content, base);
    return typeof r === 'object' ? r : { ok: r };
  }
  emit('save', path, content, base);
  return { ok: true };
}

/** 删除通道：deleteHandler prop；未提供时调用方应隐藏删除入口 */
async function requestDelete(path: string, base?: string): Promise<SaveResult> {
  if (!props.deleteHandler) return { ok: false, error: '当前环境不支持删除文档' };
  const r = await props.deleteHandler(path, base);
  return typeof r === 'object' ? r : { ok: r };
}

/** 写盘失败的统一提示：409 与其他错误区分文案 */
function notifyWriteFailure(action: '保存' | '删除', path: string, res: SaveResult) {
  if (res.status === 409) {
    notify(`「${path}」在磁盘上已被其他程序修改，${action}被拒绝。该文件的暂存已保留，可刷新页面同步后重试（或「↩ 放弃更改」丢弃）。`, 'error', 8000);
  } else {
    notify(`「${path}」${action}失败：${res.error ?? '未知错误'}`, 'error', 6000);
  }
}

/** 图编辑模式的暂存修改：docPath → 修改后的完整内容（未写盘，「💾 保存」统一写回） */
const pendingDrafts = ref<Map<string, string>>(new Map());

/** 暂存的删除标记：docPath 集合（「💾 保存」时经删除 API 删文件；保存前可撤销） */
const pendingDeletes = ref<Set<string>>(new Set());

/** 有待保存的图修改（内容暂存 + 删除暂存） */
const graphDirty = computed(() => pendingDrafts.value.size > 0 || pendingDeletes.value.size > 0);

/* ============ 撤销 / 重做（图编辑模式操作栈） ============ */

/** 编辑状态快照：暂存、新建标记、删除标记与位置覆盖的整体状态 */
interface EditSnapshot {
  drafts: [string, string][];
  newPaths: string[];
  deletes: string[];
  overrides: [string, { x: number; y: number }][] | null;
}

const undoStack = ref<EditSnapshot[]>([]);
const redoStack = ref<EditSnapshot[]>([]);

function takeSnapshot(): EditSnapshot {
  return {
    drafts: [...pendingDrafts.value],
    newPaths: [...newDraftPaths],
    deletes: [...pendingDeletes.value],
    overrides: relayouted.value ? [...relayouted.value] : null,
  };
}

function snapshotsEqual(a: EditSnapshot, b: EditSnapshot): boolean {
  if (a.deletes.length !== b.deletes.length || a.newPaths.length !== b.newPaths.length) return false;
  if (a.drafts.length !== b.drafts.length) return false;
  if ((a.overrides?.length ?? 0) !== (b.overrides?.length ?? 0)) return false;
  const am = new Map(a.drafts);
  if (!b.drafts.every(([p, c]) => am.get(p) === c)) return false;
  if (!a.deletes.every((p) => b.deletes.includes(p))) return false;
  if (!a.newPaths.every((p) => b.newPaths.includes(p))) return false;
  const ao = new Map(a.overrides ?? []);
  return (b.overrides ?? []).every(([id, pos]) => ao.get(id)?.x === pos.x && ao.get(id)?.y === pos.y);
}

/** 操作完成后提交撤销点：before 为操作前快照；状态未变（纯点击等）则不产生撤销点 */
function commitUndo(before: EditSnapshot) {
  if (snapshotsEqual(before, takeSnapshot())) return;
  undoStack.value = [...undoStack.value, before];
  redoStack.value = [];
}

function applySnapshot(s: EditSnapshot) {
  pendingDrafts.value = new Map(s.drafts);
  newDraftPaths = new Set(s.newPaths);
  pendingDeletes.value = new Set(s.deletes);
  relayouted.value = s.overrides ? new Map(s.overrides) : null;
}

function undoEdit() {
  const s = undoStack.value[undoStack.value.length - 1];
  if (!s) return;
  undoStack.value = undoStack.value.slice(0, -1);
  redoStack.value = [...redoStack.value, takeSnapshot()];
  applySnapshot(s);
}

function redoEdit() {
  const s = redoStack.value[redoStack.value.length - 1];
  if (!s) return;
  redoStack.value = redoStack.value.slice(0, -1);
  undoStack.value = [...undoStack.value, takeSnapshot()];
  applySnapshot(s);
}

/* ============ 暂存持久化（刷新/关页后可恢复，以磁盘内容为基准校验） ============ */

const DRAFT_STORAGE_KEY = `prodoc-drafts:${typeof location !== 'undefined' ? location.origin : ''}`;

/** 把当前暂存写入 localStorage；无暂存时清除 */
function persistDrafts() {
  try {
    if (!graphDirty.value) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return;
    }
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      v: 1,
      drafts: [...pendingDrafts.value].map(([path, content]) => ({
        path,
        base: props.files[path] ?? null,
        content,
      })),
      deletes: [...pendingDeletes.value].map((path) => ({ path, base: props.files[path] ?? null })),
    }));
  } catch { /* 隐私模式等场景下存储不可用，静默降级为不持久化 */ }
}

/**
 * 启动时恢复上次未保存的暂存。恢复校验（与磁盘内容比对）：
 * 内容已一致（保存生效）或基准已偏离（磁盘被外部改动）的条目丢弃，其余恢复；
 * 返回恢复的条数。
 */
function restoreDrafts(): number {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch { return 0; }
  if (!raw) return 0;
  try {
    const data = JSON.parse(raw) as {
      drafts?: { path: string; base: string | null; content: string }[];
      deletes?: { path: string; base: string | null }[];
    };
    const drafts = new Map<string, string>();
    const deletes = new Set<string>();
    for (const item of data.drafts ?? []) {
      const disk = props.files[item.path];
      if (disk === item.content) continue; // 已保存生效
      if (item.base !== null && disk !== item.base) continue; // 磁盘已偏离基准
      if (item.base === null && disk !== undefined) continue; // 新建文件却在磁盘出现且内容不同
      drafts.set(item.path, item.content);
      if (disk === undefined) newDraftPaths.add(item.path);
    }
    for (const item of data.deletes ?? []) {
      const disk = props.files[item.path];
      if (disk === undefined) continue; // 已被删除
      if (item.base !== null && disk !== item.base) continue;
      deletes.add(item.path);
    }
    const restored = drafts.size + deletes.size;
    if (restored > 0) {
      pendingDrafts.value = drafts;
      pendingDeletes.value = deletes;
    }
    return restored;
  } catch { return 0; }
}

// 暂存变化即持久化（pendingDrafts/pendingDeletes 都以整体替换方式更新，浅监听即可）
watch([pendingDrafts, pendingDeletes], persistDrafts);

/** 画布消费的文件映射：磁盘内容 + 暂存修改覆盖（暂存即时反映在画布上） */
const effectiveFiles = computed<Record<string, string>>(() =>
  pendingDrafts.value.size
    ? { ...props.files, ...Object.fromEntries(pendingDrafts.value) }
    : props.files,
);

/** 文档群 → 图（含布局与警告）；基于含暂存修改的有效内容构建 */
const graph = computed<DocGraph>(() => buildDocGraph(effectiveFiles.value));

/** 每个文件剥离参数区后的正文（基于磁盘内容：图编辑暂存期间不开放正文视图） */
const bodies = computed<Record<string, string>>(() =>
  Object.fromEntries(
    Object.entries(props.files).map(([path, content]) => [path, parseFrameBlock(content).body]),
  ),
);

// 构建警告输出到控制台（容错，不阻断渲染）
watch(
  () => graph.value.warnings,
  (warnings) => warnings.forEach((w) => console.warn('[ProDoc]', w)),
  { immediate: true },
);

/** 当前打开的文档路径；null 表示处于图画布视图 */
const currentPath = ref<string | null>(null);

const canvasRef = ref<{ fit?: () => void } | null>(null);

/** 画布舞台尺寸：容纳所有框与分组区域 + 边距 */
const stage = computed(() => {
  const PADDING = 48;
  let w = 0;
  let h = 0;
  for (const box of layoutBoxes.value) {
    w = Math.max(w, box.x + box.w + PADDING);
    h = Math.max(h, box.y + box.h + PADDING);
  }
  for (const group of groupRegions.value) {
    w = Math.max(w, group.x + group.w + PADDING);
    h = Math.max(h, group.y + group.h + PADDING);
  }
  return { w: Math.max(w, 640), h: Math.max(h, 480) };
});


interface RelationEdge {
  id: string;
  fromId: string;
  toId: string;
  fromTitle: string;
  toTitle: string;
  label?: string;
  fromSide?: LinkSide;
  toSide?: LinkSide;
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  labelX: number;
  labelY: number;
  /** 删除按钮（✕）位置：沿中点法线偏移，避免压住标签文字 */
  delX: number;
  delY: number;
}

/** 边中点及其外法线方向 */
function sidePoint(box: Pick<DocBox, 'x' | 'y' | 'w' | 'h'>, side: LinkSide) {
  switch (side) {
    case 'top':
      return { x: box.x + box.w / 2, y: box.y, nx: 0, ny: -1 };
    case 'bottom':
      return { x: box.x + box.w / 2, y: box.y + box.h, nx: 0, ny: 1 };
    case 'left':
      return { x: box.x, y: box.y + box.h / 2, nx: -1, ny: 0 };
    default:
      return { x: box.x + box.w, y: box.y + box.h / 2, nx: 1, ny: 0 };
  }
}

/** 自动选边：纵向流为底→顶，横向流为右→左（按目标方位取反） */
function autoSides(
  from: Pick<DocBox, 'x' | 'y' | 'w' | 'h'>,
  to: Pick<DocBox, 'x' | 'y' | 'w' | 'h'>,
): { fs: LinkSide; ts: LinkSide } {
  const cx1 = from.x + from.w / 2;
  const cy1 = from.y + from.h / 2;
  const dx = to.x + to.w / 2 - cx1;
  const dy = to.y + to.h / 2 - cy1;
  const vertical = Math.abs(dy) >= Math.abs(dx);
  return vertical
    ? { fs: dy >= 0 ? 'bottom' : 'top', ts: dy >= 0 ? 'top' : 'bottom' }
    : { fs: dx >= 0 ? 'right' : 'left', ts: dx >= 0 ? 'left' : 'right' };
}

/**
 * 连线几何：默认按两框中心的主导方向自动选边（上/下/左/右的边缘中点），
 * 也可用 fromSide/toSide 显式指定连接边（图编辑模式下拖动端点调整）。
 * 控制点沿两端所连边的外法线布置，曲线在两端始终与边线法线相切。
 */
function edgeGeometry(
  from: Pick<DocBox, 'x' | 'y' | 'w' | 'h'>,
  to: Pick<DocBox, 'x' | 'y' | 'w' | 'h'>,
  fromSide?: LinkSide,
  toSide?: LinkSide,
) {
  const auto = autoSides(from, to);
  const p1 = sidePoint(from, fromSide ?? auto.fs);
  const p2 = sidePoint(to, toSide ?? auto.ts);
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const k = Math.max(24, Math.min(dist * 0.45, 96));

  const d = `M ${p1.x} ${p1.y} C ${p1.x + p1.nx * k} ${p1.y + p1.ny * k}, ${p2.x + p2.nx * k} ${p2.y + p2.ny * k}, ${p2.x} ${p2.y}`;
  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, d };
}

const relationEdges = computed<RelationEdge[]>(() => {
  const boxes = new Map(layoutBoxes.value.map((box) => [box.id, box]));
  const preview = sideDrag.value;
  return graph.value.relations.flatMap((relation) => {
    const from = boxes.get(relation.from);
    const to = boxes.get(relation.to);
    if (!from || !to) return [];

    // 连接边拖拽预览：被拖端点实时跟随预览边
    let fromSide = relation.fromSide;
    let toSide = relation.toSide;
    if (preview && preview.edgeId === relation.id) {
      if (preview.which === 'from') fromSide = preview.side;
      else toSide = preview.side;
    }

    const { x1, y1, x2, y2, d } = edgeGeometry(from, to, fromSide, toSide);
    const labelX = (x1 + x2) / 2;
    const labelY = (y1 + y2) / 2 - 7;
    // ✕ 沿两端连线的法线方向偏移 18px，与标签文字错开
    const ddx = x2 - x1;
    const ddy = y2 - y1;
    const len = Math.hypot(ddx, ddy) || 1;
    return [{
      id: relation.id,
      fromId: from.id,
      toId: to.id,
      fromTitle: from.title,
      toTitle: to.title,
      label: relation.label,
      fromSide: relation.fromSide,
      toSide: relation.toSide,
      d,
      x1,
      y1,
      x2,
      y2,
      labelX,
      labelY,
      delX: labelX + (-ddy / len) * 18,
      delY: labelY + 7 + (ddx / len) * 18,
    }];
  });
});

/** 悬停高亮：悬停框及其直接上下游保持常态，其余元素淡出（拖拽/连线中不参与） */
const hovered = ref<string | null>(null);

function onBoxHover(id: string | null) {
  if (dragBox.value || linkDraft.value || sideDrag.value) return;
  hovered.value = id;
}

const hoverNeighbors = computed<Set<string>>(() => {
  if (!hovered.value) return new Set();
  const ids = new Set([hovered.value]);
  for (const r of graph.value.relations) {
    if (r.from === hovered.value) ids.add(r.to);
    if (r.to === hovered.value) ids.add(r.from);
  }
  return ids;
});

const isBoxDimmed = (id: string) => hovered.value !== null && !hoverNeighbors.value.has(id);
const isEdgeHot = (edge: RelationEdge) =>
  hovered.value !== null && (edge.fromId === hovered.value || edge.toId === hovered.value);
const isEdgeDimmed = (edge: RelationEdge) => hovered.value !== null && !isEdgeHot(edge);

/** 坐标覆盖表（分层重排全量、拖拽单框增量）；null 表示全部使用文件坐标 */
const relayouted = ref<Map<string, { x: number; y: number }> | null>(null);

/** 应用坐标覆盖后的框（舞台尺寸、连线、模板统一消费） */
const layoutBoxes = computed<DocBox[]>(() =>
  graph.value.boxes.map((box) => {
    const pos = relayouted.value?.get(box.id);
    return pos ? { ...box, x: pos.x, y: pos.y } : box;
  }),
);

function setPositionOverride(id: string, pos: { x: number; y: number }) {
  const map = new Map(relayouted.value ?? []);
  map.set(id, pos);
  relayouted.value = map;
}

/**
 * 画布消费的分组区域：自动区域按成员实时位置（含覆盖坐标）重算包围盒；
 * 显式几何区域不随成员移动，仅在组拖拽/尺寸拖拽中给预览值。
 */
const groupRegions = computed<DocGroup[]>(() => {
  const drag = groupDrag.value;
  const resize = groupResize.value;
  return graph.value.groups.map((group) => {
    if (resize && resize.moved && resize.name === group.name) {
      // 尺寸预览：原点取拖拽开始时的视觉区域（自动区域在覆盖坐标下同样正确）
      return { ...group, x: resize.baseRegion.x, y: resize.baseRegion.y, w: resize.curW, h: resize.curH };
    }
    if (group.explicit) {
      if (drag && drag.moved && drag.name === group.name) {
        return { ...group, x: drag.baseRegion.x + drag.dx, y: drag.baseRegion.y + drag.dy };
      }
      return group;
    }
    const memberBoxes = group.members
      .map((id) => layoutBoxes.value.find((b) => b.id === id))
      .filter((b): b is DocBox => Boolean(b));
    return { ...group, ...computeGroupRegion(memberBoxes) };
  });
});

/** 悬停高亮联动：组内无任何 hover 邻居时区域一并淡出 */
const isGroupDimmed = (group: DocGroup) =>
  hovered.value !== null && !group.members.some((id) => hoverNeighbors.value.has(id));

/** 一键分层重排：忽略文件坐标，按连线层级重新排布（仅当前视图，不写回文件）。
 *  编辑模式下有暂存的框不参与——其视图必须反映暂存内容中的坐标，
 *  否则画布显示与「💾 保存」将写回的内容脱节 */
function toggleRelayout() {
  if (relayouted.value) {
    relayouted.value = null;
    return;
  }
  const map = computeLayeredLayout(graph.value.boxes, graph.value.relations);
  if (graphEditMode.value) {
    for (const p of pendingDrafts.value.keys()) {
      const box = graph.value.boxes.find((b) => b.docPath === p);
      if (box) map.delete(box.id);
    }
  }
  relayouted.value = map;
}

/** 悬停分块面板：条目、溢出行数与弹出方向（贴近画布底边时向上弹出） */
const PANEL_ITEM_H = 30;
const panelBlocks = (box: DocBox) => box.blocks.slice(0, MAX_BLOCK_SLOTS);
const panelOverflow = (box: DocBox) => Math.max(0, box.blocks.length - MAX_BLOCK_SLOTS);
const panelHeight = (box: DocBox) =>
  (panelBlocks(box).length + (panelOverflow(box) > 0 ? 1 : 0)) * PANEL_ITEM_H + 12;
const panelAbove = (box: DocBox, stageH: number) => box.y + box.h + 6 + panelHeight(box) > stageH;

/* ============ 画布编辑：图编辑模式（修改暂存 → 保存统一写回 / 放弃整批丢弃） ============ */

/** 图编辑模式开关：关闭时画布纯浏览（单击打开文档），开启后才能拖框与编辑连线 */
const graphEditMode = ref(false);

/** 编辑状态的工具栏：🖱 选择（默认）/ 🔗 连线 / 📄 节点；退出编辑状态复位 */
const editTool = ref<'select' | 'link' | 'node'>('select');

/** 暂存中的新建文件路径（热更新修剪时「磁盘上不存在」对它们是正常状态，不视为删除信号） */
let newDraftPaths = new Set<string>();

/* ============ 通用确认对话框（丢弃修改、删除文档等破坏性操作前的拦截） ============ */

const confirmDialog = ref<{ title: string; message: string; action: (() => void) | null }>({
  title: '',
  message: '',
  action: null,
});
const confirmVisible = ref(false);

function askConfirm(title: string, message: string, action: () => void) {
  confirmDialog.value = { title, message, action };
  confirmVisible.value = true;
}

function onConfirmDialog() {
  confirmVisible.value = false;
  confirmDialog.value.action?.();
}

/** 当前有效内容：暂存草稿优先，其次磁盘已知内容 */
function stagedContent(path: string): string | undefined {
  return pendingDrafts.value.get(path) ?? props.files[path];
}

/** 暂存图修改；改回原样（与磁盘一致）时撤销该文件的暂存 */
function stageDraft(path: string, next: string) {
  const map = new Map(pendingDrafts.value);
  if (next === props.files[path]) {
    map.delete(path);
    newDraftPaths.delete(path);
  } else {
    map.set(path, next);
    if (!(path in props.files)) newDraftPaths.add(path);
  }
  pendingDrafts.value = map;
}

/** 保存批量写回中（防止重复提交；热更新回推后复位） */
const graphSaving = ref(false);

/** 💾 保存：全部暂存修改（内容 + 删除）逐文件写回；写盘失败（如 409 冲突）的文件保留暂存，便于重试或放弃 */
async function saveGraphEdits() {
  if (!graphDirty.value || graphSaving.value) return;
  graphSaving.value = true;
  const failed: string[] = [];
  const failedDeletes: string[] = [];
  for (const [path, content] of pendingDrafts.value) {
    // 逐个 await：结果顺序与暂存一一对应；失败的保留暂存并 toast 提示
    const res = await requestSave(path, content, props.files[path]);
    if (!res.ok) {
      failed.push(path);
      notifyWriteFailure('保存', path, res);
    }
  }
  for (const path of pendingDeletes.value) {
    const res = await requestDelete(path, props.files[path]);
    if (!res.ok) {
      failedDeletes.push(path);
      notifyWriteFailure('删除', path, res);
    }
  }
  if (failed.length > 0 || failedDeletes.length > 0) {
    const drafts = new Map(pendingDrafts.value);
    for (const path of drafts.keys()) {
      if (!failed.includes(path)) {
        drafts.delete(path);
        newDraftPaths.delete(path);
      }
    }
    pendingDrafts.value = drafts;
    pendingDeletes.value = new Set([...pendingDeletes.value].filter((p) => failedDeletes.includes(p)));
  } else {
    // 全部写盘成功：清空暂存并复位按钮（服务端热更新随后会推送
    // 最新文件映射；即使推送丢失/被修剪，也不让按钮卡灰）；
    // 保存是状态基线，撤销/重做栈一并清空（避免撤销回已落盘的旧暂存）
    pendingDrafts.value = new Map();
    pendingDeletes.value = new Set();
    newDraftPaths.clear();
    undoStack.value = [];
    redoStack.value = [];
    notify('图修改已保存', 'success', 2500);
  }
  graphSaving.value = false;
}

/** ↩ 放弃更改：丢弃全部暂存与删除标记（含拖框的位置覆盖），退出编辑模式 */
function discardGraphEdits() {
  if (!graphDirty.value) return;
  const stagedIds = new Set(
    [...pendingDrafts.value.keys()]
      .map((p) => graph.value.boxes.find((b) => b.docPath === p)?.id)
      .filter((id): id is string => Boolean(id)),
  );
  pendingDrafts.value = new Map();
  pendingDeletes.value = new Set();
  if (relayouted.value) {
    const next = new Map(relayouted.value);
    stagedIds.forEach((id) => next.delete(id));
    relayouted.value = next.size > 0 ? next : null;
  }
  selectedEdgeId.value = null;
  editTool.value = 'select';
  newDraftPaths.clear();
  undoStack.value = [];
  redoStack.value = [];
  graphEditMode.value = false;
}

/** 进入/退出编辑模式；有暂存修改时只能经保存或放弃退出 */
function toggleGraphEdit() {
  if (graphEditMode.value) {
    if (graphDirty.value) return;
    selectedEdgeId.value = null;
    editTool.value = 'select';
    undoStack.value = [];
    redoStack.value = [];
    graphEditMode.value = false;
  } else {
    graphEditMode.value = true;
  }
}

/** 舞台元素与坐标换算（屏幕 px → 画布坐标，按当前缩放折算） */
const stageEl = ref<HTMLElement | null>(null);

function toStageCoords(clientX: number, clientY: number) {
  const el = stageEl.value;
  if (!el) return { x: 0, y: 0, scale: 1 };
  const rect = el.getBoundingClientRect();
  const scale = rect.width / stage.value.w || 1;
  return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale, scale };
}

/** 框拖拽状态；moved 之前视为点击（保持原有的打开文档行为）。scale 在按下时缓存，避免逐帧强制布局 */
const dragBox = ref<{
  id: string;
  path: string;
  startClientX: number;
  startClientY: number;
  lastClientX: number;
  lastClientY: number;
  scale: number;
  baseX: number;
  baseY: number;
  moved: boolean;
  raf: number;
  /** 边缘自动平移：画布滚动容器与舞台坐标系的累计平移量 */
  scroller: HTMLElement | null;
  panX: number;
  panY: number;
  /** 拖拽开始前的编辑快照（松手有改动时提交为撤销点） */
  before: EditSnapshot;
} | null>(null);

/** 向上找到画布的可滚动容器（自动平移的滚动对象；不依赖 ui-frame 内部结构） */
function findScroller(el: HTMLElement | null): HTMLElement | null {
  let cur = el?.parentElement ?? null;
  while (cur) {
    const style = getComputedStyle(cur);
    if (/(auto|scroll)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`)) return cur;
    cur = cur.parentElement;
  }
  return null;
}

/**
 * 拖拽边缘自动平移：指针贴近滚动容器边缘（40px 内）时按距离梯度滚动，
 * 返回本次滚动折算的舞台坐标位移（调用方累加进拖拽基准）。
 */
function autoPanStep(clientX: number, clientY: number, scroller: HTMLElement | null, scale: number): { px: number; py: number } {
  if (!scroller) return { px: 0, py: 0 };
  const EDGE = 40;
  const MAX = 14;
  const rect = scroller.getBoundingClientRect();
  const ramp = (dist: number) => Math.max(0, Math.min(1, (EDGE - dist) / EDGE));
  let sx = 0;
  let sy = 0;
  if (clientX < rect.left + EDGE) sx = -MAX * ramp(clientX - rect.left);
  else if (clientX > rect.right - EDGE) sx = MAX * ramp(rect.right - clientX);
  if (clientY < rect.top + EDGE) sy = -MAX * ramp(clientY - rect.top);
  else if (clientY > rect.bottom - EDGE) sy = MAX * ramp(rect.bottom - clientY);
  if (sx || sy) {
    scroller.scrollLeft += sx;
    scroller.scrollTop += sy;
  }
  return { px: sx / scale, py: sy / scale };
}

/** 拖拽中的对齐参考线（吸附辅助） */
interface AlignGuide {
  axis: 'x' | 'y';
  pos: number;
  start: number;
  end: number;
}
const activeGuides = ref<AlignGuide[]>([]);

/** 参与吸附的矩形形状（框或分组区域） */
interface SnapRectShape {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 单轴上的特征线：起点 / 中点 / 终点 */
type AxisLineKey = 'start' | 'center' | 'end';

/** 全部六条特征线（移动吸附：框拖拽、整组移动） */
const ALL_LINES: { x: AxisLineKey[]; y: AxisLineKey[] } = {
  x: ['start', 'center', 'end'],
  y: ['start', 'center', 'end'],
};

/** 仅右 / 下边缘（尺寸调整吸附：组区域角柄） */
const EDGE_LINES: { x: AxisLineKey[]; y: AxisLineKey[] } = { x: ['end'], y: ['end'] };

/** 矩形在单轴上的三条特征线位置 */
function axisLines(rect: SnapRectShape, axis: 'x' | 'y'): Record<AxisLineKey, number> {
  return axis === 'x'
    ? { start: rect.x, center: rect.x + rect.w / 2, end: rect.x + rect.w }
    : { start: rect.y, center: rect.y + rect.h / 2, end: rect.y + rect.h };
}

/**
 * 吸附位移量：moving 的参与特征线（lines）与其他矩形的全部特征线比较，
 * 阈值内取最近线的位移；某轴无候选时该轴缺省。阈值按缩放折算（屏幕 8px，限幅 4–12 舞台 px）。
 */
function snapDelta(
  moving: SnapRectShape,
  others: ReadonlyArray<SnapRectShape>,
  scale: number,
  lines: { x: AxisLineKey[]; y: AxisLineKey[] },
): { dx?: number; dy?: number } {
  const T = Math.min(Math.max(8 / scale, 4), 12);
  const result: { dx?: number; dy?: number } = {};
  for (const axis of ['x', 'y'] as const) {
    const all = axisLines(moving, axis);
    const mine = lines[axis].map((key) => all[key]);
    let best: number | null = null;
    for (const o of others) {
      for (const line of Object.values(axisLines(o, axis))) {
        for (const m of mine) {
          const delta = line - m;
          if (Math.abs(delta) <= T && (best === null || Math.abs(delta) < Math.abs(best))) {
            best = delta;
          }
        }
      }
    }
    if (best !== null) result[axis === 'x' ? 'dx' : 'dy'] = best;
  }
  return result;
}

/**
 * 对齐参考线：finalRect（吸附后的最终矩形）的参与特征线与其他矩形重合时生成；
 * 一条线可对到多个矩形，按位置去重并合并跨度。
 */
function collectGuides(
  finalRect: SnapRectShape,
  others: ReadonlyArray<SnapRectShape>,
  lines: { x: AxisLineKey[]; y: AxisLineKey[] },
): AlignGuide[] {
  const guides: AlignGuide[] = [];
  const seen = new Set<string>();
  for (const axis of ['x', 'y'] as const) {
    const all = axisLines(finalRect, axis);
    const mine = lines[axis].map((key) => all[key]);
    for (const o of others) {
      for (const line of Object.values(axisLines(o, axis))) {
        if (!mine.some((m) => Math.abs(m - line) < 0.5)) continue;
        const key = `${axis}${line}`;
        // 参考线跨度取两者在另一轴上的并集
        const start = axis === 'x' ? Math.min(finalRect.y, o.y) : Math.min(finalRect.x, o.x);
        const end =
          axis === 'x'
            ? Math.max(finalRect.y + finalRect.h, o.y + o.h)
            : Math.max(finalRect.x + finalRect.w, o.x + o.w);
        const prev = seen.has(key) ? guides.find((g) => g.axis === axis && g.pos === line) : undefined;
        if (prev) {
          prev.start = Math.min(prev.start, start);
          prev.end = Math.max(prev.end, end);
        } else {
          seen.add(key);
          guides.push({ axis, pos: line, start, end });
        }
      }
    }
  }
  return guides;
}

/** 框拖拽吸附：候选位置与其他框的六条特征线比较，返回吸附后坐标与应显示的参考线；坐标钳制不为负（防止框被拖出画布左上边界后丢失） */
function snapPosition(id: string, rawX: number, rawY: number, scale: number) {
  const me = layoutBoxes.value.find((b) => b.id === id);
  if (!me) return { x: Math.max(0, Math.round(rawX)), y: Math.max(0, Math.round(rawY)), guides: [] as AlignGuide[] };
  const others = layoutBoxes.value.filter((b) => b.id !== id);
  const snap = snapDelta({ x: rawX, y: rawY, w: me.w, h: me.h }, others, scale, ALL_LINES);
  const x = Math.max(0, Math.round(rawX + (snap.dx ?? 0)));
  const y = Math.max(0, Math.round(rawY + (snap.dy ?? 0)));
  const guides =
    snap.dx !== undefined || snap.dy !== undefined
      ? collectGuides({ x, y, w: me.w, h: me.h }, others, ALL_LINES)
      : [];
  return { x, y, guides };
}

let suppressClick = false;

function onBoxPointerdown(e: PointerEvent, box: DocBox) {
  if (!graphEditMode.value) return;
  if (e.button !== 0) return;
  if ((e.target as HTMLElement).closest('button')) return; // 编辑/连线按钮不触发拖拽
  // 工具分流：连线工具下整框即连线起点；节点工具下框不响应（点空白才创建）
  if (editTool.value === 'link') {
    startLinkDraft(e, box);
    return;
  }
  if (editTool.value === 'node') return;
  dragBox.value = {
    id: box.id,
    path: box.docPath,
    startClientX: e.clientX,
    startClientY: e.clientY,
    lastClientX: e.clientX,
    lastClientY: e.clientY,
    scale: toStageCoords(e.clientX, e.clientY).scale,
    baseX: box.x,
    baseY: box.y,
    moved: false,
    raf: 0,
    scroller: findScroller(stageEl.value),
    panX: 0,
    panY: 0,
    before: takeSnapshot(),
  };
  window.addEventListener('pointermove', onBoxDragMove);
  window.addEventListener('pointerup', onBoxDragEnd);
  window.addEventListener('pointercancel', onBoxDragEnd);
  hovered.value = null;
}

/** 指针移动只记录最新坐标，位置应用收敛到每帧一次（跟手的关键） */
function onBoxDragMove(e: PointerEvent) {
  const d = dragBox.value;
  if (!d) return;
  d.lastClientX = e.clientX;
  d.lastClientY = e.clientY;
  if (!d.raf) d.raf = requestAnimationFrame(applyBoxDrag);
}

function applyBoxDrag() {
  const d = dragBox.value;
  if (!d) return;
  d.raf = 0;
  const step = autoPanStep(d.lastClientX, d.lastClientY, d.scroller, d.scale);
  d.panX += step.px;
  d.panY += step.py;
  const dx = (d.lastClientX - d.startClientX) / d.scale + d.panX;
  const dy = (d.lastClientY - d.startClientY) / d.scale + d.panY;
  if (!d.moved && Math.hypot(dx, dy) < 3) return;
  d.moved = true;
  const snapped = snapPosition(d.id, d.baseX + dx, d.baseY + dy, d.scale);
  setPositionOverride(d.id, { x: snapped.x, y: snapped.y });
  activeGuides.value = snapped.guides;
}

function endBoxDrag() {
  const d = dragBox.value;
  dragBox.value = null;
  activeGuides.value = [];
  if (!d) return;
  if (d.raf) cancelAnimationFrame(d.raf);
  if (!d.moved) return;
  suppressClick = true; // 拖拽松手后紧随的 click 不打开文档
  const pos = relayouted.value?.get(d.id);
  if (!pos) return;
  const content = stagedContent(d.path);
  if (content !== undefined) {
    stageDraft(d.path, writeFramePosition(content, pos));
    commitUndo(d.before);
  }
}

function onBoxDragEnd() {
  window.removeEventListener('pointermove', onBoxDragMove);
  window.removeEventListener('pointerup', onBoxDragEnd);
  window.removeEventListener('pointercancel', onBoxDragEnd);
  endBoxDrag();
}

/** 框点击：拖拽结束后抑制一次；图编辑模式下单击不打开（避免拖框误触）；
 *  触屏无 hover：含分块的框第一次点按展开分块面板，再次点按才打开 */
const { isTouch } = useTouchDevice();
const touchPanelId = ref<string | null>(null);

function onBoxClick(box: DocBox) {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  if (graphEditMode.value) return;
  if (isTouch.value && box.blocks.length > 0 && touchPanelId.value !== box.id) {
    touchPanelId.value = box.id;
    return;
  }
  touchPanelId.value = null;
  open(box.docPath);
}

/** 连线草稿：从框四边中点的连接点拖出，松手落在目标框上即创建；raf 节流同框拖拽 */
const linkDraft = ref<{
  fromId: string;
  fromSide: LinkSide;
  /** 光标当前悬停的框（不一定是合法目标，合法性在渲染时判定） */
  targetId: string | null;
  x: number;
  y: number;
  lastClientX: number;
  lastClientY: number;
  raf: number;
  /** 边缘自动平移的滚动容器（端点坐标每帧按 rect 重算，无需累计平移量） */
  scroller: HTMLElement | null;
  /** 拖出前的编辑快照（创建成功时提交为撤销点） */
  before: EditSnapshot;
} | null>(null);

/** 新建连线的入场动画标记（描边绘制动画播完后清除） */
const justLinkedId = ref<string | null>(null);
let justLinkedTimer: ReturnType<typeof setTimeout> | null = null;

/** 按方位取点相对框心最近的边（计入框的宽高比，避免宽框误判上下边） */
function nearestSide(box: Pick<DocBox, 'x' | 'y' | 'w' | 'h'>, pt: { x: number; y: number }): LinkSide {
  const dx = pt.x - (box.x + box.w / 2);
  const dy = pt.y - (box.y + box.h / 2);
  const horizontal = Math.abs(dx) * box.h > Math.abs(dy) * box.w;
  return horizontal ? (dx >= 0 ? 'right' : 'left') : dy >= 0 ? 'bottom' : 'top';
}

/** 拖出连线草稿（连接点或连线工具下整框共用；side 缺省时按按下点方位取最近的边） */
function startLinkDraft(e: PointerEvent, box: DocBox, side?: LinkSide) {
  if (!graphEditMode.value) return;
  if (e.button !== 0) return;
  e.preventDefault();
  const pt = toStageCoords(e.clientX, e.clientY);
  linkDraft.value = {
    fromId: box.id,
    fromSide: side ?? nearestSide(box, pt),
    targetId: null,
    x: pt.x,
    y: pt.y,
    lastClientX: e.clientX,
    lastClientY: e.clientY,
    raf: 0,
    scroller: findScroller(stageEl.value),
    before: takeSnapshot(),
  };
  window.addEventListener('pointermove', onLinkMove);
  window.addEventListener('pointerup', onLinkEnd);
  window.addEventListener('pointercancel', onLinkCancel);
  hovered.value = null;
}

function onLinkStart(e: PointerEvent, box: DocBox, side?: LinkSide) {
  startLinkDraft(e, box, side);
}

function onLinkMove(e: PointerEvent) {
  const d = linkDraft.value;
  if (!d) return;
  d.lastClientX = e.clientX;
  d.lastClientY = e.clientY;
  if (!d.raf) d.raf = requestAnimationFrame(applyLinkMove);
}

function applyLinkMove() {
  const d = linkDraft.value;
  if (!d) return;
  d.raf = 0;
  autoPanStep(d.lastClientX, d.lastClientY, d.scroller, 1);
  const pt = toStageCoords(d.lastClientX, d.lastClientY);
  const hit = layoutBoxes.value.find(
    (b) => pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h,
  );
  linkDraft.value = { ...d, x: pt.x, y: pt.y, targetId: hit?.id ?? null };
}

function removeLinkListeners() {
  window.removeEventListener('pointermove', onLinkMove);
  window.removeEventListener('pointerup', onLinkEnd);
  window.removeEventListener('pointercancel', onLinkCancel);
}

function onLinkCancel() {
  removeLinkListeners();
  const d = linkDraft.value;
  if (d?.raf) cancelAnimationFrame(d.raf);
  linkDraft.value = null;
}

function onLinkEnd(e: PointerEvent) {
  removeLinkListeners();
  const d = linkDraft.value;
  if (d?.raf) cancelAnimationFrame(d.raf);
  linkDraft.value = null;
  if (!d) return;
  const pt = toStageCoords(e.clientX, e.clientY);
  const target = layoutBoxes.value.find(
    (b) => pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h,
  );
  if (!target || target.id === d.fromId) return;
  if (graph.value.relations.some((r) => r.from === d.fromId && r.to === target.id)) return;
  // 目标边取落点所在方位的最近边，用户拖到哪条边就连哪条边
  addLink(d.fromId, target.id, d.fromSide, nearestSide(target, pt), d.before);
}

function addLink(fromId: string, toId: string, fromSide?: LinkSide, toSide?: LinkSide, before?: EditSnapshot) {
  const from = graph.value.boxes.find((b) => b.id === fromId);
  if (!from) return;
  const content = stagedContent(from.docPath);
  if (content === undefined) return;
  const entry = buildLinkEntry({ ref: toId, fromSide, toSide });
  stageDraft(from.docPath, writeFrameLinks(content, [...readFrameLinks(content), entry]));
  if (before) commitUndo(before);
  // 新连线播一次描边绘制入场动画
  justLinkedId.value = `${fromId}->${toId}`;
  if (justLinkedTimer) clearTimeout(justLinkedTimer);
  justLinkedTimer = setTimeout(() => {
    justLinkedId.value = null;
    justLinkedTimer = null;
  }, 700);
}

/** 草稿连线的预览路径：复用 edgeGeometry，从选定边出发；悬停到目标框时预览吸附其最近边 */
const linkDraftPath = computed(() => {
  const d = linkDraft.value;
  if (!d) return null;
  const from = layoutBoxes.value.find((b) => b.id === d.fromId);
  if (!from) return null;
  const target = d.targetId
    ? layoutBoxes.value.find((b) => b.id === d.targetId)
    : undefined;
  if (target && target.id !== d.fromId) {
    const toSide = nearestSide(target, { x: d.x, y: d.y });
    return edgeGeometry(from, target, d.fromSide, toSide).d;
  }
  return edgeGeometry(from, { x: d.x, y: d.y, w: 0, h: 0 }, d.fromSide).d;
});

/** 连线草稿期间框的目标态：valid（可落点）/ invalid（自身或已存在同向连线） */
function linkTargetState(box: DocBox): 'valid' | 'invalid' | null {
  const d = linkDraft.value;
  if (!d || d.targetId !== box.id) return null;
  if (box.id === d.fromId) return 'invalid';
  if (graph.value.relations.some((r) => r.from === d.fromId && r.to === box.id)) return 'invalid';
  return 'valid';
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown);
  window.addEventListener('popstate', onPopstate);
  // 恢复上次未保存的暂存（刷新/关页后，基准校验通过的条目）；有恢复则进入编辑模式
  const restored = restoreDrafts();
  if (restored > 0) {
    graphEditMode.value = true;
    nextTick(() => notify(`已恢复 ${restored} 项上次未保存的图修改，可「💾 保存」或「↩ 放弃更改」`, 'info', 6000));
  }
  // 首屏自动适配全图（hash 直达正文时跳过，「🗺 返回图」时会再 fit）
  if (!currentPath.value) {
    nextTick(() => requestAnimationFrame(() => canvasRef.value?.fit?.()));
  }
});

onBeforeUnmount(() => {
  if (justLinkedTimer) clearTimeout(justLinkedTimer);
  window.removeEventListener('keydown', onGlobalKeydown);
  window.removeEventListener('popstate', onPopstate);
});

/* ============ 节点工具：点空白创建新文档框（新文件暂存草稿） ============ */

/** 节点工具的按下点（松手位移 < 3px 才算点击，避免与画布平移冲突） */
let nodeTap: { clientX: number; clientY: number } | null = null;

function onStagePointerdown(e: PointerEvent) {
  if (!graphEditMode.value || editTool.value !== 'node') return;
  if (e.button !== 0) return;
  if (e.target !== stageEl.value) return; // 只响应空白（框/连线/组区域均不命中 stage 本体）
  nodeTap = { clientX: e.clientX, clientY: e.clientY };
  window.addEventListener('pointerup', onStagePointerup);
}

function onStagePointerup(e: PointerEvent) {
  window.removeEventListener('pointerup', onStagePointerup);
  const tap = nodeTap;
  nodeTap = null;
  if (!tap) return;
  if (Math.hypot(e.clientX - tap.clientX, e.clientY - tap.clientY) >= 3) return; // 视为平移
  const pt = toStageCoords(e.clientX, e.clientY);
  createNodeAt(pt.x, pt.y);
}

/** 在画布坐标 (x, y) 处创建新文档框：暂存 untitled-N.md 新文件草稿（点击点居中取整，钳制不出左上边界） */
function createNodeAt(x: number, y: number) {
  const px = Math.max(0, Math.round(x - BOX_DEFAULT_W / 2));
  const py = Math.max(0, Math.round(y - BOX_DEFAULT_H / 2));
  const before = takeSnapshot();
  // 编号取磁盘文件与暂存新文件中未占用的最小 N
  const known = new Set([...Object.keys(props.files), ...pendingDrafts.value.keys()]);
  let n = 1;
  while (known.has(`untitled-${n}.md`)) n++;
  const path = `untitled-${n}.md`;
  const title = `未命名文档 ${n}`;
  stageDraft(path, `---\ntitle: "${title}"\nx: ${px}\ny: ${py}\n---\n\n# ${title}\n`);
  commitUndo(before);
}

/** 连线选中与删除（仅图编辑模式） */
const selectedEdgeId = ref<string | null>(null);
const selectedEdge = computed(
  () => relationEdges.value.find((e) => e.id === selectedEdgeId.value) ?? null,
);

function onEdgeClick(edge: RelationEdge) {
  if (!graphEditMode.value) return;
  selectedEdgeId.value = edge.id;
}

/** 连线标签编辑（仅图编辑模式）：双击连线，在中点弹出内联输入框 */
const labelEdit = ref<{ edgeId: string; value: string } | null>(null);
const labelInputEl = ref<HTMLInputElement | null>(null);

function onEdgeDblClick(edge: RelationEdge) {
  if (!graphEditMode.value) return;
  selectedEdgeId.value = edge.id;
  labelEdit.value = { edgeId: edge.id, value: edge.label ?? '' };
  nextTick(() => {
    labelInputEl.value?.focus();
    labelInputEl.value?.select();
  });
}

/** 确认标签编辑：重建该 link 条目（保留引用原文与连接边；清空即移除标签段）并暂存 */
function commitLabelEdit() {
  const edit = labelEdit.value;
  labelEdit.value = null;
  if (!edit) return;
  const edge = relationEdges.value.find((e) => e.id === edit.edgeId);
  if (!edge) return;
  const value = edit.value.trim();
  if (value === (edge.label ?? '')) return; // 未修改，不产生暂存
  const from = graph.value.boxes.find((b) => b.id === edge.fromId);
  if (!from) return;
  const content = stagedContent(from.docPath);
  if (content === undefined) return;
  const before = takeSnapshot();
  const links = readFrameLinks(content).map((entry) => {
    const parsed = parseLinkEntry(entry);
    if (resolveDocId(parsed.ref) !== edge.toId) return entry;
    return buildLinkEntry({
      ref: parsed.ref,
      label: value || undefined,
      fromSide: parsed.fromSide,
      toSide: parsed.toSide,
    });
  });
  stageDraft(from.docPath, writeFrameLinks(content, links));
  commitUndo(before);
}

function cancelLabelEdit() {
  labelEdit.value = null;
}

/** 连接边拖拽：拖动选中连线的端点手柄，按光标相对框心的方位实时预览目标边 */
const sideDrag = ref<{
  edgeId: string;
  which: 'from' | 'to';
  side: LinkSide;
  lastClientX: number;
  lastClientY: number;
  raf: number;
  before: EditSnapshot;
} | null>(null);

/** 光标方位 → 边：按框宽高归一化后的主导轴判定（宽框的左右边判定域更窄） */
function sideFromPoint(box: DocBox, x: number, y: number): LinkSide {
  const dx = x - (box.x + box.w / 2);
  const dy = y - (box.y + box.h / 2);
  const rx = Math.abs(dx) / (box.w / 2);
  const ry = Math.abs(dy) / (box.h / 2);
  return rx >= ry ? (dx >= 0 ? 'right' : 'left') : dy >= 0 ? 'bottom' : 'top';
}

function onSideHandleDown(e: PointerEvent, edge: RelationEdge, which: 'from' | 'to') {
  if (e.button !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  const from = layoutBoxes.value.find((b) => b.id === edge.fromId)!;
  const to = layoutBoxes.value.find((b) => b.id === edge.toId)!;
  const auto = autoSides(from, to);
  sideDrag.value = {
    edgeId: edge.id,
    which,
    side: (which === 'from' ? edge.fromSide : edge.toSide) ?? (which === 'from' ? auto.fs : auto.ts),
    lastClientX: e.clientX,
    lastClientY: e.clientY,
    raf: 0,
    before: takeSnapshot(),
  };
  window.addEventListener('pointermove', onSideDragMove);
  window.addEventListener('pointerup', onSideDragEnd);
  window.addEventListener('pointercancel', onSideDragCancel);
  hovered.value = null;
}

function onSideDragMove(e: PointerEvent) {
  const d = sideDrag.value;
  if (!d) return;
  d.lastClientX = e.clientX;
  d.lastClientY = e.clientY;
  if (!d.raf) d.raf = requestAnimationFrame(applySideDrag);
}

function applySideDrag() {
  const d = sideDrag.value;
  if (!d) return;
  d.raf = 0;
  const edge = relationEdges.value.find((e) => e.id === d.edgeId);
  if (!edge) return;
  const owner = layoutBoxes.value.find((b) => b.id === (d.which === 'from' ? edge.fromId : edge.toId));
  if (!owner) return;
  const pt = toStageCoords(d.lastClientX, d.lastClientY);
  const side = sideFromPoint(owner, pt.x, pt.y);
  if (side !== d.side) sideDrag.value = { ...d, side };
}

function removeSideDragListeners() {
  window.removeEventListener('pointermove', onSideDragMove);
  window.removeEventListener('pointerup', onSideDragEnd);
  window.removeEventListener('pointercancel', onSideDragCancel);
}

function onSideDragCancel() {
  removeSideDragListeners();
  const d = sideDrag.value;
  if (d?.raf) cancelAnimationFrame(d.raf);
  sideDrag.value = null;
}

function onSideDragEnd() {
  removeSideDragListeners();
  const d = sideDrag.value;
  if (d?.raf) cancelAnimationFrame(d.raf);
  sideDrag.value = null;
  if (!d) return;
  const edge = relationEdges.value.find((e) => e.id === d.edgeId);
  if (!edge) return;
  const fromSide = d.which === 'from' ? d.side : edge.fromSide;
  const toSide = d.which === 'to' ? d.side : edge.toSide;
  // 与现状一致时不写文件（纯点击手柄不视为修改）
  if (fromSide === edge.fromSide && toSide === edge.toSide) return;
  persistEdgeSides(edge, fromSide, toSide);
  commitUndo(d.before);
}

/** 暂存选中连线的连接边（只给一端时另一端写 `_`，保持自动） */
function persistEdgeSides(edge: RelationEdge, fromSide: LinkSide | undefined, toSide: LinkSide | undefined) {
  const from = graph.value.boxes.find((b) => b.id === edge.fromId);
  if (!from) return;
  const content = stagedContent(from.docPath);
  if (content === undefined) return;

  const links = readFrameLinks(content).map((entry) => {
    const parsed = parseLinkEntry(entry);
    if (resolveDocId(parsed.ref) !== edge.toId) return entry;
    return buildLinkEntry({ ref: parsed.ref, label: parsed.label, fromSide, toSide });
  });
  stageDraft(from.docPath, writeFrameLinks(content, links));
}

/** 与 graph.ts 一致的引用解析：优先 id，其次相对路径（.md 可省略） */
function resolveDocId(raw: string): string | undefined {
  const ref = raw.trim();
  const asPath = ref.endsWith('.md') ? ref : ref + '.md';
  const boxes = graph.value.boxes;
  return (
    boxes.find((b) => b.id === ref) ??
    boxes.find((b) => b.docPath === ref) ??
    boxes.find((b) => b.docPath === asPath)
  )?.id;
}

function removeSelectedEdge() {
  const edge = selectedEdge.value;
  if (!edge) return;
  // 从源文档（from）的 link 参数中过滤掉指向该目标的条目。
  const from = graph.value.boxes.find((b) => b.id === edge.fromId);
  if (!from) return;
  const content = stagedContent(from.docPath);
  if (content === undefined) return;
  const before = takeSnapshot();
  const links = readFrameLinks(content).filter(
    (entry) => resolveDocId(parseLinkEntry(entry).ref) !== edge.toId,
  );
  stageDraft(from.docPath, writeFrameLinks(content, links));
  commitUndo(before);
  selectedEdgeId.value = null;
}

/* ============ 画布编辑：分组区域（整组移动 / 区域尺寸调整） ============ */

/**
 * 组拖拽状态：拖动组名标签移动整组——成员坐标 += delta（逐框位置覆盖实时预览），
 * 显式几何组的区域同步平移；松手后逐成员暂存坐标、holder 暂存平移后的 group 条目。
 */
const groupDrag = ref<{
  name: string;
  startClientX: number;
  startClientY: number;
  lastClientX: number;
  lastClientY: number;
  scale: number;
  basePositions: Map<string, { x: number; y: number }>;
  baseRegion: { x: number; y: number; w: number; h: number };
  dx: number;
  dy: number;
  moved: boolean;
  raf: number;
  scroller: HTMLElement | null;
  panX: number;
  panY: number;
  before: EditSnapshot;
} | null>(null);

/** 组尺寸拖拽状态：拖右下角手柄调整区域长宽（右/下边缘可吸附；下限 = 成员包围盒余量，成员不外溢）；松手后区域转为显式几何暂存到 holder */
const groupResize = ref<{
  name: string;
  startClientX: number;
  startClientY: number;
  lastClientX: number;
  lastClientY: number;
  scale: number;
  baseRegion: { x: number; y: number; w: number; h: number };
  /** 成员框 id（吸附目标中排除——成员在区域内，对其吸附无意义） */
  memberIds: Set<string>;
  minW: number;
  minH: number;
  curW: number;
  curH: number;
  moved: boolean;
  raf: number;
  before: EditSnapshot;
} | null>(null);

function onGroupLabelDown(e: PointerEvent, group: DocGroup) {
  if (!graphEditMode.value) return;
  if (e.button !== 0) return;
  e.preventDefault();
  const region = groupRegions.value.find((g) => g.name === group.name);
  if (!region) return;
  const basePositions = new Map<string, { x: number; y: number }>();
  for (const id of group.members) {
    const box = layoutBoxes.value.find((b) => b.id === id);
    if (box) basePositions.set(id, { x: box.x, y: box.y });
  }
  groupDrag.value = {
    name: group.name,
    startClientX: e.clientX,
    startClientY: e.clientY,
    lastClientX: e.clientX,
    lastClientY: e.clientY,
    scale: toStageCoords(e.clientX, e.clientY).scale,
    basePositions,
    baseRegion: { x: region.x, y: region.y, w: region.w, h: region.h },
    dx: 0,
    dy: 0,
    moved: false,
    raf: 0,
    scroller: findScroller(stageEl.value),
    panX: 0,
    panY: 0,
    before: takeSnapshot(),
  };
  window.addEventListener('pointermove', onGroupDragMove);
  window.addEventListener('pointerup', onGroupDragEnd);
  window.addEventListener('pointercancel', onGroupDragEnd);
  hovered.value = null;
}

function onGroupDragMove(e: PointerEvent) {
  const d = groupDrag.value;
  if (!d) return;
  d.lastClientX = e.clientX;
  d.lastClientY = e.clientY;
  if (!d.raf) d.raf = requestAnimationFrame(applyGroupDrag);
}

/**
 * 逐成员预览：区域六条特征线与组外框、其他组区域吸附对齐并显示参考线；
 * 位移取整后再加吸附量（吸附值与写回值一致，热更新回推后位置覆盖可按值修剪）。
 */
function applyGroupDrag() {
  const d = groupDrag.value;
  if (!d) return;
  d.raf = 0;
  const step = autoPanStep(d.lastClientX, d.lastClientY, d.scroller, d.scale);
  d.panX += step.px;
  d.panY += step.py;
  const rawDx = Math.round((d.lastClientX - d.startClientX) / d.scale + d.panX);
  const rawDy = Math.round((d.lastClientY - d.startClientY) / d.scale + d.panY);
  if (!d.moved && Math.hypot(rawDx, rawDy) < 3) return;
  const others: SnapRectShape[] = [
    ...layoutBoxes.value.filter((b) => !d.basePositions.has(b.id)),
    ...groupRegions.value.filter((g) => g.name !== d.name),
  ];
  const snap = snapDelta(
    { x: d.baseRegion.x + rawDx, y: d.baseRegion.y + rawDy, w: d.baseRegion.w, h: d.baseRegion.h },
    others,
    d.scale,
    ALL_LINES,
  );
  // 钳制：成员与区域均不可移出左上边界（负坐标写回后无法找回）
  const minBaseX = Math.min(d.baseRegion.x, ...[...d.basePositions.values()].map((p) => p.x));
  const minBaseY = Math.min(d.baseRegion.y, ...[...d.basePositions.values()].map((p) => p.y));
  const dx = Math.max(rawDx + (snap.dx ?? 0), -minBaseX);
  const dy = Math.max(rawDy + (snap.dy ?? 0), -minBaseY);
  groupDrag.value = { ...d, dx, dy, moved: true };
  for (const [id, base] of d.basePositions) {
    setPositionOverride(id, { x: base.x + dx, y: base.y + dy });
  }
  activeGuides.value =
    snap.dx !== undefined || snap.dy !== undefined
      ? collectGuides(
          { x: d.baseRegion.x + dx, y: d.baseRegion.y + dy, w: d.baseRegion.w, h: d.baseRegion.h },
          others,
          ALL_LINES,
        )
      : [];
}

function onGroupDragEnd() {
  window.removeEventListener('pointermove', onGroupDragMove);
  window.removeEventListener('pointerup', onGroupDragEnd);
  window.removeEventListener('pointercancel', onGroupDragEnd);
  const d = groupDrag.value;
  groupDrag.value = null;
  activeGuides.value = [];
  if (!d) return;
  if (d.raf) cancelAnimationFrame(d.raf);
  if (!d.moved) return;
  const group = graph.value.groups.find((g) => g.name === d.name);
  if (!group) return;
  // 成员坐标 += delta，逐成员暂存（holder 若也是成员，先写坐标再叠加 group 条目）
  for (const id of group.members) {
    const box = graph.value.boxes.find((b) => b.id === id);
    const base = d.basePositions.get(id);
    if (!box || !base) continue;
    const content = stagedContent(box.docPath);
    if (content === undefined) continue;
    stageDraft(box.docPath, writeFramePosition(content, { x: base.x + d.dx, y: base.y + d.dy }));
  }
  // 显式几何的组：holder 的 group 条目同步平移（区域不脱离成员）
  if (group.explicit) {
    const content = stagedContent(group.holder);
    if (content !== undefined) {
      stageDraft(
        group.holder,
        writeFrameGroup(
          content,
          buildGroupEntry({
            name: group.name,
            x: d.baseRegion.x + d.dx,
            y: d.baseRegion.y + d.dy,
            w: d.baseRegion.w,
            h: d.baseRegion.h,
          }),
        ),
      );
    }
  }
  commitUndo(d.before);
}

function onGroupResizeDown(e: PointerEvent, group: DocGroup) {
  if (!graphEditMode.value) return;
  if (e.button !== 0) return;
  e.preventDefault();
  const region = groupRegions.value.find((g) => g.name === group.name);
  if (!region) return;
  const memberBoxes = group.members
    .map((id) => layoutBoxes.value.find((b) => b.id === id))
    .filter((b): b is DocBox => Boolean(b));
  const maxX = Math.max(...memberBoxes.map((b) => b.x + b.w));
  const maxY = Math.max(...memberBoxes.map((b) => b.y + b.h));
  groupResize.value = {
    name: group.name,
    startClientX: e.clientX,
    startClientY: e.clientY,
    lastClientX: e.clientX,
    lastClientY: e.clientY,
    scale: toStageCoords(e.clientX, e.clientY).scale,
    baseRegion: { x: region.x, y: region.y, w: region.w, h: region.h },
    memberIds: new Set(group.members),
    minW: Math.max(48, maxX - region.x + GROUP_PAD),
    minH: Math.max(48, maxY - region.y + GROUP_PAD),
    curW: region.w,
    curH: region.h,
    moved: false,
    raf: 0,
    before: takeSnapshot(),
  };
  window.addEventListener('pointermove', onGroupResizeMove);
  window.addEventListener('pointerup', onGroupResizeEnd);
  window.addEventListener('pointercancel', onGroupResizeEnd);
  hovered.value = null;
}

function onGroupResizeMove(e: PointerEvent) {
  const d = groupResize.value;
  if (!d) return;
  d.lastClientX = e.clientX;
  d.lastClientY = e.clientY;
  if (!d.raf) d.raf = requestAnimationFrame(applyGroupResize);
}

/** 右/下边缘与组外框、其他组区域吸附对齐并显示参考线（下限钳制在吸附之后，保证成员不外溢） */
function applyGroupResize() {
  const d = groupResize.value;
  if (!d) return;
  d.raf = 0;
  const dx = (d.lastClientX - d.startClientX) / d.scale;
  const dy = (d.lastClientY - d.startClientY) / d.scale;
  if (!d.moved && Math.hypot(dx, dy) < 3) return;
  const rawW = Math.round(d.baseRegion.w + dx);
  const rawH = Math.round(d.baseRegion.h + dy);
  const others: SnapRectShape[] = [
    ...layoutBoxes.value.filter((b) => !d.memberIds.has(b.id)),
    ...groupRegions.value.filter((g) => g.name !== d.name),
  ];
  const snap = snapDelta(
    { x: d.baseRegion.x, y: d.baseRegion.y, w: rawW, h: rawH },
    others,
    d.scale,
    EDGE_LINES,
  );
  const curW = Math.max(d.minW, Math.round(rawW + (snap.dx ?? 0)));
  const curH = Math.max(d.minH, Math.round(rawH + (snap.dy ?? 0)));
  groupResize.value = { ...d, curW, curH, moved: true };
  activeGuides.value =
    snap.dx !== undefined || snap.dy !== undefined
      ? collectGuides({ x: d.baseRegion.x, y: d.baseRegion.y, w: curW, h: curH }, others, EDGE_LINES)
      : [];
}

function onGroupResizeEnd() {
  window.removeEventListener('pointermove', onGroupResizeMove);
  window.removeEventListener('pointerup', onGroupResizeEnd);
  window.removeEventListener('pointercancel', onGroupResizeEnd);
  const d = groupResize.value;
  groupResize.value = null;
  activeGuides.value = [];
  if (!d) return;
  if (d.raf) cancelAnimationFrame(d.raf);
  if (!d.moved) return;
  const group = graph.value.groups.find((g) => g.name === d.name);
  if (!group) return;
  // 松手后区域转为显式几何（原点保持当前值），暂存到 holder 的 group 条目
  const content = stagedContent(group.holder);
  if (content === undefined) return;
  stageDraft(
    group.holder,
    writeFrameGroup(
      content,
      buildGroupEntry({
        name: group.name,
        x: d.baseRegion.x,
        y: d.baseRegion.y,
        w: d.curW,
        h: d.curH,
      }),
    ),
  );
  commitUndo(d.before);
}

/* ============ 节点删除（暂存删除标记，「💾 保存」时经删除 API 删文件） ============ */

/** 删除入口点击：已标记删除的框再次点击为撤销删除；磁盘文件需确认；新建草稿直接丢弃 */
function onDeleteBoxClick(box: DocBox) {
  if (pendingDeletes.value.has(box.docPath)) {
    const before = takeSnapshot();
    pendingDeletes.value = new Set([...pendingDeletes.value].filter((p) => p !== box.docPath));
    commitUndo(before);
    return;
  }
  const isNewDraft = newDraftPaths.has(box.docPath) && !(box.docPath in props.files);
  if (isNewDraft) {
    stageDeleteBox(box);
    return;
  }
  askConfirm(
    '删除文档',
    `「${box.title}」（${box.docPath}）将在「💾 保存」后从磁盘删除，保存前可撤销。确定标记删除？`,
    () => stageDeleteBox(box),
  );
}

/** 暂存删除：清掉该文件的内容暂存；磁盘文件加删除标记（新建草稿直接消失） */
function stageDeleteBox(box: DocBox) {
  const before = takeSnapshot();
  if (pendingDrafts.value.has(box.docPath)) {
    const drafts = new Map(pendingDrafts.value);
    drafts.delete(box.docPath);
    pendingDrafts.value = drafts;
  }
  newDraftPaths.delete(box.docPath);
  if (box.docPath in props.files) {
    pendingDeletes.value = new Set([...pendingDeletes.value, box.docPath]);
  }
  commitUndo(before);
}

/* ============ 全局键控：Esc 链（取消选中→切回选择）、撤销/重做、删除连线 ============ */

function onGlobalKeydown(e: KeyboardEvent) {
  if (currentPath.value || !graphEditMode.value) return;
  // 标签输入框编辑中：Esc/Delete/Ctrl+Z 均交给输入框自身
  if (labelEdit.value) return;
  const mod = e.ctrlKey || e.metaKey;
  if (mod && (e.key === 'z' || e.key === 'Z' || e.key === 'y')) {
    e.preventDefault();
    if (e.key === 'y' || e.shiftKey) redoEdit();
    else undoEdit();
    return;
  }
  if (e.key === 'Escape') {
    if (selectedEdgeId.value) {
      selectedEdgeId.value = null; // 先取消连线选中，再切回选择工具
      return;
    }
    if (editTool.value !== 'select') editTool.value = 'select';
    return;
  }
  if (!selectedEdgeId.value) return;
  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault();
    removeSelectedEdge();
  }
}
const currentTitle = computed(() => {
  if (!currentPath.value) return '';
  return graph.value.boxes.find((b) => b.docPath === currentPath.value)?.title ?? currentPath.value;
});

function syncHash() {
  // encodeURIComponent：浏览器会把 hash 中的非 ASCII（如中文路径）percent-encode，
  // 写入时主动编码，读取时配对 decode，避免刷新/分享链接定位失败。
  // pushState 入栈：文档间跳转可用浏览器前进/后退导航；
  // hash 与现状一致时（含 popstate 恢复后）退化为 replaceState，不产生重复历史
  const hash = currentPath.value ? `#${encodeURIComponent(currentPath.value)}` : '#';
  if (window.location.hash === hash) {
    history.replaceState(null, '', hash);
    return;
  }
  history.pushState(null, '', hash);
}

/** 浏览器前进/后退：按 hash 恢复视图（无效 hash 退回图画布） */
function onPopstate() {
  const raw = window.location.hash;
  let p: string | null = null;
  if (raw.length > 1) {
    try {
      p = decodeURIComponent(raw.slice(1));
    } catch {
      p = null;
    }
  }
  editing.value = false;
  currentPath.value = p && props.files[p] ? p : null;
}

/** 打开某个文档 */
function open(path: string) {
  if (!props.files[path]) return;
  if (currentPath.value === path) {
    editing.value = false;
    return;
  }
  editing.value = false;
  currentPath.value = path;
  emit('navigate', path);
  syncHash();
}

/**
 * 打开文档并滚动到指定分块锚点。
 * 标题 id 由 MarkdownRenderer 以 `实例前缀-slug` 生成，用后缀匹配定位；
 * 渲染是异步的（mermaid/dompurify 动态加载），多次尝试确保命中。
 */
function scrollToAnchor(anchor: string) {
  document
    .querySelector(`.pd-doc-view [data-heading-id$="-${anchor}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openBlock(path: string, anchor: string) {
  if (currentPath.value === path) {
    scrollToAnchor(anchor);
    return;
  }
  open(path);
  nextTick(() => {
    setTimeout(() => scrollToAnchor(anchor), 80);
    setTimeout(() => scrollToAnchor(anchor), 320);
  });
}

/** 返回图画布：正文编辑态有未保存修改时先确认（与图编辑模式同一原则——修改不被悄悄带走） */
function backToGraph() {
  if (editing.value && dirty.value) {
    askConfirm('丢弃未保存的修改？', '正文有未保存的修改，返回图画布将丢弃这些修改。', doBackToGraph);
    return;
  }
  doBackToGraph();
}

function doBackToGraph() {
  editing.value = false;
  currentPath.value = null;
  syncHash();
  nextTick(() => requestAnimationFrame(() => canvasRef.value?.fit?.()));
}

// 文档热更新：当前打开的文档被删除时退回图画布（文件已不在，无需确认丢弃草稿）；
// 暂存草稿逐项修剪——热更新回推内容与暂存一致（保存生效）或文件被删除时丢弃；
// 删除标记逐项修剪——文件已从磁盘消失（删除生效）的移除；
// 坐标覆盖表逐项修剪——与文件坐标一致的（如拖拽已写回的）移除，已删除框的丢弃
watch(
  () => props.files,
  (files) => {
    graphSaving.value = false;
    if (currentPath.value && !files[currentPath.value]) doBackToGraph();
    if (pendingDrafts.value.size) {
      const drafts = new Map(pendingDrafts.value);
      for (const [p, c] of drafts) {
        // 内容一致（保存生效）→ 清除；磁盘上被删除 → 清除；
        // 新建文件草稿例外：写盘前磁盘上本就不存在，不是删除信号
        if (files[p] === c) {
          drafts.delete(p);
          newDraftPaths.delete(p);
        } else if (files[p] === undefined && !newDraftPaths.has(p)) {
          drafts.delete(p);
        }
      }
      pendingDrafts.value = drafts;
    }
    if (pendingDeletes.value.size) {
      const next = new Set([...pendingDeletes.value].filter((p) => files[p] !== undefined));
      if (next.size !== pendingDeletes.value.size) pendingDeletes.value = next;
    }
    if (!relayouted.value) return;
    const boxes = graph.value.boxes;
    const next = new Map(relayouted.value);
    for (const [id, ov] of next) {
      const box = boxes.find((b) => b.id === id);
      if (!box || (box.x === ov.x && box.y === ov.y)) next.delete(id);
    }
    relayouted.value = next.size > 0 ? next : null;
  },
);

/** 编辑状态：编辑的是原始完整内容（含框架参数区），保存后由热更新回推渲染 */
const editing = ref(false);
const draft = ref('');

const dirty = computed(
  () => currentPath.value !== null && draft.value !== (props.files[currentPath.value] ?? ''),
);

function startEdit() {
  if (!currentPath.value) return;
  draft.value = props.files[currentPath.value] ?? '';
  editing.value = true;
}

/** 画布上直接编辑：打开文档并进入编辑状态 */
function openEdit(path: string) {
  open(path);
  startEdit();
}

function cancelEdit() {
  editing.value = false;
}

async function saveEdit() {
  if (!currentPath.value || !dirty.value) return;
  const res = await requestSave(currentPath.value, draft.value, props.files[currentPath.value]);
  if (!res.ok) notifyWriteFailure('保存', currentPath.value, res);
}

/** 编辑器内 Ctrl/Cmd+S 保存（MarkdownEditor 内部不拦截冒泡） */
function onEditorKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveEdit();
  }
}

/** 框的键盘可达性：浏览态 Enter / Space 打开；编辑态（选择工具）方向键微调位置（Shift ×10） */
function onBoxKeydown(e: KeyboardEvent, box: DocBox) {
  if (graphEditMode.value) {
    if (editTool.value !== 'select') return;
    const step = e.shiftKey ? 10 : 1;
    const dirs: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const d = dirs[e.key];
    if (!d) return;
    e.preventDefault();
    nudgeBox(box, d[0], d[1]);
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open(box.docPath);
  }
}

/** 方向键微调：连续微调同一框只产生一个撤销点（800ms 内合并） */
let lastNudge: { id: string; time: number } | null = null;

function nudgeBox(box: DocBox, dx: number, dy: number) {
  const x = Math.max(0, Math.round(box.x + dx));
  const y = Math.max(0, Math.round(box.y + dy));
  if (x === box.x && y === box.y) return;
  const now = Date.now();
  const before = lastNudge?.id === box.id && now - lastNudge.time < 800 ? null : takeSnapshot();
  lastNudge = { id: box.id, time: now };
  setPositionOverride(box.id, { x, y });
  const content = stagedContent(box.docPath);
  if (content !== undefined) {
    stageDraft(box.docPath, writeFramePosition(content, { x, y }));
    if (before) commitUndo(before);
  }
}

/** 正文内相对文档链接 → 相对文档根的路径与可选锚点（`./guide.md#安装` 的 fragment 不再丢弃） */
function resolveHref(fromPath: string, href: string): { path: string; anchor?: string } | null {
  if (/^(https?:|mailto:)/.test(href)) return null;
  const [withoutHash, hash] = href.split('#');
  const clean = withoutHash.trim();
  // 锚点与标题 id 的 slug 规则对齐（percent-decode 后 slugify）
  const rawAnchor = hash?.trim();
  let anchor: string | undefined;
  if (rawAnchor) {
    try {
      anchor = slugify(decodeURIComponent(rawAnchor));
    } catch {
      anchor = slugify(rawAnchor);
    }
  }
  if (!clean) return anchor ? { path: fromPath, anchor } : null; // 同文档锚点
  if (!clean.endsWith('.md')) return null;
  const parts = clean.startsWith('/')
    ? clean.split('/')
    : [...fromPath.split('/').slice(0, -1), ...clean.split('/')];
  const out: string[] = [];
  for (const p of parts) {
    if (p === '' || p === '.') continue;
    if (p === '..') out.pop();
    else out.push(p);
  }
  return { path: out.join('/'), anchor };
}

function onDocLink(href: string) {
  if (!currentPath.value) return;
  const target = resolveHref(currentPath.value, href);
  if (!target) return;
  if (target.anchor) {
    openBlock(target.path, target.anchor);
  } else {
    open(target.path);
  }
}

/** 流程画布节点拖拽落点 → 坐标编码回 prodoc-flow 块（`id @ x, y`）并保存 */
function onFlowNodeMove(p: { id: string; x: number; y: number; source: string }) {
  if (!currentPath.value) return;
  const content = props.files[currentPath.value];
  if (content === undefined) return;
  const updated = writeFlowNodePosition(content, p.source, p.id, p.x, p.y);
  if (updated === content) return;
  const path = currentPath.value;
  requestSave(path, updated, content).then((res) => {
    if (!res.ok) notifyWriteFailure('保存', path, res);
  });
}

// 初始定位：地址栏 hash 指向的文档（decode 与 syncHash 的 encode 配对）
if (typeof window !== 'undefined' && window.location.hash.length > 1) {
  const initial = decodeURIComponent(window.location.hash.slice(1));
  if (props.files[initial]) currentPath.value = initial;
}
</script>

<template>
  <div class="pd-graph-viewer">
    <header class="pd-graph-header">
      <span class="pd-graph-brand">📚 ProDoc</span>
      <span v-if="currentPath" class="pd-graph-current">{{ currentTitle }}</span>
      <div class="pd-graph-actions">
        <template v-if="!currentPath">
          <button v-if="!graphEditMode" class="pd-back-btn" @click="toggleGraphEdit">🛠 编辑图</button>
          <template v-else>
            <!-- 编辑模式退出路径：有暂存修改时只能保存（留在编辑模式）或放弃（丢弃并退出） -->
            <button class="pd-back-btn" :disabled="undoStack.length === 0" title="撤销（Ctrl+Z）" aria-label="撤销" @click="undoEdit">↶</button>
            <button class="pd-back-btn" :disabled="redoStack.length === 0" title="重做（Ctrl+Shift+Z / Ctrl+Y）" aria-label="重做" @click="redoEdit">↷</button>
            <button class="pd-back-btn" :disabled="!graphDirty || graphSaving" @click="saveGraphEdits">💾 保存</button>
            <button v-if="graphDirty" class="pd-back-btn" :disabled="graphSaving" @click="discardGraphEdits">↩ 放弃更改</button>
            <button v-else class="pd-back-btn pd-back-btn--active" @click="toggleGraphEdit">✓ 完成</button>
          </template>
          <button class="pd-back-btn" @click="toggleRelayout">
            {{ relayouted ? '↩ 恢复坐标' : '🧭 分层重排' }}
          </button>
        </template>
        <template v-if="currentPath">
          <button v-if="!editing" class="pd-back-btn" @click="startEdit">✏️ 编辑</button>
          <template v-else>
            <button class="pd-back-btn" :disabled="!dirty" @click="saveEdit">💾 保存</button>
            <button class="pd-back-btn" @click="cancelEdit">👁 预览</button>
          </template>
          <button class="pd-back-btn" @click="backToGraph">🗺 返回图</button>
        </template>
        <!-- 解析告警（重复 id、悬空引用等）：数量徽标 + 点击查看明细 -->
        <NeumorphismPopover v-if="graph.warnings.length" trigger="click" position="bottom" :width="360">
          <template #default>
            <span class="pd-warn-trigger">
              <NeumorphismBadge :value="graph.warnings.length">
                <button class="pd-back-btn" type="button" title="解析告警明细">⚠️</button>
              </NeumorphismBadge>
            </span>
          </template>
          <template #content>
            <ul class="pd-warn-list">
              <li v-for="w in graph.warnings" :key="w">{{ w }}</li>
            </ul>
          </template>
        </NeumorphismPopover>
        <NeumorphismThemeToggle size="small" />
      </div>
    </header>

    <div class="pd-graph-main">
      <!-- 图画布视图：文档群的全部框 -->
      <NeumorphismCanvas
        v-if="!currentPath"
        ref="canvasRef"
        width="100%"
        height="100%"
        show-grid
        grid-variant="dots"
        show-fit
        :min-zoom="0.25"
        :max-zoom="3"
      >
        <div
          ref="stageEl"
          class="pd-graph-stage"
          :class="{
            'pd-graph-stage--dragging': dragBox?.moved || linkDraft || sideDrag || groupDrag?.moved || groupResize?.moved,
            'pd-graph-stage--editing': graphEditMode,
            'pd-graph-stage--tool-link': graphEditMode && editTool === 'link',
            'pd-graph-stage--tool-node': graphEditMode && editTool === 'node',
          }"
          :style="{ width: `${stage.w}px`, height: `${stage.h}px` }"
          @pointerdown="onStagePointerdown"
          @click="selectedEdgeId = null; touchPanelId = null"
        >
          <!-- 分组区域：同组框的圆角矩形围合（位于连线与框之下；区域本体不响应指针） -->
          <div
            v-for="group in groupRegions"
            :key="'group-' + group.name"
            class="pd-doc-group"
            :class="{ 'pd-dim': isGroupDimmed(group) }"
            :style="{ left: `${group.x}px`, top: `${group.y}px`, width: `${group.w}px`, height: `${group.h}px` }"
          >
            <!-- 组名标签：骑跨顶边（图例式）；图编辑模式下拖动它移动整组 -->
            <span
              class="pd-doc-group__label"
              :title="graphEditMode ? `拖动移动整组「${group.name}」` : group.name"
              data-nm-no-pan
              @pointerdown="onGroupLabelDown($event, group)"
            >{{ group.name }}</span>
            <!-- 区域尺寸手柄：右下角，拖动调整区域长宽（仅图编辑模式） -->
            <button
              v-if="graphEditMode"
              type="button"
              class="pd-doc-group__resize"
              :aria-label="`调整组「${group.name}」的区域尺寸`"
              title="拖动调整区域尺寸"
              data-nm-no-pan
              @pointerdown.stop="onGroupResizeDown($event, group)"
            ></button>
          </div>
          <svg
            v-if="relationEdges.length || linkDraftPath"
            class="pd-relation-layer"
            :width="stage.w"
            :height="stage.h"
            aria-label="文档连线"
          >
            <defs>
              <marker
                id="pd-relation-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" class="pd-relation-arrow" />
              </marker>
            </defs>
            <g
              v-for="edge in relationEdges"
              :key="edge.id"
              class="pd-relation"
              :class="{
                'pd-dim': isEdgeDimmed(edge),
                'pd-hot': isEdgeHot(edge),
                'pd-selected': edge.id === selectedEdgeId,
                'pd-relation--new': edge.id === justLinkedId,
              }"
            >
              <title>{{ edge.fromTitle }} → {{ edge.toTitle }}{{ edge.label ? `（${edge.label}）` : '' }}</title>
              <!-- 加宽的透明命中路径，便于点选（仅图编辑模式可点） -->
              <path class="pd-relation-hit" :d="edge.d" fill="none" @click.stop="onEdgeClick(edge)" @dblclick.stop="onEdgeDblClick(edge)" />
              <path :d="edge.d" fill="none" marker-end="url(#pd-relation-arrow)" pointer-events="none" />
              <text v-if="edge.label" :x="edge.labelX" :y="edge.labelY" pointer-events="none">{{ edge.label }}</text>
            </g>
            <!-- 连线草稿：从连接点拖到目标框 -->
            <path v-if="linkDraftPath" class="pd-relation-draft" :d="linkDraftPath" fill="none" />
            <!-- 吸附对齐参考线（拖框时） -->
            <line
              v-for="(g, i) in activeGuides"
              :key="'guide' + i"
              class="pd-guide"
              :x1="g.axis === 'x' ? g.pos : g.start"
              :y1="g.axis === 'x' ? g.start : g.pos"
              :x2="g.axis === 'x' ? g.pos : g.end"
              :y2="g.axis === 'x' ? g.end : g.pos"
            />
          </svg>
          <div
            v-for="box in layoutBoxes"
            :key="box.id"
            class="pd-doc-box"
            :class="[
              `pd-doc-box--d${Math.min(box.depth, 3)}`,
              {
                'pd-dim': isBoxDimmed(box.id),
                'pd-doc-box--link-target': linkTargetState(box) === 'valid',
                'pd-doc-box--link-invalid': linkTargetState(box) === 'invalid',
                'pd-doc-box--deleting': pendingDeletes.has(box.docPath),
              },
            ]"
            :style="{ left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` }"
            role="link"
            tabindex="0"
            :aria-label="`${box.title}（跳转到文档）`"
            data-nm-no-pan
            @pointerdown="onBoxPointerdown($event, box)"
            @click="onBoxClick(box)"
            @keydown="onBoxKeydown($event, box)"
            @mouseenter="onBoxHover(box.id)"
            @mouseleave="onBoxHover(null)"
          >
            <div class="pd-doc-box__head">
              <span class="pd-doc-box__title" :title="box.title">{{ box.title }}</span>
              <span class="pd-doc-box__icon" aria-hidden="true">↗</span>
            </div>
            <!-- 悬停显示的编辑入口：直接进入该文档的编辑状态（图编辑模式下隐藏，避免带着暂存离开画布） -->
            <button
              v-if="!graphEditMode"
              type="button"
              class="pd-doc-box__edit"
              :aria-label="`编辑 ${box.title}`"
              title="编辑文档"
              @click.stop="openEdit(box.docPath)"
              @keydown.enter.stop="openEdit(box.docPath)"
              @keydown.space.stop="openEdit(box.docPath)"
            >✏️</button>
            <!-- 删除入口（仅图编辑模式且宿主提供删除能力）：点击标记删除，再点撤销；保存时才真正删文件 -->
            <button
              v-if="graphEditMode && deleteHandler"
              type="button"
              class="pd-doc-box__delete"
              :class="{ 'pd-doc-box__delete--armed': pendingDeletes.has(box.docPath) }"
              :aria-label="pendingDeletes.has(box.docPath) ? `撤销删除 ${box.title}` : `删除 ${box.title}`"
              :title="pendingDeletes.has(box.docPath) ? '撤销删除标记' : '标记删除（💾 保存后生效）'"
              @click.stop="onDeleteBoxClick(box)"
              @pointerdown.stop
            >{{ pendingDeletes.has(box.docPath) ? '↩' : '✕' }}</button>
            <!-- 连接点：四条边的中点各一个，从哪条边拖出就固定该边为源边；
                 落点在目标框的哪一侧就连接目标的哪条边（仅图编辑模式） -->
            <template v-if="graphEditMode">
              <button
                v-for="side in (['top', 'right', 'bottom', 'left'] as LinkSide[])"
                :key="side"
                type="button"
                class="pd-doc-box__link-handle"
                :class="`pd-doc-box__link-handle--${side}`"
                :aria-label="`从 ${box.title} 的${{ top: '上', right: '右', bottom: '下', left: '左' }[side]}边创建连线（拖到目标框）`"
                title="拖到其他框创建连线"
                @pointerdown.stop="onLinkStart($event, box, side)"
                @click.stop
              ></button>
            </template>
            <!-- 悬停展开的分块面板：点击条目直达正文对应标题（图编辑模式下隐藏；触屏点按一次强制展开） -->
            <div
              v-if="box.blocks.length && !graphEditMode"
              class="pd-doc-blocks-pop"
              :class="{
                'pd-doc-blocks-pop--above': panelAbove(box, stage.h),
                'pd-doc-blocks-pop--force': touchPanelId === box.id,
              }"
            >
              <div class="pd-doc-blocks-pop__card" role="menu">
                <button
                  v-for="block in panelBlocks(box)"
                  :key="block.anchor"
                  type="button"
                  class="pd-doc-blocks-pop__item"
                  :title="block.title"
                  :aria-label="`跳转到「${block.title}」分块`"
                  @click.stop="openBlock(box.docPath, block.anchor)"
                  @keydown.enter.stop="openBlock(box.docPath, block.anchor)"
                  @keydown.space.stop="openBlock(box.docPath, block.anchor)"
                >▸ {{ block.title }}</button>
                <button
                  v-if="panelOverflow(box) > 0"
                  type="button"
                  class="pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more"
                  :aria-label="`查看全部 ${box.blocks.length} 个分块`"
                  @click.stop="open(box.docPath)"
                >+{{ panelOverflow(box) }} 更多分块…</button>
              </div>
            </div>
          </div>
          <!-- 选中连线的删除按钮（连线中点法线偏移处，避免压住标签；标签编辑中隐藏） -->
          <button
            v-if="graphEditMode && selectedEdge && !labelEdit"
            type="button"
            class="pd-edge-delete"
            :style="{ left: `${selectedEdge.delX}px`, top: `${selectedEdge.delY}px` }"
            :aria-label="`删除连线 ${selectedEdge.fromTitle} → ${selectedEdge.toTitle}`"
            :title="`删除连线（Delete）`"
            @click.stop="removeSelectedEdge"
          >✕</button>
          <!-- 连线标签内联编辑输入框（双击连线弹出，位于连线中点） -->
          <input
            v-if="graphEditMode && selectedEdge && labelEdit && labelEdit.edgeId === selectedEdge.id"
            ref="labelInputEl"
            v-model="labelEdit.value"
            type="text"
            class="pd-edge-label-input"
            :style="{ left: `${selectedEdge.labelX}px`, top: `${selectedEdge.labelY}px` }"
            :aria-label="`编辑连线标签 ${selectedEdge.fromTitle} → ${selectedEdge.toTitle}`"
            placeholder="连线标签（留空移除）"
            data-nm-no-pan
            @keydown.enter.prevent="commitLabelEdit"
            @keydown.esc.prevent="cancelLabelEdit"
            @blur="commitLabelEdit"
            @click.stop
          />
          <!-- 选中连线的端点手柄层：渲染在框层之上并带透明加宽命中区——
               否则手柄与同位置的框连接点重叠且被压在框层下，拖手柄会被误识别为创建连线 -->
          <svg
            v-if="graphEditMode && selectedEdge"
            class="pd-relation-layer pd-relation-layer--top"
            :width="stage.w"
            :height="stage.h"
            aria-hidden="true"
          >
            <g class="pd-edge-handle-grp">
              <circle class="pd-edge-handle" :cx="selectedEdge.x1" :cy="selectedEdge.y1" r="6" />
              <circle
                class="pd-edge-handle-halo"
                :cx="selectedEdge.x1"
                :cy="selectedEdge.y1"
                r="12"
                @pointerdown.stop="onSideHandleDown($event, selectedEdge, 'from')"
                @click.stop
              >
                <title>拖动调整源框连接边</title>
              </circle>
            </g>
            <g class="pd-edge-handle-grp">
              <circle class="pd-edge-handle" :cx="selectedEdge.x2" :cy="selectedEdge.y2" r="6" />
              <circle
                class="pd-edge-handle-halo"
                :cx="selectedEdge.x2"
                :cy="selectedEdge.y2"
                r="12"
                @pointerdown.stop="onSideHandleDown($event, selectedEdge, 'to')"
                @click.stop
              >
                <title>拖动调整目标框连接边</title>
              </circle>
            </g>
          </svg>
        </div>
      </NeumorphismCanvas>

      <!-- 文档正文视图：剥离框架参数区后的内容；编辑模式修改原始完整内容 -->
      <div v-else class="pd-doc-view" :class="{ 'pd-doc-view--editing': editing }">
        <MarkdownEditor
          v-if="editing"
          :key="currentPath"
          :value="draft"
          class="pd-doc-editor"
          @change="draft = $event"
          @keydown="onEditorKeydown"
        />
        <MarkdownRenderer
          v-else
          :key="currentPath"
          :content="bodies[currentPath]"
          :show-toc="true"
          :flow-editable="true"
          @docLink="onDocLink"
          @flowNodeMove="onFlowNodeMove"
        />
      </div>

      <!-- 编辑状态工具栏：画布底部居中（🖱 选择 / 🔗 连线 / 📄 节点） -->
      <div v-if="!currentPath && graphEditMode" class="pd-edit-toolbar" role="toolbar" aria-label="图编辑工具栏">
        <button
          type="button"
          class="pd-edit-toolbar__btn"
          :class="{ 'pd-edit-toolbar__btn--active': editTool === 'select' }"
          title="选择工具（Esc）"
          @click="editTool = 'select'"
        >🖱 选择</button>
        <button
          type="button"
          class="pd-edit-toolbar__btn"
          :class="{ 'pd-edit-toolbar__btn--active': editTool === 'link' }"
          title="连线工具：从任意框拖到目标框创建连线"
          @click="editTool = 'link'"
        >🔗 连线</button>
        <button
          type="button"
          class="pd-edit-toolbar__btn"
          :class="{ 'pd-edit-toolbar__btn--active': editTool === 'node' }"
          title="节点工具：点画布空白创建新文档框"
          @click="editTool = 'node'"
        >📄 节点</button>
      </div>

      <!-- 统一通知（替代原生 alert）与破坏性操作的确认对话框 -->
      <NeumorphismToastProvider ref="toastRef" />
      <NeumorphismModal
        v-model="confirmVisible"
        :title="confirmDialog.title"
        size="small"
        confirm-label="确认"
        cancel-label="取消"
        @confirm="onConfirmDialog"
      >
        {{ confirmDialog.message }}
      </NeumorphismModal>
    </div>
  </div>
</template>
