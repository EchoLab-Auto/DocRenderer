/**
 * 三路合并（3-way merge / diff3）
 *
 * 保存冲突的自动调和：客户端依据的基准 base、磁盘当前 current、本次提交 incoming。
 * 对 base→current 与 base→incoming 两份行级差异做对齐：
 * - 仅一侧变更的区域 → 采纳该侧；
 * - 两侧都改且结果一致 → 采纳其一；
 * - 两侧改到同一区域且结果不一致 → 输出冲突块（merge 标记），整体判为不干净。
 *
 * 行对齐用「公共前后缀剥离 + DP LCS」，规模超限时退化为仅前后缀对齐
 * （中间区域按整体变更处理——保证合并正确性，牺牲冲突粒度）。
 */
/** 三路合并结果 */
export interface Merge3Result {
    /** 是否无冲突（false 时 result 含冲突标记，仅供诊断展示，不应直接写盘） */
    clean: boolean;
    /** 合并结果文本（EOL 跟随磁盘当前版本） */
    result: string;
    /** 冲突块数量 */
    conflicts: number;
}
/**
 * 三路合并入口。
 *
 * @param base     客户端编辑所依据的祖先内容
 * @param current  磁盘当前内容（外部修改后的版本）
 * @param incoming 本次提交要写入的内容
 */
export declare function merge3(base: string, current: string, incoming: string): Merge3Result;
//# sourceMappingURL=merge.d.ts.map