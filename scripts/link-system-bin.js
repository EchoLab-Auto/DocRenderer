#!/usr/bin/env node
/**
 * 将 echo-prodoc 命令软链接到系统 bin 目录
 *
 * 用法：
 *   node scripts/link-system-bin.js
 *   sudo node scripts/link-system-bin.js
 *
 * 默认链接到 /usr/local/bin，可通过 SYSTEM_BIN_DIR 环境变量覆盖。
 */

const fs = require('fs');
const path = require('path');

const SYSTEM_BIN_DIR = process.env.SYSTEM_BIN_DIR || '/usr/local/bin';

function findTargetBin() {
  // 1. 优先使用 npm 当前前缀的 bin
  const npmPrefix = process.env.NPM_CONFIG_PREFIX || (() => {
    try {
      return require('child_process').execSync('npm config get prefix', { encoding: 'utf-8' }).trim();
    } catch {
      return '';
    }
  })();

  if (npmPrefix) {
    const candidate = path.join(npmPrefix, 'bin', 'echo-prodoc');
    if (fs.existsSync(candidate)) return candidate;
  }

  // 2. 回退：从本脚本位置推导全局 node_modules
  const thisScriptDir = path.resolve(__dirname);
  let dir = thisScriptDir;
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, 'bin', 'echo-prodoc');
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }

  // 3. 最后尝试从 which/where 找
  try {
    return require('child_process').execSync('which echo-prodoc || where echo-prodoc', { encoding: 'utf-8' }).trim().split('\n')[0];
  } catch {
    return '';
  }
}

function main() {
  const target = findTargetBin();
  if (!target || !fs.existsSync(target)) {
    console.error('❌ 找不到 echo-prodoc 可执行文件。');
    console.error('   请先执行 npm install -g echo-prodoc（或先打包安装）。');
    process.exit(1);
  }

  const linkPath = path.join(SYSTEM_BIN_DIR, 'echo-prodoc');

  if (!fs.existsSync(SYSTEM_BIN_DIR)) {
    console.error(`❌ 目标目录不存在: ${SYSTEM_BIN_DIR}`);
    process.exit(1);
  }

  try {
    if (fs.existsSync(linkPath) || fs.lstatSync(linkPath, { throwIfNoEntry: false })) {
      fs.unlinkSync(linkPath);
    }
    fs.symlinkSync(target, linkPath);
    console.log(`✅ 已创建软链接: ${linkPath} -> ${target}`);
    console.log(`   现在可以直接运行: echo-prodoc view ./docs`);
  } catch (err) {
    if (err.code === 'EACCES' || err.code === 'EPERM') {
      console.error(`❌ 没有权限写入 ${SYSTEM_BIN_DIR}，请用 sudo 重试：`);
      console.error(`   sudo node ${process.argv[1]}`);
    } else {
      console.error(`❌ 创建软链接失败: ${err.message}`);
    }
    process.exit(1);
  }
}

main();
