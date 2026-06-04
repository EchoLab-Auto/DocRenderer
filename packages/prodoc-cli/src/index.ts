#!/usr/bin/env node
/**
 * Echo-ProDoc CLI 入口
 *
 * 命令：
 *   echo-prodoc view <document-path>  — 启动渲染服务器
 *   echo-prodoc edit <document-path>  — 启动编辑服务器
 */

import path from 'path';
import fs from 'fs/promises';
import { startProDocServer } from './server.js';

const PKG_NAME = 'echo-prodoc';
const PKG_VERSION = '0.1.0';

/** 显示帮助信息 */
function showHelp() {
  console.log(`
${PKG_NAME} v${PKG_VERSION}

Usage:
  ${PKG_NAME} view <document-path>   Start a rendering server for the document directory
  ${PKG_NAME} edit <document-path>   Start an editing server for the document directory
  ${PKG_NAME} --help                 Show this help message
  ${PKG_NAME} --version              Show version

Options:
  --port, -p <number>    Server port (default: 3344)
  --no-open              Do not open browser automatically

Examples:
  ${PKG_NAME} view ./docs
  ${PKG_NAME} edit ./docs --port 8080
`);
}

/** 解析命令行参数 */
function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const result: {
    command?: 'view' | 'edit';
    docPath?: string;
    port?: number;
    open: boolean;
    help: boolean;
    version: boolean;
  } = { open: true, help: false, version: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--version' || arg === '-v') {
      result.version = true;
    } else if (arg === '--port' || arg === '-p') {
      result.port = parseInt(args[++i], 10);
    } else if (arg === '--no-open') {
      result.open = false;
    } else if (!arg.startsWith('-')) {
      if (!result.command) {
        if (arg === 'view' || arg === 'edit') {
          result.command = arg;
        } else {
          console.error(`Unknown command: ${arg}`);
          process.exit(1);
        }
      } else if (!result.docPath) {
        result.docPath = arg;
      }
    }
  }

  return result;
}

/** 验证文档路径 */
async function validateDocPath(docPath: string): Promise<string> {
  const resolved = path.resolve(docPath);
  try {
    const stat = await fs.stat(resolved);
    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: ${resolved}`);
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error(`Directory not found: ${resolved}`);
    }
    throw err;
  }
  return resolved;
}

/** 主入口 */
async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (args.version) {
    console.log(`${PKG_NAME} v${PKG_VERSION}`);
    process.exit(0);
  }

  if (!args.command) {
    console.error('Error: No command specified. Use "view" or "edit".');
    console.error(`\nRun "${PKG_NAME} --help" for usage information.`);
    process.exit(1);
  }

  if (!args.docPath) {
    console.error('Error: No document path specified.');
    console.error(`\nRun "${PKG_NAME} --help" for usage information.`);
    process.exit(1);
  }

  try {
    const docRoot = await validateDocPath(args.docPath);
    const server = await startProDocServer(args.command, docRoot, {
      port: args.port,
      open: args.open,
    });

    // 优雅退出
    const shutdown = () => {
      console.log('\n👋 Shutting down...');
      server.close().then(() => {
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err: any) {
    console.error(`\n❌ Error: ${err.message}\n`);
    process.exit(1);
  }
}

main();
