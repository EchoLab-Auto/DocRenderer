export interface NeumorphismCanvasProps {
    /** Current zoom level (1 = 100%) */
    modelValue?: number;
    /** Minimum zoom level */
    minZoom?: number;
    /** Maximum zoom level */
    maxZoom?: number;
    /** Zoom step for +/- buttons */
    zoomStep?: number;
    /** Whether to show the grid background */
    showGrid?: boolean;
    /** Grid cell size in pixels (before zoom) */
    gridSize?: number;
    /** Whether to show zoom controls */
    showControls?: boolean;
    /** Canvas width (CSS value, e.g. '100%', '800px') */
    width?: string;
    /** Canvas height (CSS value) */
    height?: string;
}
declare function __VLS_template(): {
    toolbar?(_: {}): any;
    default?(_: {}): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismCanvasProps>, {
    modelValue: number;
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    showGrid: boolean;
    gridSize: number;
    showControls: boolean;
    width: string;
    height: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: number) => void;
    "zoom-change": (value: number) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<NeumorphismCanvasProps>, {
    modelValue: number;
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    showGrid: boolean;
    gridSize: number;
    showControls: boolean;
    width: string;
    height: string;
}>>> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
    "onZoom-change"?: ((value: number) => any) | undefined;
}>, {
    width: string;
    height: string;
    modelValue: number;
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    showGrid: boolean;
    gridSize: number;
    showControls: boolean;
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
