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
/**
 * 解析文件最前方的框架参数区。
 *
 * @param content 文件完整内容
 * @returns 参数键值对 + 剥离后的正文
 */
export declare function parseFrameBlock(content: string): FrameBlock;
export interface FramePosition {
    x?: number;
    y?: number;
}
/** 将参数值规范为引用条目列表（数组原样，字符串按逗号拆分） */
export declare function asRefs(value: unknown): string[];
/** 读取框架参数区的 link 条目（保留 `目标 | 标签` 原始文本，便于无损回写） */
export declare function readFrameLinks(content: string): string[];
/**
 * 将 link 条目列表写回框架参数区，保留其他参数和正文。
 *
 * 已有 link 行被替换；没有则插入参数区末尾；传入空数组时移除 link 行；
 * 文件原本没有参数区且条目非空时，在文件开头创建参数区。
 */
export declare function writeFrameLinks(content: string, links: string[]): string;
/**
 * 将 group 条目写回框架参数区（单值参数），保留其他参数和正文。
 *
 * 已有 group 行被替换；没有则插入参数区末尾；传入 null 时移除 group 行；
 * 文件原本没有参数区时，在文件开头创建参数区。
 */
export declare function writeFrameGroup(content: string, group: string | null): string;
/**
 * 将画布坐标写入框架参数区，同时保留其他参数和正文。
 *
 * 仅传入需要写入的坐标轴。已有同名字段会被替换；没有合法参数区时，
 * 在文件开头创建一个新的参数区。
 */
export declare function writeFramePosition(content: string, position: FramePosition): string;
//# sourceMappingURL=frame.d.ts.map