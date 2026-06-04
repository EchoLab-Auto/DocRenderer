/**
 * 流程图 DSL 解析器
 *
 * 语法格式：
 * ```prodoc-flow
 * graph LR
 *   A[开始] --> B{判断}
 *   B -->|是| C[步骤1|/guide/step1.md]
 *   B -->|否| D[步骤2]
 *   C --> E[结束]
 *   D --> E
 * ```
 *
 * 节点语法：
 *   A[文本]      - 矩形节点
 *   A(文本)      - 圆形节点
 *   A{文本}      - 菱形节点
 *   A[/文本/]    - 圆角矩形节点
 *   A[文本|路径] - 带文档路径的节点
 *
 * 边语法：
 *   A --> B           - 普通边
 *   A -->|标签| B     - 带标签的边
 */

import type { FlowGraph, FlowNode, FlowEdge, FlowNodeShape, FlowNodeStyle } from './types.js';

/** 解析流程图 DSL */
export function parseFlowDsl(dsl: string): FlowGraph {
  const lines = dsl
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('graph') && !l.startsWith('%%'));

  const nodes = new Map<string, FlowNode>();
  const edges: FlowEdge[] = [];

  for (const line of lines) {
    // 解析边：A --> B 或 A -->|label| B
    const edgeMatch = line.match(/^(.+?)\s*(-->|---|==>|\.->)\s*\|?([^|]*)\|?\s*(.+?)$/);
    if (edgeMatch) {
      const [, fromRaw, arrowType, label, toRaw] = edgeMatch;
      const fromNode = parseNodeExpr(fromRaw.trim(), nodes);
      const toNode = parseNodeExpr(toRaw.trim(), nodes);

      const edgeStyle = arrowType === '.->'
        ? { strokeDasharray: '5,5' }
        : arrowType === '==>'
          ? { strokeWidth: 3 }
          : undefined;

      edges.push({
        id: `edge-${fromNode.id}-${toNode.id}-${edges.length}`,
        from: fromNode.id,
        to: toNode.id,
        label: label.trim() || undefined,
        style: edgeStyle,
      });
    } else {
      // 单独定义节点
      parseNodeExpr(line, nodes);
    }
  }

  // 自动布局
  const nodeList = Array.from(nodes.values());
  autoLayout(nodeList, edges);

  return {
    nodes: nodeList,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 },
  };
}

/** 解析节点表达式 */
function parseNodeExpr(
  expr: string,
  nodeMap: Map<string, FlowNode>,
): FlowNode {
  // 提取节点 ID 和定义部分
  const idMatch = expr.match(/^([A-Za-z][A-Za-z0-9_]*)\s*(.*)$/);
  if (!idMatch) {
    throw new Error(`Invalid node expression: ${expr}`);
  }

  const nodeId = idMatch[1];
  const rest = idMatch[2].trim();

  // 如果节点已存在，直接返回
  if (nodeMap.has(nodeId)) {
    return nodeMap.get(nodeId)!;
  }

  let label = nodeId;
  let shape: FlowNodeShape = 'rect';
  let docPath: string | undefined;

  if (rest) {
    // [文本|路径] - 矩形
    const rectMatch = rest.match(/^\[(.*)\]$/);
    // (文本|路径) - 圆形
    const circleMatch = rest.match(/^\((.*)\)$/);
    // {文本|路径} - 菱形
    const diamondMatch = rest.match(/^\{(.*)\}$/);
    // [/文本/] - 圆角矩形
    const roundRectMatch = rest.match(/^\[\/(.*)\/\]$/);

    let content = '';
    if (rectMatch) {
      content = rectMatch[1];
      shape = 'rect';
    } else if (circleMatch) {
      content = circleMatch[1];
      shape = 'circle';
    } else if (diamondMatch) {
      content = diamondMatch[1];
      shape = 'diamond';
    } else if (roundRectMatch) {
      content = roundRectMatch[1];
      shape = 'round-rect';
    }

    if (content) {
      const parts = content.split('|');
      label = parts[0].trim();
      if (parts.length > 1) {
        docPath = parts[1].trim();
      }
    }
  }

  const node: FlowNode = {
    id: nodeId,
    label,
    shape,
    x: 0,
    y: 0,
    width: estimateWidth(label),
    height: estimateHeight(label, shape),
    docPath,
    style: getDefaultStyle(shape),
  };

  nodeMap.set(nodeId, node);
  return node;
}

/** 估算文本宽度 */
function estimateWidth(text: string): number {
  const charWidth = 14; // 近似字符宽度
  const padding = 32;
  return Math.max(80, text.length * charWidth + padding);
}

/** 估算节点高度 */
function estimateHeight(text: string, shape: FlowNodeShape): number {
  const lineHeight = 20;
  const lines = text.split('\n').length;
  const padding = shape === 'circle' ? 20 : 24;
  return Math.max(40, lines * lineHeight + padding);
}

/** 获取默认样式 — 由渲染器使用 CSS 变量处理主题适配 */
function getDefaultStyle(_shape: FlowNodeShape): FlowNodeStyle {
  return {};
}

/** 简单的层级自动布局 */
function autoLayout(nodes: FlowNode[], edges: FlowEdge[]): void {
  // 构建邻接表和入度
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const n of nodes) {
    adj.set(n.id, []);
    inDegree.set(n.id, 0);
  }

  for (const e of edges) {
    adj.get(e.from)!.push(e.to);
    inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1);
  }

  // 拓扑排序分层
  const layers: string[][] = [];
  let current = nodes.filter(n => (inDegree.get(n.id) || 0) === 0).map(n => n.id);
  const visited = new Set<string>();

  while (current.length > 0) {
    layers.push([...current]);
    for (const id of current) {
      visited.add(id);
    }
    const next: string[] = [];
    for (const id of current) {
      for (const to of adj.get(id) || []) {
        if (!visited.has(to)) {
          next.push(to);
        }
      }
    }
    current = [...new Set(next)];
  }

  // 如果有环，把剩余节点放在最后一层
  for (const n of nodes) {
    if (!visited.has(n.id)) {
      if (layers.length === 0) layers.push([]);
      layers[layers.length - 1].push(n.id);
    }
  }

  // 计算位置
  const horizontalGap = 160;
  const verticalGap = 100;

  for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
    const layer = layers[layerIdx];
    const layerWidth = layer.length * horizontalGap;
    const startX = -layerWidth / 2;

    for (let i = 0; i < layer.length; i++) {
      const node = nodes.find(n => n.id === layer[i])!;
      node.x = startX + i * horizontalGap + horizontalGap / 2;
      node.y = layerIdx * verticalGap;
    }
  }
}

/** 导出流程图 DSL 为字符串 */
export function exportFlowDsl(graph: FlowGraph): string {
  const lines: string[] = ['graph LR'];

  // 先输出所有节点定义
  for (const node of graph.nodes) {
    let def = `  ${node.id}`;
    const label = node.docPath ? `${node.label}|${node.docPath}` : node.label;

    switch (node.shape) {
      case 'rect':
        def += `[${label}]`;
        break;
      case 'round-rect':
        def += `[/${label}/]`;
        break;
      case 'diamond':
        def += `{${label}}`;
        break;
      case 'circle':
        def += `(${label})`;
        break;
    }
    lines.push(def);
  }

  // 输出边
  for (const edge of graph.edges) {
    let line = `  ${edge.from} -->`;
    if (edge.label) {
      line += `|${edge.label}|`;
    }
    line += ` ${edge.to}`;
    lines.push(line);
  }

  return lines.join('\n');
}
