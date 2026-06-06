/**
 * 文档树操作工具
 */

import type { ProDocNode, DocTree } from './types.js';

/** 从根节点构建 DocTree */
export function createDocTree(root: ProDocNode): DocTree {
  const nodeMap = new Map<string, ProDocNode>();

  function traverse(node: ProDocNode) {
    nodeMap.set(node.path, node);
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(root);

  // 同时也按 ID 索引
  const idMap = new Map<string, ProDocNode>();
  function traverseById(node: ProDocNode) {
    idMap.set(node.id, node);
    for (const child of node.children) {
      traverseById(child);
    }
  }
  traverseById(root);

  return {
    root,
    nodeMap,
    findByPath(path: string): ProDocNode | undefined {
      return nodeMap.get(path);
    },
    findById(id: string): ProDocNode | undefined {
      return idMap.get(id);
    },
  };
}

/** 扁平化文档树为列表 */
export function flattenDocTree(root: ProDocNode): ProDocNode[] {
  const result: ProDocNode[] = [];

  function traverse(node: ProDocNode) {
    result.push(node);
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(root);
  return result;
}

/** 获取节点的所有祖先路径 */
export function getAncestors(node: ProDocNode, root: ProDocNode): ProDocNode[] {
  const ancestors: ProDocNode[] = [];

  function findPath(current: ProDocNode, targetId: string, path: ProDocNode[]): boolean {
    if (current.id === targetId) {
      ancestors.push(...path);
      return true;
    }
    for (const child of current.children) {
      if (findPath(child, targetId, [...path, current])) {
        return true;
      }
    }
    return false;
  }

  findPath(root, node.id, []);
  return ancestors;
}

