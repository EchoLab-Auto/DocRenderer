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

/** LCS 动态规划的规模上限（超出退化为仅公共前后缀对齐） */
const MAX_LCS_CELLS = 4_000_000;

/**
 * base↔other 的行匹配对（双向递增的下标序列）。
 * 先剥离公共前后缀，再对中间区域做 DP LCS 回溯取匹配。
 */
function matchLines(a: string[], b: string[]): Array<[number, number]> {
  let lo = 0;
  let aHi = a.length;
  let bHi = b.length;
  while (lo < aHi && lo < bHi && a[lo] === b[lo]) lo++;
  while (aHi > lo && bHi > lo && a[aHi - 1] === b[bHi - 1]) {
    aHi--;
    bHi--;
  }

  const matches: Array<[number, number]> = [];
  for (let i = 0; i < lo; i++) matches.push([i, i]);

  const n = aHi - lo;
  const m = bHi - lo;
  if (n > 0 && m > 0 && n * m <= MAX_LCS_CELLS) {
    const width = m + 1;
    const dp = new Uint32Array((n + 1) * width);
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i * width + j] =
          a[lo + i] === b[lo + j]
            ? dp[(i + 1) * width + j + 1] + 1
            : Math.max(dp[(i + 1) * width + j], dp[i * width + j + 1]);
      }
    }
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (a[lo + i] === b[lo + j]) {
        matches.push([lo + i, lo + j]);
        i++;
        j++;
      } else if (dp[(i + 1) * width + j] >= dp[i * width + j + 1]) {
        i++;
      } else {
        j++;
      }
    }
  }

  for (let i = 0; i < a.length - aHi; i++) matches.push([aHi + i, bHi + i]);
  return matches;
}

/** 区间行序列相等判定 */
function linesEqual(
  a: string[], aStart: number, aEnd: number,
  b: string[], bStart: number, bEnd: number,
): boolean {
  if (aEnd - aStart !== bEnd - bStart) return false;
  for (let t = 0; t < aEnd - aStart; t++) {
    if (a[aStart + t] !== b[bStart + t]) return false;
  }
  return true;
}

/** diff3 主体：以「base 行在两侧均匹配」的位置为同步锚点，切分稳定区/变更区 */
function diff3Lines(
  base: string[],
  current: string[],
  incoming: string[],
): { lines: string[]; conflicts: number } {
  const toCurrent = new Int32Array(base.length).fill(-1);
  for (const [i, j] of matchLines(base, current)) toCurrent[i] = j;
  const toIncoming = new Int32Array(base.length).fill(-1);
  for (const [i, k] of matchLines(base, incoming)) toIncoming[i] = k;

  const out: string[] = [];
  let conflicts = 0;
  let i = 0; // base 游标
  let j = 0; // current 游标
  let k = 0; // incoming 游标

  while (i < base.length || j < current.length || k < incoming.length) {
    // 稳定区：base 行在两侧同步匹配，逐行采纳
    if (i < base.length && toCurrent[i] === j && toIncoming[i] === k) {
      out.push(base[i]);
      i++;
      j++;
      k++;
      continue;
    }
    // 变更区：推进到下一个双侧匹配的对齐点（无则到各自末尾）
    let iE = base.length;
    let jE = current.length;
    let kE = incoming.length;
    for (let p = i; p < base.length; p++) {
      if (toCurrent[p] !== -1 && toCurrent[p] >= j && toIncoming[p] !== -1 && toIncoming[p] >= k) {
        iE = p;
        jE = toCurrent[p];
        kE = toIncoming[p];
        break;
      }
    }

    const curUnchanged = linesEqual(current, j, jE, base, i, iE);
    const incUnchanged = linesEqual(incoming, k, kE, base, i, iE);
    if (curUnchanged) {
      out.push(...incoming.slice(k, kE));
    } else if (incUnchanged) {
      out.push(...current.slice(j, jE));
    } else if (linesEqual(current, j, jE, incoming, k, kE)) {
      out.push(...current.slice(j, jE));
    } else {
      out.push('<<<<<<< 磁盘当前（外部修改）');
      out.push(...current.slice(j, jE));
      out.push('=======');
      out.push(...incoming.slice(k, kE));
      out.push('>>>>>>> 本次保存（编辑器内容）');
      conflicts++;
    }
    i = iE;
    j = jE;
    k = kE;
  }

  return { lines: out, conflicts };
}

/**
 * 三路合并入口。
 *
 * @param base     客户端编辑所依据的祖先内容
 * @param current  磁盘当前内容（外部修改后的版本）
 * @param incoming 本次提交要写入的内容
 */
export function merge3(base: string, current: string, incoming: string): Merge3Result {
  // 快速路径：任两侧一致时结果即第三侧
  if (current === incoming) return { clean: true, result: current, conflicts: 0 };
  if (base === current) return { clean: true, result: incoming, conflicts: 0 };
  if (base === incoming) return { clean: true, result: current, conflicts: 0 };

  const eol = current.includes('\r\n') ? '\r\n' : '\n';
  const splitRe = /\r?\n/;
  const { lines, conflicts } = diff3Lines(
    base.split(splitRe),
    current.split(splitRe),
    incoming.split(splitRe),
  );
  return { clean: conflicts === 0, result: lines.join(eol), conflicts };
}
