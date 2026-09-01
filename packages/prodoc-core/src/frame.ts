/**
 * 框架参数区（Frame Block）解析
 *
 * 每个 md 文件最前方由两个 `---` 行夹住的区域为框架参数区，
 * 声明本文档在文档群图上对应框的各项属性（id、title、位置等）。
 * 该区域仅供框架消费：正文渲染时完全剥离，读者不可见。
 *
 * 容错：文件以 `---` 开头但找不到闭合的第二个 `---` 时，
 * 视为无参数区，整个文件按普通正文处理（不吞掉内容）。
 */

/** 框架参数区解析结果 */
export interface FrameBlock {
  /** 解析出的参数键值对 */
  params: Record<string, unknown>;
  /** 剥离参数区后的正文 */
  body: string;
  /** 文件中是否存在合法的参数区 */
  hasFrame: boolean;
}

/** 将内联列表按未加引号的逗号拆分。 */
function splitInlineList(raw: string): string[] {
  const items: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (const char of raw) {
    if (quote) {
      current += char;
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === ',') {
      items.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  items.push(current);
  return items;
}

/** 解析单个参数值：整数 / 浮点 / 布尔 / 内联列表 / 带引号字符串 / 裸字符串 */
function parseValue(raw: string): unknown {
  const v = raw.trim();
  if (v === '') return '';
  if (v.startsWith('[') && v.endsWith(']')) {
    return splitInlineList(v.slice(1, -1))
      .map((item) => parseValue(item))
      .filter((item) => item !== '');
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d*\.\d+$/.test(v)) return parseFloat(v);
  const quoted = v.match(/^(["'])([\s\S]*)\1$/);
  if (quoted) return quoted[2];
  return v;
}

/**
 * 解析文件最前方的框架参数区。
 *
 * @param content 文件完整内容
 * @returns 参数键值对 + 剥离后的正文
 */
export function parseFrameBlock(content: string): FrameBlock {
  // 参数区必须从文件第 0 字节开始，第一行是单独的 ---
  const firstBreak = content.indexOf('\n');
  const firstLine = firstBreak === -1 ? content : content.slice(0, firstBreak);
  if (firstLine.trim() !== '---') {
    return { params: {}, body: content, hasFrame: false };
  }

  const rest = firstBreak === -1 ? '' : content.slice(firstBreak + 1);
  const lines = rest.split('\n');
  let closeIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx === -1) {
    // 没有闭合的 ---：不按参数区处理，原文即正文
    return { params: {}, body: content, hasFrame: false };
  }

  const params: Record<string, unknown> = {};
  let i = 0;
  const frameLines = lines.slice(0, closeIdx);
  while (i < frameLines.length) {
    const line = frameLines[i];
    i += 1;
    if (line.trim() === '') continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([\s\S]*)$/);
    if (!m) continue; // 无法识别的行跳过，不中断解析
    const key = m[1];
    let raw = m[2];
    // 值换行书写（prettier 等格式化工具会把 `key: [...]` 排成 `key:` + 下行 `[`）：
    // 本行为空且下行以 [ 起 → 先取下行作为值
    if (raw.trim() === '' && i < frameLines.length && frameLines[i].trimStart().startsWith('[')) {
      raw = frameLines[i];
      i += 1;
    }
    // 多行数组：值以 [ 开头但本行未闭合 → 跨行收集直到闭括号或参数区结束
    if (raw.trimStart().startsWith('[') && !/\]\s*$/.test(raw)) {
      const collected = [raw];
      while (i < frameLines.length) {
        const next = frameLines[i];
        i += 1;
        collected.push(next);
        if (/\]\s*$/.test(next)) break;
      }
      raw = collected.join('\n');
    }
    params[key] = parseValue(raw);
  }

  return { params, body: lines.slice(closeIdx + 1).join('\n'), hasFrame: true };
}

export interface FramePosition {
  x?: number;
  y?: number;
}

/** 将参数值规范为引用条目列表（数组原样，字符串按逗号拆分） */
export function asRefs(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return values
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

/** 读取框架参数区的 link 条目（保留 `目标 | 标签` 原始文本，便于无损回写） */
export function readFrameLinks(content: string): string[] {
  return asRefs(parseFrameBlock(content).params.link);
}

/** 序列化单个 link 条目：含 `|`、逗号、引号或首尾空白时加引号包裹 */
function serializeLinkEntry(entry: string): string {
  if (entry === '' || entry !== entry.trim() || /[|,"]/.test(entry)) {
    return entry.includes('"') ? `'${entry}'` : `"${entry}"`;
  }
  return entry;
}

/**
 * 单值/列表参数行的无损写回：替换已有 `key` 行，没有则插入参数区末尾，
 * 传入 null 时移除该行；文件原本没有参数区且行非空时，在文件开头创建参数区。
 */
function writeFrameParamLine(content: string, key: string, paramLine: string | null): string {
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const frame = parseFrameBlock(content);

  if (!frame.hasFrame) {
    if (paramLine === null) return content;
    return `---${eol}${paramLine}${eol}---${eol}${content}`;
  }

  const lines = content.split(/\r?\n/);
  const closeIdx = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closeIdx === -1) return content;

  const keyPattern = new RegExp(`^${key}\\s*:`);
  const existingIdx = lines
    .slice(1, closeIdx)
    .findIndex((line) => keyPattern.test(line));

  if (existingIdx >= 0) {
    const start = existingIdx + 1;
    let span = 1;
    let valueStart = start;
    let firstValue = lines[start].replace(keyPattern, '');
    // prettier 风格换行：键行值为空、值写在下一行（`key:` 下行才是 `[...]`），
    // 值行也要并入替换范围
    if (firstValue.trim() === '' && start + 1 < closeIdx && lines[start + 1].trimStart().startsWith('[')) {
      valueStart = start + 1;
      firstValue = lines[valueStart];
      span = 2;
    }
    // 现有参数是跨行数组（值以 [ 开头、本行未闭合）时，连同续行一起替换/移除，
    // 否则会留下无法再被解析的孤儿行（污染参数区）
    if (firstValue.trimStart().startsWith('[') && !/\]\s*$/.test(firstValue)) {
      let scan = valueStart + 1;
      while (scan < closeIdx && !/\]\s*$/.test(lines[scan])) scan++;
      if (scan < closeIdx) span = scan - start + 1; // 找到闭合行才按跨行处理（容错）
    }
    if (paramLine === null) lines.splice(start, span);
    else lines.splice(start, span, paramLine);
  } else if (paramLine !== null) {
    lines.splice(closeIdx, 0, paramLine);
  }

  return lines.join(eol);
}

