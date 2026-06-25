import { SelectOption } from '../../composables/useSelect';

export type { SelectOption as NeumorphismSelectOption };
export interface NeumorphismSelectProps {
    modelValue?: string | number;
    options?: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    label?: string;
    required?: boolean;
    error?: string | boolean;
    name?: string;
    id?: string;
    clearable?: boolean;
    emptyText?: string;
    clearLabel?: string;
    listLabel?: string;
}
declare function __VLS_template(): {
    value?(_: {
        option: SelectOption | undefined;
    }): any;
    option?(_: {
        key: string | number;
        option: SelectOption;
        selected: boolean;
        index: number;
        select: (option: SelectOption) => void;
    }): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismSelectProps>, {
    modelValue: string;
    options: () => never[];
    placeholder: string;
    disabled: boolean;
    size: string;
    clearable: boolean;
    emptyText: string;
    clearLabel: string;
    listLabel: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string | number) => void;
    change: (value: string | number) => void;
    focus: (event: FocusEvent) => void;
    blur: (event: FocusEvent) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismSelectProps>, {
    modelValue: string;
    options: () => never[];
    placeholder: string;
    disabled: boolean;
    size: string;
    clearable: boolean;
    emptyText: string;
    clearLabel: string;
    listLabel: string;
}>>> & Readonly<{
    onFocus?: ((event: FocusEvent) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | number) => any) | undefined;
    onChange?: ((value: string | number) => any) | undefined;
}>, {
    listLabel: string;
    size: "small" | "medium" | "large";
    disabled: boolean;
    placeholder: string;
    modelValue: string | number;
    options: SelectOption[];
    clearable: boolean;
    emptyText: string;
    clearLabel: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
