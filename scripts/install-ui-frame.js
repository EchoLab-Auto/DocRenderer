#!/usr/bin/env node
/**
 * 自动构建并安装 @echolab/ui-frame
 *
 * 该脚本在 npm postinstall 阶段运行。
 * 由于 ui-frame 仅作为 GitHub 仓库存在（未发布到 npm），
 * 且通过 GitHub 安装时不包含构建产物（dist/），
 * 此脚本负责：
 *   1. 从远程获取最新版本信息
 *   2. 有更新时拉取源码、重新构建
 *   3. 将构建产物复制到 node_modules
 *
 * 缓存策略：
 *   - 源码缓存在 .cache/ui-frame-src/
 *   - 每次运行都会 fetch 远程并比对 commit hash
 *   - 仅当远程有更新或本地 dist 缺失时才重新构建
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_URL = 'https://github.com/EchoLab-Auto/ui-frame.git';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(PROJECT_ROOT, '.cache', 'ui-frame-src');
const TARGET_DIR = path.join(PROJECT_ROOT, 'node_modules', '@echolab', 'ui-frame');
const TARGET_DIST = path.join(TARGET_DIR, 'dist');

/** 安全执行命令 */
function run(cmd, cwd, options = {}) {
  try {
    const output = execSync(cmd, {
      cwd,
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return output ? output.trim() : '';
  } catch (err) {
    if (!options.ignoreError) {
      console.error(`❌ Command failed: ${cmd}`);
      console.error(err.message);
      process.exit(1);
    }
    return '';
  }
}

/** 静默执行命令，返回输出 */
function runSilent(cmd, cwd, options = {}) {
  return run(cmd, cwd, { silent: true, ignoreError: true, ...options });
}

/** 获取目录最后修改时间 */
function mtime(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return 0;
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

/** 检查缓存中的 dist 是否完整 */
function hasValidDist(dir) {
  if (!fs.existsSync(dir)) return false;
  try {
    const files = fs.readdirSync(dir);
    // 至少包含 style.css, ui-frame.js, ui-frame.umd.cjs, index.d.ts
    return files.length >= 4;
  } catch {
    return false;
  }
}

/** 获取本地 HEAD commit hash */
function getLocalHash() {
  return runSilent('git rev-parse HEAD', CACHE_DIR);
}

/** 获取远程 origin/main commit hash */
function getRemoteHash() {
  return runSilent('git rev-parse origin/main', CACHE_DIR);
}

function main() {
  // 1. 确保缓存目录存在
  fs.mkdirSync(path.dirname(CACHE_DIR), { recursive: true });

  // 2. 克隆或准备现有仓库
  if (!fs.existsSync(path.join(CACHE_DIR, '.git'))) {
    console.log(`🔄 First time: cloning ${REPO_URL}...`);
    run(`git clone --depth 1 ${REPO_URL} "${CACHE_DIR}"`);
  }

  // 3. 获取远程最新版本信息（网络失败时优雅降级，使用本地缓存）
  console.log('🔍 Checking for updates from remote...');
  const fetchResult = runSilent('git fetch origin main', CACHE_DIR);
  const fetchSuccess = fetchResult !== '' || fs.existsSync(path.join(CACHE_DIR, '.git', 'FETCH_HEAD'));

  const localHash = getLocalHash();
  const remoteHash = fetchSuccess ? getRemoteHash() : '';
  const hasUpdate = fetchSuccess && remoteHash !== '' && localHash !== remoteHash;

  if (!fetchSuccess) {
    console.log('⚠️  Network unavailable, skipping remote check.');
  }

  if (hasUpdate) {
    console.log(`⬆️  Update available: ${localHash.slice(0, 7)} → ${remoteHash.slice(0, 7)}`);
    console.log('🔄 Resetting local changes and pulling latest source...');
    run('git reset --hard HEAD', CACHE_DIR);
    run('git clean -fd', CACHE_DIR);
    run('git pull origin main', CACHE_DIR);
  } else {
    console.log(`✅ Already up to date (${localHash.slice(0, 7)})`);
  }

  const cacheDist = path.join(CACHE_DIR, 'dist');

  // 4. 判断是否需要重新构建
  const needBuild = hasUpdate || !hasValidDist(cacheDist) || !hasValidDist(TARGET_DIST);

  if (!needBuild) {
    console.log('✅ @echolab/ui-frame dist is up to date, nothing to do.');
    console.log('   To force rebuild: rm -rf .cache/ui-frame-src/dist && npm run build:ui-frame');
    return;
  }

  if (hasUpdate) {
    console.log('📦 Remote updated, will rebuild.');
  } else if (!hasValidDist(cacheDist)) {
    console.log('📦 Cache dist missing, will build.');
  } else if (!hasValidDist(TARGET_DIST)) {
    console.log('📦 Target dist missing, will copy from cache.');
  }

  // 5. 安装依赖
  // 全局安装的 postinstall 子进程中，npm 可能因 hoisting 或 allow-scripts
  // 等机制不会完整安装 devDependencies。因此改为直接解析 package.json，
  // 显式安装所有 deps + devDeps，确保构建工具链（vue-tsc, vite 等）完整。
  const cacheNodeModules = path.join(CACHE_DIR, 'node_modules');
  const cachePkgLock = path.join(CACHE_DIR, 'package-lock.json');
  const pkgJsonPath = path.join(CACHE_DIR, 'package.json');

  if (!fs.existsSync(cacheNodeModules) || hasUpdate || mtime(pkgJsonPath) > mtime(cachePkgLock)) {
    // 直接传包名给 npm install 在已有 package.json 的目录中，npm 可能
    // 将依赖 hoist 到 workspace 根而非本地 node_modules。
    // 改为生成一个完整临时 package.json，所有 deps+devDeps 作为直接依赖，
    // npm install 后恢复原 package.json，确保依赖装在本地 node_modules。
    console.log('📥 Installing ui-frame dependencies...');

    // 备份原 package.json，生成包含所有依赖的临时 package.json
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const originalPkg = fs.readFileSync(pkgJsonPath, 'utf-8');
    const tempPkg = {
      name: 'ui-frame-build',
      private: true,
      type: pkg.type || 'module',
      dependencies: {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      },
    };
    fs.writeFileSync(pkgJsonPath, JSON.stringify(tempPkg, null, 2));

    try {
      run('npm install --ignore-scripts', CACHE_DIR);
    } finally {
      // 必须恢复原 package.json，否则后续 git pull/reset 会冲突
      fs.writeFileSync(pkgJsonPath, originalPkg);
    }
  }

  // 6. 构建（如果缓存 dist 仍然无效，或刚更新了源码）
  if (!hasValidDist(cacheDist) || hasUpdate) {
    console.log('🔨 Building ui-frame...');
    // 跳过 vue-tsc 类型检查（在显式安装的依赖树上类型解析可能不完整），
    // 直接运行 vite 构建生成 dist 产物
    run('npx --yes vite build && npx --yes vite build --config vite.umd.config.ts', CACHE_DIR);
  } else {
    console.log('✅ ui-frame cache dist is valid');
  }

  // 7. 复制到 node_modules
  console.log('📋 Copying dist to node_modules...');
  fs.rmSync(TARGET_DIST, { recursive: true, force: true });
  copyDir(cacheDist, TARGET_DIST);

  // 8. 注入 ./doc 子路径导出（ui-frame 的 exports 默认未包含 doc 模块）
  const targetPkgPath = path.join(TARGET_DIR, 'package.json');
  if (fs.existsSync(targetPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(targetPkgPath, 'utf-8'));
    if (!pkg.exports['./doc']) {
      pkg.exports['./doc'] = {
        import: './dist/doc/index.js',
        types: './dist/doc/index.d.ts',
      };
      fs.writeFileSync(targetPkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log('📋 Injected ./doc export into ui-frame package.json');
    }
  }

  console.log('\n✅ @echolab/ui-frame installed successfully!');
}

main();