/**
 * 将 link 条目列表写回框架参数区，保留其他参数和正文。
 *
 * 已有 link 行被替换；没有则插入参数区末尾；传入空数组时移除 link 行；
 * 文件原本没有参数区且条目非空时，在文件开头创建参数区。
 */
export function writeFrameLinks(content: string, links: string[]): string {
  const linkLine = links.length > 0 ? `link: [${links.map(serializeLinkEntry).join(', ')}]` : null;
  return writeFrameParamLine(content, 'link', linkLine);
}

/**
 * 将 group 条目写回框架参数区（单值参数），保留其他参数和正文。
 *
 * 已有 group 行被替换；没有则插入参数区末尾；传入 null 时移除 group 行；
 * 文件原本没有参数区时，在文件开头创建参数区。
 */
export function writeFrameGroup(content: string, group: string | null): string {
  return writeFrameParamLine(content, 'group', group !== null ? `group: ${serializeLinkEntry(group)}` : null);
}

/**
 * 将画布坐标写入框架参数区，同时保留其他参数和正文。
 *
 * 仅传入需要写入的坐标轴。已有同名字段会被替换；没有合法参数区时，
 * 在文件开头创建一个新的参数区。
 */
export function writeFramePosition(content: string, position: FramePosition): string {
  const entries = Object.entries(position).filter(
    (entry): entry is ['x' | 'y', number] =>
      (entry[0] === 'x' || entry[0] === 'y') &&
      typeof entry[1] === 'number' &&
      Number.isFinite(entry[1]),
  );
  if (entries.length === 0) return content;

  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const frame = parseFrameBlock(content);
  if (!frame.hasFrame) {
    const params = entries.map(([key, value]) => `${key}: ${value}`).join(eol);
    return `---${eol}${params}${eol}---${eol}${content}`;
  }

  const lines = content.split(/\r?\n/);
  const closeIdx = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closeIdx === -1) return content;

  let insertAt = closeIdx;
  for (const [key, value] of entries) {
    const fieldPattern = new RegExp(`^${key}\\s*:`);
    const fieldIdx = lines.slice(1, insertAt).findIndex((line) => fieldPattern.test(line));
    if (fieldIdx >= 0) {
      lines[fieldIdx + 1] = `${key}: ${value}`;
    } else {
      lines.splice(insertAt, 0, `${key}: ${value}`);
      insertAt++;
    }
  }

  return lines.join(eol);
}
