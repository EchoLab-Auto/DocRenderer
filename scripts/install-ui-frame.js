#!/usr/bin/env node
/**
 * 从 GitHub 源码构建 @echolab-auto/ui-frame 并安装到 vendor/ 目录
 *
 * 该脚本仅在「本地开发 ui-frame 自身」时使用（通过 npm run use-local-ui-frame 调用）。
 * 默认情况下，项目通过 npm registry 安装 @echolab-auto/ui-frame。
 *
 * 当需要修改 ui-frame 源码并立即在 DocRenderer 中验证时：
 *   1. 运行 npm run use-local-ui-frame 切换到 file: 协议
 *   2. 本脚本自动执行：clone → build → copy 到 vendor/ → 同步到 node_modules/
 *
 * 缓存策略：
 *   - 源码缓存在 .cache/ui-frame-src/
 *   - 每次运行都会 fetch 远程并比对 commit hash
 *   - 仅当远程有更新或本地 dist 缺失时才重新构建
 *
 * 构建隔离：
 *   - npm install 在 workspace 根下会触发依赖 hoisting，导致子目录
 *     node_modules 不完整。因此将源码复制到系统临时目录中执行构建。
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_URL = 'https://github.com/EchoLab-Auto/ui-frame.git';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(PROJECT_ROOT, '.cache', 'ui-frame-src');
const VENDOR_DIR = path.join(PROJECT_ROOT, 'vendor', '@echolab-auto', 'ui-frame');
const VENDOR_DIST = path.join(VENDOR_DIR, 'dist');
const NODE_MODULES_DIR = path.join(PROJECT_ROOT, 'node_modules', '@echolab-auto', 'ui-frame');

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

/** 递归复制目录，排除指定名称的子目录 */
function copyDirExcluding(src, dest, exclude) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (exclude.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirExcluding(srcPath, destPath, exclude);
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
    return files.length >= 4;
  } catch {
    return false;
  }
}

