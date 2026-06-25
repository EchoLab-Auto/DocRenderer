import { TooltipPosition, TooltipTrigger } from '../../composables/useTooltip';

export type { TooltipPosition, TooltipTrigger };
export interface NeumorphismTooltipProps {
    content?: string;
    position?: TooltipPosition;
    trigger?: TooltipTrigger;
    disabled?: boolean;
    offset?: number;
    delay?: number;
}
declare function __VLS_template(): {
    default?(_: {}): any;
    content?(_: {}): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismTooltipProps>, {
    position: string;
    trigger: string;
    disabled: boolean;
    offset: number;
    delay: number;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismTooltipProps>, {
    position: string;
    trigger: string;
    disabled: boolean;
    offset: number;
    delay: number;
}>>> & Readonly<{}>, {
    disabled: boolean;
    position: TooltipPosition;
    trigger: TooltipTrigger;
    offset: number;
    delay: number;
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
