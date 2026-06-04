/**
 * 文档树节点转换工具
 *
 * 将 ProDocNode 转换为 UI 框架所需的树形数据结构。
 */

import type { ProDocNode } from './types.js';

/**
 * 根据节点路径特征推断对应的图标
 * @param node - ProDoc 文档节点
 * @returns 对应的 emoji 图标
 */
export function getNodeIcon(node: ProDocNode): string {
  const path = node.path?.toLowerCase() || '';
  if (path.includes('api')) return '🔌';
  if (path.includes('guide')) return '📖';
  if (path.includes('config')) return '⚙️';
  if (path.includes('example')) return '💡';
  if (path.includes('install')) return '📦';
  if (path.includes('changelog')) return '📝';
  if (path.includes('faq')) return '❓';
  return '📄';
}

/** 树节点数据结构（与 @echolab/ui-frame 的 TreeNodeData 兼容） */
export interface DocTreeNode {
  key: string;
  label: string;
  icon: string;
  children: DocTreeNode[];
}

/**
 * 将 ProDocNode 递归转换为树形节点数据
 * @param node - ProDoc 文档节点
 * @returns 树形节点数据
 */
export function nodeToTreeData(node: ProDocNode): DocTreeNode {
  const icon = node.children.length > 0 ? '📁' : getNodeIcon(node);
  return {
    key: node.path,
    label: node.title,
    icon,
    children: node.children.map(nodeToTreeData),
  };
}
