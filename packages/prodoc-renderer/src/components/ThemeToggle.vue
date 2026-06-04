<script setup lang="ts">
/**
 * 三态主题切换组件（替代已移除的 NeumorphismThemeToggle）
 *
 * light / dark / auto 三种模式，配合 ThemeProvider 使用。
 */
import { useTheme } from '@echolab/ui-frame'

const { theme, setTheme } = useTheme()

const options = [
  { value: 'light' as const, label: '☀️', title: '亮色' },
  { value: 'dark' as const, label: '🌙', title: '暗色' },
  { value: 'auto' as const, label: '💻', title: '自动' },
]
</script>

<template>
  <div class="theme-toggle" role="radiogroup" aria-label="主题切换">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="theme-toggle__btn"
      :class="{ 'theme-toggle__btn--active': theme === opt.value }"
      :aria-pressed="theme === opt.value"
      :title="opt.title"
      @click="setTheme(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--nm-border-radius-md);
  background-color: var(--nm-surface-color);
  box-shadow: inset 3px 3px 6px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light);
}

.theme-toggle__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--nm-border-radius-sm);
  font-size: 14px;
  background: transparent;
  color: var(--nm-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle__btn:hover {
  color: var(--nm-text-primary);
}

.theme-toggle__btn--active {
  background-color: var(--nm-surface-raised);
  box-shadow: 2px 2px 5px var(--nm-shadow-dark), -1px -1px 3px var(--nm-shadow-light);
  color: var(--nm-primary-color);
}
</style>
