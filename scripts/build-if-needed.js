#!/usr/bin/env node
/**
 * 仅在任意 workspace 包的 dist 缺失时执行 npm run build
 *
 * 用途：在 prepare 生命周期中避免对已经携带构建产物的发布包重复构建，
 * 因为 tarball 全局安装时不会安装 devDependencies，重复构建会失败。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(PROJECT_ROOT, 'packages');

const PACKAGES = ['prodoc-core', 'prodoc-renderer', 'prodoc-editor', 'prodoc-cli'];

function distExists(pkgName) {
  const distDir = path.join(PACKAGES_DIR, pkgName, 'dist');
  if (!fs.existsSync(distDir)) return false;
  const files = fs.readdirSync(distDir);
  return files.length > 0;
}

function main() {
  const missing = PACKAGES.filter(pkg => !distExists(pkg));

  if (missing.length === 0) {
    console.log('✅ All package dists exist, skipping build.');
    return;
  }

  console.log(`📦 Missing dist for: ${missing.join(', ')}, running build...`);
  execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' });
}

main();
