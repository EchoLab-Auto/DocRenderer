/**
 * Generate a unique ID string
 */
export declare function generateId(prefix?: string): string;
/**
 * Debounce function with a cancel method
 */
export declare function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export declare function isEmpty(value: unknown): boolean;
