import { Ref, ComputedRef } from 'vue';

export interface UseSliderOptions {
    /** v-model value — a writable Ref<number> */
    modelValue: Ref<number>;
    /** Minimum value */
    min: number;
    /** Maximum value */
    max: number;
    /** Step increment */
    step: number;
    /** Whether the slider is disabled */
    disabled?: Ref<boolean>;
    /** Whether the slider is vertical (default: false) */
    vertical?: Ref<boolean>;
}
export interface UseSliderReturn {
    /** Current slider value (computed from modelValue, clamped) */
    sliderValue: ComputedRef<number>;
    /** Value expressed as a percentage (0–100) */
    percentage: ComputedRef<number>;
    /** Programmatically set the slider value */
    setValue: (value: number) => void;
    /** Keyboard event handler */
    handleKeydown: (event: KeyboardEvent) => void;
    /** Whether the thumb is currently being dragged */
    isDragging: Ref<boolean>;
}
/**
 * Calculate a slider value from a coordinate (mouse / touch) relative to a
 * track element. The caller is responsible for providing the track rect and
 * the track size dimension.
 */
export declare function coordinateToValue(clientCoord: number, trackStart: number, trackSize: number, min: number, max: number, step: number, vertical: boolean): number;
/**
 * Headless slider — encapsulates value clamping, keyboard navigation, and
 * a drag state without any rendering. Use with your own UI.
 */
export declare function useSlider(opts: UseSliderOptions): UseSliderReturn;
