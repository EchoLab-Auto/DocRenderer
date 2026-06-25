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

/** 获取本地 HEAD commit hash */
function getLocalHash() {
  return runSilent('git rev-parse HEAD', CACHE_DIR);
}

/** 获取远程 origin/main commit hash */
function getRemoteHash() {
  return runSilent('git rev-parse origin/main', CACHE_DIR);
}

function main() {
  // 0. 若目标 dist 已存在且有效（例如从发布包安装时已携带构建产物），直接跳过
  // 避免在全局安装/离线场景下无意义地触发 git clone 和网络请求
  if (hasValidDist(TARGET_DIST)) {
    console.log('✅ @echolab/ui-frame dist already exists, nothing to do.');
    console.log('   To force rebuild: rm -rf node_modules/@echolab/ui-frame/dist && npm run build:ui-frame');
    return;
  }

  // 1. 确保缓存目录存在
  fs.mkdirSync(path.dirname(CACHE_DIR), { recursive: true });

  // 2. 克隆或准备现有仓库
  if (!fs.existsSync(path.join(CACHE_DIR, '.git'))) {
    console.log(`🔄 First time: cloning ${REPO_URL}...`);
    run(`git clone --depth 1 ${REPO_URL} "${CACHE_DIR}"`);
  }

  // 3. 获取远程最新版本信息
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
  const needBuild = hasUpdate || !hasValidDist(cacheDist);

  if (!needBuild) {
    console.log('✅ @echolab/ui-frame source is up to date.');
  } else if (hasUpdate) {
    console.log('📦 Remote updated, will rebuild.');
  } else if (!hasValidDist(cacheDist)) {
    console.log('📦 Cache dist missing, will build.');
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
      };
      fs.writeFileSync(pkgJsonPath, JSON.stringify(tempPkg, null, 2));

      // 安装依赖（移除 --ignore-scripts，因为可能影响 npm 解析行为）
      // 必须强制本地模式：全局安装 echo-prodoc 时，子 npm 会继承
      // npm_config_global=true，导致依赖装到全局 prefix 而非 buildDir。
      console.log('📥 Installing ui-frame dependencies...');
      run('npm install --no-audit --no-fund --no-optional --global=false', buildDir, {
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

  // 6. 复制到 node_modules
  console.log('📋 Copying dist to node_modules...');
  fs.rmSync(TARGET_DIST, { recursive: true, force: true });
  copyDir(cacheDist, TARGET_DIST);

  // 7. 注入 ./doc 子路径导出
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
