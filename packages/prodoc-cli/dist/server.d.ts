/**
 * ProDoc CLI 服务器启动逻辑
 *
 * 使用 Vite 的 createServer API 启动一个本地开发服务器，
 * 通过虚拟模块注入文档内容和运行模式，实现零文件系统依赖。
 */
import { type ViteDevServer } from 'vite';
/** 启动 ProDoc 服务器 */
export declare function startProDocServer(mode: 'view' | 'edit', docRoot: string, options?: {
    port?: number;
    open?: boolean;
}): Promise<ViteDevServer>;
//# sourceMappingURL=server.d.ts.map