/**
 * 发布包配置：npm pack/publish 时临时改写 package.json
 *
 * 背景：仓库根 package.json 含 `workspaces` 字段，发布的 tarball 又携带
 * packages/*\/package.json——消费者全局安装时 npm 会把子包当工作区处理，
 * 连它们的 devDependencies（typescript、vite 等）也一并装进全局目录。
 *
 * prepack 时（apply）：剔除 workspaces、devDependencies 与纯开发脚本；
 * postpack 时（restore）：还原原始 package.json。
 * npm 的执行顺序是 prepublishOnly → prepack → 打包 → postpack → 发布，
 * 因此构建（prepublishOnly）先于改写执行，互不影响。
 */

const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const bakPath = path.join(__dirname, '..', '.package.json.publish-bak');

/** 发布版不需要的纯开发脚本 */
const DEV_SCRIPTS = [
  'build',
  'build:ui-frame',
  'type-check',
  'clean',
  'view',
  'dev:view',
  'prepublishOnly',
  'use-local-ui-frame',
  'use-npm-ui-frame',
];

function apply() {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  fs.writeFileSync(bakPath, JSON.stringify(pkg, null, 2) + '\n');

  const out = { ...pkg };
  delete out.workspaces;
  delete out.devDependencies;
  if (out.scripts) {
    for (const key of DEV_SCRIPTS) delete out.scripts[key];
    if (Object.keys(out.scripts).length === 0) delete out.scripts;
  }
  fs.writeFileSync(pkgPath, JSON.stringify(out, null, 2) + '\n');
  console.log('📦 package.json 已切换为发布配置（workspaces/devDependencies 已剔除）');
}

function restore() {
  if (!fs.existsSync(bakPath)) return;
  fs.renameSync(bakPath, pkgPath);
  console.log('↩ package.json 已还原为开发配置');
}

const mode = process.argv[2];
if (mode === 'apply') apply();
else if (mode === 'restore') restore();
else {
  console.error('用法: node scripts/publish-package.js apply|restore');
  process.exit(1);
}
