#!/usr/bin/env node
/**
 * 切换 @echolab-auto/ui-frame 的依赖来源
 *
 * 用法：
 *   node scripts/switch-ui-frame.js npm    — 切换到 npm registry（默认）
 *   node scripts/switch-ui-frame.js local  — 切换到 file: vendor 本地构建
 *
 * 该脚本会修改以下文件中的 @echolab-auto/ui-frame 依赖声明：
 *   - 根 package.json (dependencies)
 *   - packages/prodoc-core/package.json (devDependencies)
 *   - packages/prodoc-editor/package.json (devDependencies)
 *   - packages/prodoc-renderer/package.json (devDependencies)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const PKG_FILES = [
  { file: 'package.json', field: 'dependencies' },
  { file: 'packages/prodoc-core/package.json', field: 'devDependencies' },
  { file: 'packages/prodoc-editor/package.json', field: 'devDependencies' },
  { file: 'packages/prodoc-renderer/package.json', field: 'devDependencies' },
];

const NPM_ALIAS = '^1.0.0';
const FILE_PROTOCOL = 'file:vendor/@echolab-auto/ui-frame';
const FILE_PROTOCOL_SUB = 'file:../../vendor/@echolab-auto/ui-frame';

function switchTo(mode) {
  const targetValue = mode === 'npm' ? NPM_ALIAS : null;
  const isFileMode = mode === 'local';

  for (const { file, field } of PKG_FILES) {
    const filePath = path.join(PROJECT_ROOT, file);
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!pkg[field] || !pkg[field]['@echolab-auto/ui-frame']) {
      console.warn(`⚠️  @echolab-auto/ui-frame not found in ${file} > ${field}, skipping.`);
      continue;
    }

    if (isFileMode) {
      // 根据层级选择正确的相对路径
      pkg[field]['@echolab-auto/ui-frame'] = file === 'package.json' ? FILE_PROTOCOL : FILE_PROTOCOL_SUB;
    } else {
      pkg[field]['@echolab-auto/ui-frame'] = NPM_ALIAS;
    }

    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ ${file} > ${field}: switched to ${mode}`);
  }

  // local 模式下自动构建 ui-frame
  if (isFileMode) {
    console.log('\n📦 Building @echolab-auto/ui-frame from source...');
    try {
      execSync('node scripts/install-ui-frame.js', {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
        stdio: 'inherit',
      });
    } catch (err) {
      console.error('❌ Failed to build ui-frame from source.');
      console.error('   Make sure the GitHub repository is accessible and try again.');
      process.exit(1);
    }
  } else {
    console.log('\n📥 Run "npm install" to install @echolab-auto/ui-frame from npm registry.');
  }
}

const mode = process.argv[2];
if (!mode || (mode !== 'npm' && mode !== 'local')) {
  console.error('Usage: node scripts/switch-ui-frame.js <npm|local>');
  process.exit(1);
}

switchTo(mode);
