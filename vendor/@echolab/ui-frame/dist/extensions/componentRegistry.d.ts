import { Component, App } from 'vue';

/**
 * Runtime component registry that maps component names to implementations.
 *
 * Supports:
 * - Registering or replacing components via `register()`
 * - Looking up components via `get()` / `has()`
 * - Bulk-installing onto a Vue App via `install(app, prefix?)`
 *
 * @example
 * ```ts
 * const registry = new ComponentRegistry()
 * registry
 *   .register('NeumorphismButton', MyCustomButton)
 *   .register('MyWidget', MyWidget)
 * registry.install(app, 'App')
 * ```
 */
export declare class ComponentRegistry {
    private _map;
    constructor(entries?: Iterable<readonly [string, Component]>);
    /** Register or replace a component. Returns `this` for chaining. */
    register(name: string, component: Component): this;
    /** Retrieve a registered component by name. */
    get(name: string): Component | undefined;
    /** Check if a component name is registered. */
    has(name: string): boolean;
    /** Delete a registered component. Returns true if it existed. */
    remove(name: string): boolean;
    /** Number of registered components. */
    get size(): number;
    /** Iterate all [name, component] entries. */
    entries(): IterableIterator<[string, Component]>;
    /** Iterate all component names. */
    names(): IterableIterator<string>;
    /** Register all components onto a Vue App instance. */
    install(app: App, prefix?: string): this;
}