/** 确保 vendor 根目录有必要的元数据文件（package.json 等），否则 file: 协议无法解析 */
function ensureVendorRootFiles() {
  for (const file of ['package.json', 'LICENSE', 'README.md']) {
    const src = path.join(CACHE_DIR, file);
    const dest = path.join(VENDOR_DIR, file);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.mkdirSync(VENDOR_DIR, { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`📋 Copied ${file} to vendor/@echolab-auto/ui-frame/`);
    }
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

/** 检查 vendor 是否完整（dist + package.json） */
function isVendorComplete() {
  return hasValidDist(VENDOR_DIST) && fs.existsSync(path.join(VENDOR_DIR, 'package.json'));
}

function main() {
  // 0. 确保缓存目录和仓库存在
  fs.mkdirSync(path.dirname(CACHE_DIR), { recursive: true });

  if (!fs.existsSync(path.join(CACHE_DIR, '.git'))) {
    console.log(`🔄 First time: cloning ${REPO_URL}...`);
    run(`git clone --depth 1 ${REPO_URL} "${CACHE_DIR}"`);
  }

  // 1. 获取远程最新版本信息
  console.log('🔍 Checking for updates from remote...');
  const fetchResult = runSilent('git fetch origin main', CACHE_DIR);
  const fetchSuccess = fetchResult !== '' || fs.existsSync(path.join(CACHE_DIR, '.git', 'FETCH_HEAD'));

  const localHash = getLocalHash();
  const remoteHash = fetchSuccess ? getRemoteHash() : '';
  const hasUpdate = fetchSuccess && remoteHash !== '' && localHash !== remoteHash;

  if (!fetchSuccess && !hasValidDist(path.join(CACHE_DIR, 'dist')) && !isVendorComplete()) {
    // 网络不可用且无本地产物，这是首次安装离线场景
    console.log('⚠️  Network unavailable and no cached build found.');
    console.log('   Please ensure network access for first-time build.');
    process.exit(1);
  }

  if (hasUpdate) {
    console.log(`⬆️  Update available: ${localHash.slice(0, 7)} → ${remoteHash.slice(0, 7)}`);
    console.log('🔄 Resetting local changes and pulling latest source...');
    run('git reset --hard HEAD', CACHE_DIR);
    run('git clean -fd', CACHE_DIR);
    run('git pull origin main', CACHE_DIR);
  } else if (fetchSuccess) {
    console.log(`✅ ui-frame source is up to date (${localHash.slice(0, 7)})`);
  } else {
    console.log('⚠️  Network unavailable, using cached source.');
  }

  const cacheDist = path.join(CACHE_DIR, 'dist');

  // 2. 判断是否需要重新构建
  const needBuild = hasUpdate || !hasValidDist(cacheDist);

  if (!needBuild && isVendorComplete()) {
    console.log('✅ @echolab-auto/ui-frame vendor already complete, nothing to do.');
    return;
  }

  if (needBuild) {
    if (hasUpdate) {
      console.log('📦 Remote updated, will rebuild.');
    } else {
      console.log('📦 Cache dist missing, will build.');
    }
  }

  // 5. 在隔离的临时目录中构建（仅在需要时）
  if (needBuild) {
    // 关键：npm install 必须脱离 workspace 根，否则依赖会被 hoist
    // 到根 node_modules 而非本地（导致 vite/vue-tsc 等 bin 找不到）。
    console.log('🔨 Building ui-frame in isolated directory...');

    const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-frame-build-'));
    try {
      // 复制源码到隔离构建目录
      // 排除 package-lock.json：它会误导 npm 认为依赖已安装
      copyDirExcluding(CACHE_DIR, buildDir, ['.git', 'node_modules', 'dist', '.cache', 'package-lock.json']);

      // 生成包含所有 deps+devDeps 的临时 package.json
      const pkgJsonPath = path.join(buildDir, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      const tempPkg = {
        name: 'ui-frame-build',
        private: true,
        type: pkg.type || 'module',
        dependencies: {
          ...(pkg.dependencies || {}),
          ...(pkg.devDependencies || {}),
        },
        overrides: {
          fsevents: false,
        },
      };
      fs.writeFileSync(pkgJsonPath, JSON.stringify(tempPkg, null, 2));

      // 安装依赖（移除 --ignore-scripts，因为可能影响 npm 解析行为）
      // 必须强制本地模式：全局安装 echo-prodoc 时，子 npm 会继承
      // npm_config_global=true，导致依赖装到全局 prefix 而非 buildDir。
      console.log('📥 Installing ui-frame dependencies...');
      run('npm install --no-audit --no-fund --global=false', buildDir, {
        env: {
          ...process.env,
          npm_config_global: 'false',
          npm_config_workspaces: 'false',
        },
      });

      // 直接使用本地 vite，避免 npx 缓存问题
      const viteBin = path.join(buildDir, 'node_modules', '.bin', 'vite');
      if (!fs.existsSync(viteBin)) {
        console.error('❌ vite not found after install. node_modules contents:');
        if (fs.existsSync(path.join(buildDir, 'node_modules'))) {
          console.error(fs.readdirSync(path.join(buildDir, 'node_modules')).slice(0, 20).join(', '));
        }
        process.exit(1);
      }
      run(`${viteBin} build && ${viteBin} build --config vite.umd.config.ts`, buildDir);

      // 复制 dist 回缓存目录
      const newDist = path.join(buildDir, 'dist');
      if (hasValidDist(newDist)) {
        fs.rmSync(cacheDist, { recursive: true, force: true });
        copyDir(newDist, cacheDist);
        console.log('✅ Build succeeded, dist cached.');
      } else {
        console.error('❌ Build produced no valid dist.');
        process.exit(1);
      }
    } finally {
      // 清理临时构建目录
      fs.rmSync(buildDir, { recursive: true, force: true });
    }
  }

  // 6. 复制到 vendor
  console.log('📋 Copying dist to vendor/@echolab-auto/ui-frame...');
  fs.rmSync(VENDOR_DIST, { recursive: true, force: true });
  copyDir(cacheDist, VENDOR_DIST);
  ensureVendorRootFiles();

  // 7. 注入 ./doc 子路径导出
  const vendorPkgPath = path.join(VENDOR_DIR, 'package.json');
  if (fs.existsSync(vendorPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(vendorPkgPath, 'utf-8'));
    if (!pkg.exports['./doc']) {
      pkg.exports['./doc'] = {
        import: './dist/doc/index.js',
        types: './dist/doc/index.d.ts',
      };
      fs.writeFileSync(vendorPkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log('📋 Injected ./doc export into ui-frame package.json');
    }
  }

  // 8. 同步到 node_modules，确保当前构建/运行能解析到最新产物
  console.log('📋 Syncing to node_modules/@echolab-auto/ui-frame...');
  fs.rmSync(NODE_MODULES_DIR, { recursive: true, force: true });
  copyDir(VENDOR_DIR, NODE_MODULES_DIR);

  console.log('\n✅ @echolab-auto/ui-frame installed successfully!');
}

main();
