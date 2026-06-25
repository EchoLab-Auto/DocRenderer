import { Component } from 'vue';
import { NeumorphismGlobalConfig } from '../composables/useConfig';

/**
 * Map of component names to component definitions.
 * Keys matching library component names replace them.
 * New keys register additional components.
 */
export interface ComponentOverrides {
    [componentName: string]: Component;
}
/**
 * Extended plugin options for app.use().
 *
 * @example Legacy format (still supported)
 * ```ts
 * app.use(NeumorphismUI, { button: { size: 'large' } })
 * ```
 *
 * @example New structured format
 * ```ts
 * app.use(NeumorphismUI, {
 *   config: { button: { size: 'large' } },
 *   components: { NeumorphismButton: MyCustomButton },
 *   prefix: 'App',
 * })
 * ```
 */
export interface NeumorphismPluginOptions {
    /**
     * Global default props for all library components.
     * Same shape as the legacy second argument to app.use().
     */
    config?: NeumorphismGlobalConfig;
    /**
     * Override existing library components or register new ones.
     * Keys matching library component names replace those components globally.
     * New keys are registered as additional global components.
     */
    components?: ComponentOverrides;
    /**
     * Optional prefix prepended to all registered component tag names.
     * `prefix: 'App'` registers `<AppNeumorphismButton>` instead of `<NeumorphismButton>`.
     */
    prefix?: string;
}
/**
 * Type helper to merge a custom config section into the global config type.
 *
 * @example
 * ```ts
 * interface MyWidgetConfig { myWidget?: { color?: string; size?: 'sm' | 'lg' } }
 * type MyFullConfig = ExtendedConfig<MyWidgetConfig>
 * ```
 */
export type ExtendedConfig<T extends Record<string, unknown>> = NeumorphismGlobalConfig & T;
