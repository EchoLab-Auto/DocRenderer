import { ComputedRef, InjectionKey } from 'vue';

export interface NeumorphismGlobalConfig {
    /** Default button props applied to all NeumorphismButton instances */
    button?: {
        variant?: 'raised' | 'flat' | 'pressed';
        size?: 'small' | 'medium' | 'large';
        shape?: 'rounded' | 'pill' | 'circle';
    };
    /** Default input props applied to all NeumorphismInput instances */
    input?: {
        size?: 'small' | 'medium' | 'large';
    };
    /** Default date picker props */
    datePicker?: {
        size?: 'small' | 'medium' | 'large';
        format?: string;
        clearable?: boolean;
        firstDayOfWeek?: number;
        placeholder?: string;
    };
    /** Default select props */
    select?: {
        size?: 'small' | 'medium' | 'large';
        clearable?: boolean;
        emptyText?: string;
        placeholder?: string;
    };
    /** Default modal props */
    modal?: {
        size?: 'small' | 'medium' | 'large';
        maskClosable?: boolean;
        closable?: boolean;
        showClose?: boolean;
        destroyOnClose?: boolean;
    };
    /** Default toast props */
    toast?: {
        position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
        maxCount?: number;
    };
    /** Default tooltip props */
    tooltip?: {
        position?: 'top' | 'bottom' | 'left' | 'right';
        trigger?: 'hover' | 'click' | 'focus';
        offset?: number;
        delay?: number;
    };
    /** Default tabs props */
    tabs?: {
        position?: 'top' | 'left' | 'right';
        size?: 'small' | 'medium' | 'large';
    };
    /** Default pagination props */
    pagination?: {
        size?: 'small' | 'medium' | 'large';
        showTotal?: boolean;
        showJumper?: boolean;
        maxVisiblePages?: number;
        pageSize?: number;
    };
    /** Default collapse props */
    collapse?: {
        size?: 'small' | 'medium' | 'large';
        accordion?: boolean;
    };
    /** Default form props */
    form?: {
        size?: 'small' | 'medium' | 'large';
        labelWidth?: string;
        direction?: 'horizontal' | 'vertical';
    };
    /** Default tag props */
    tag?: {
        variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
        size?: 'small' | 'medium' | 'large';
        rounded?: boolean;
    };
    /** Default progress props */
    progress?: {
        variant?: 'primary' | 'success' | 'warning' | 'error';
        size?: 'small' | 'medium' | 'large';
        showLabel?: boolean;
    };
    /** Default avatar props */
    avatar?: {
        size?: 'small' | 'medium' | 'large';
        shape?: 'circle' | 'rounded';
    };
    /** Default tree props */
    tree?: {
        showSearch?: boolean;
        multiple?: boolean;
        searchPlaceholder?: string;
    };
    /** Default switch props */
    switch?: {
        size?: 'small' | 'medium' | 'large';
    };
    /** Default table props */
    table?: {
        size?: 'small' | 'medium' | 'large';
        striped?: boolean;
        hoverable?: boolean;
    };
    /** Default card props */
    card?: {
        radius?: 'small' | 'medium' | 'large' | 'xl';
        hoverable?: boolean | 'bulge' | 'sink';
    };
    /** Default badge props */
    badge?: {
        max?: number;
        dot?: boolean;
        showZero?: boolean;
    };
    /** Default breadcrumb props */
    breadcrumb?: {
        size?: 'small' | 'medium' | 'large';
        separator?: string;
    };
    /** Default checkbox props */
    checkbox?: {
        size?: 'small' | 'medium' | 'large';
    };
    /** Default radio props */
    radio?: {
        size?: 'small' | 'medium' | 'large';
    };
    /** Default radio group props */
    radioGroup?: {
        size?: 'small' | 'medium' | 'large';
        direction?: 'horizontal' | 'vertical';
    };
    /** Default textarea props */
    textarea?: {
        size?: 'small' | 'medium' | 'large';
        rows?: number;
        autoResize?: boolean;
        showCount?: boolean;
    };
    /** Default divider props */
    divider?: {
        direction?: 'horizontal' | 'vertical';
        align?: 'left' | 'center' | 'right';
        dashed?: boolean;
        inset?: boolean;
    };
    /** Default container props */
    container?: {
        mode?: 'fixed' | 'fluid';
        noPadding?: boolean;
    };
    /** Default layout props */
    layout?: {
        showHeader?: boolean;
        showSider?: boolean;
        siderWidth?: number;
        collapsible?: boolean;
        collapsedWidth?: number;
        mobileAutoCollapse?: boolean;
    };
    /** Default theme toggle props */
    themeToggle?: {
        size?: 'small' | 'medium' | 'large';
        disableAuto?: boolean;
    };
    /** Default canvas props */
    canvas?: {
        showGrid?: boolean;
        gridSize?: number;
        showControls?: boolean;
    };
    /** Default skeleton props */
    skeleton?: {
        variant?: 'text' | 'circle' | 'rect';
        animation?: 'pulse' | 'wave' | 'none';
    };
    /** Default grid props */
    grid?: {
        gutter?: number | [number, number];
        justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
        align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
        wrap?: boolean;
    };
    /** Default field props */
    field?: {
        labelWidth?: string;
    };
    /** Default slider props */
    slider?: {
        size?: 'small' | 'medium' | 'large';
        showTooltip?: boolean;
        showStops?: boolean;
    };
    /** Default steps props */
    steps?: {
        direction?: 'horizontal' | 'vertical';
        size?: 'small' | 'medium' | 'large';
        center?: boolean;
    };
    /** Default upload props */
    upload?: {
        size?: 'small' | 'medium' | 'large';
        drag?: boolean;
        showUploadList?: boolean;
        listType?: 'text' | 'picture' | 'picture-card';
        autoUpload?: boolean;
    };
    /** Default list props */
    list?: {
        bordered?: boolean;
        split?: boolean;
        size?: 'small' | 'medium' | 'large';
        hoverable?: boolean;
    };
    /** Locale configuration */
    locale?: 'zh-CN' | 'en-US';
    /** Custom locale messages (overrides built-in locale) */
    localeMessages?: import('../locales/types').LocaleMessages;
    /** Default theme config */
    theme?: {
        defaultTheme?: 'light' | 'dark' | 'auto';
        storageKey?: string;
        followSystem?: boolean;
    };
    /** Whether to use RTL (right-to-left) direction */
    rtl?: boolean;
    /** Extension: consumers can add custom component config sections. */
    [configSection: string]: unknown;
}
export declare const ConfigKey: InjectionKey<ComputedRef<NeumorphismGlobalConfig>>;
/**
 * Returns the global config merged with component-level defaults.
 * Components should use this to resolve their props.
 *
 * @example
 * ```ts
 * const config = useConfig()
 * const size = props.size ?? config.value.button?.size ?? 'medium'
 * ```
 */
export declare function useConfig(): ComputedRef<NeumorphismGlobalConfig>;
