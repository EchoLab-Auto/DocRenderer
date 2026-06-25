#!/usr/bin/env bash
#
# 发布 @echolab-auto/echo-prodoc 到 npm registry
#
# 用法：
#   bash scripts/publish.sh
#
# 脚本会提示输入 npm token（用于绕过 2FA），token 仅存在临时文件中，
# 发布完成后自动删除，不会写入 ~/.npmrc。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "============================================"
echo "  发布 @echolab-auto/echo-prodoc 到 npm"
echo "============================================"
echo ""

# 1. 提示输入 token（隐藏回显）
echo "📎 请输入 npm Granular Access Token（需开启 2FA bypass + @echolab-auto 读写权限）："
read -rsp "Token: " NPM_TOKEN
echo ""
echo ""

if [[ -z "$NPM_TOKEN" ]]; then
  echo "❌ Token 不能为空，已取消发布。"
  exit 1
fi

# 2. 校验 token 格式
if [[ ! "$NPM_TOKEN" =~ ^npm_ ]]; then
  echo "⚠️  Token 格式可能不正确（通常以 npm_ 开头），是否继续？(y/N)"
  read -r confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "已取消发布。"
    exit 0
  fi
fi

# 3. 创建临时 npm 配置
NPM_CONFIG_FILE="$(mktemp)"
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > "$NPM_CONFIG_FILE"

# 4. 发布
echo ""
echo "🚀 开始发布..."

if NPM_CONFIG_USERCONFIG="$NPM_CONFIG_FILE" npm publish --access public --registry https://registry.npmjs.org/; then
  echo ""
  echo "✅ 发布成功！"
  echo ""
  echo "   用户现在可以安装："
  echo "   npm install -g @echolab-auto/echo-prodoc"
else
  echo ""
  echo "❌ 发布失败，请检查 token 权限（需开启 2FA bypass + @echolab-auto 读写权限）。"
fi

# 5. 清理临时文件
rm -f "$NPM_CONFIG_FILE"
echo ""
echo "🧹 临时 token 配置已清理。"
