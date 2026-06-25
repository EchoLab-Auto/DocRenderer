export type ProgressVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export interface NeumorphismProgressProps {
    modelValue?: number;
    max?: number;
    variant?: ProgressVariant;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
    indeterminate?: boolean;
    striped?: boolean;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismProgressProps>, {
    modelValue: number;
    max: number;
    variant: string;
    size: string;
    showLabel: boolean;
    indeterminate: boolean;
    striped: boolean;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismProgressProps>, {
    modelValue: number;
    max: number;
    variant: string;
    size: string;
    showLabel: boolean;
    indeterminate: boolean;
    striped: boolean;
}>>> & Readonly<{}>, {
    size: "small" | "medium" | "large";
    max: number;
    modelValue: number;
    indeterminate: boolean;
    variant: ProgressVariant;
    showLabel: boolean;
    striped: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
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
