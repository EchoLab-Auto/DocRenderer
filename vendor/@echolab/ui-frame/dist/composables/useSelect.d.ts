import { Ref, ComputedRef } from 'vue';

export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
export interface UseSelectOptions {
    /** v-model value */
    modelValue: Ref<string | number | undefined>;
    /** Available options */
    options: Ref<SelectOption[]> | ComputedRef<SelectOption[]>;
    /** Whether the select is disabled */
    disabled?: Ref<boolean>;
}
export interface UseSelectReturn {
    isOpen: Ref<boolean>;
    selectedOption: ComputedRef<SelectOption | undefined>;
    toggleOpen: () => void;
    close: () => void;
    selectOption: (option: SelectOption) => void;
    clearValue: (value?: string | number) => void;
    handleKeydown: (event: KeyboardEvent) => void;
    handleBlur: (relatedTarget: EventTarget | null, currentTarget: HTMLElement) => void;
}
/**
 * Headless select — encapsulates open/close, keyboard navigation, and
 * option selection logic without any rendering. Use with your own UI.
 */
export declare function useSelect(opts: UseSelectOptions): UseSelectReturn;
