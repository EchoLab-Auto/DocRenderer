#!/usr/bin/env node
/**
 * 切换 @echolab-auto/ui-frame 的依赖来源（不修改 package.json）
 *
 * 用法：
 *   node scripts/switch-ui-frame.js npm    — 切换到 npm registry（默认）
 *   node scripts/switch-ui-frame.js local  — 切换到 vendor 本地构建
 *
 * 通过直接操作 node_modules 实现，不经过 npm install（会修改 package.json）。
 * package.json 始终保持 "^1.0.0" 声明，不会产生任何 git 变更。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const VENDOR_UI = path.join(PROJECT_ROOT, 'vendor', '@echolab-auto', 'ui-frame');
const NODE_MODULES_UI = path.join(PROJECT_ROOT, 'node_modules', '@echolab-auto', 'ui-frame');

function run(cmd, cwd = PROJECT_ROOT) {
  try {
    execSync(cmd, { cwd, encoding: 'utf-8', stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Command failed: ${cmd}`);
    process.exit(1);
  }
}

/** 递归复制目录 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function switchToLocal() {
  // 1. 构建 ui-frame 到 vendor/
  console.log('📦 Building @echolab-auto/ui-frame from source...');
  run('node scripts/install-ui-frame.js');

  // 2. 直接将 vendor 复制到 node_modules（不经过 npm，零文件变更）
  console.log('🔗 Copying vendor to node_modules...');
  fs.rmSync(NODE_MODULES_UI, { recursive: true, force: true });
  copyDir(VENDOR_UI, NODE_MODULES_UI);

  console.log('\n✅ Switched to local ui-frame. No files modified.');
}

function switchToNpm() {
  // 移除本地副本，让 npm 根据 package.json 重新安装 registry 版本
  console.log('📥 Removing local ui-frame from node_modules...');
  fs.rmSync(NODE_MODULES_UI, { recursive: true, force: true });

  console.log('📥 Reinstalling @echolab-auto/ui-frame from npm registry...');
  run('npm install');

  console.log('\n✅ Switched to npm registry. No files modified.');
}

const mode = process.argv[2];
if (!mode || (mode !== 'npm' && mode !== 'local')) {
  console.error('Usage: node scripts/switch-ui-frame.js <npm|local>');
  process.exit(1);
}

if (mode === 'local') {
  switchToLocal();
} else {
  switchToNpm();
}
