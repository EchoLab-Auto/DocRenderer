import { App } from 'vue';
import { NeumorphismGlobalConfig } from './composables/useConfig';
import { NeumorphismPluginOptions } from './extensions/types';

export * from './components';
export type * from './components';
export { useTheme, provideTheme, createTheme } from './composables/useTheme';
export type { Theme, ThemeOptions, ThemeContext } from './composables/useTheme';
export { useSelect } from './composables/useSelect';
export type { UseSelectOptions, UseSelectReturn, SelectOption } from './composables/useSelect';
export { useTabs } from './composables/useTabs';
export type { UseTabsOptions, UseTabsReturn, TabItem as HeadlessTabItem, } from './composables/useTabs';
export { usePagination } from './composables/usePagination';
export type { UsePaginationOptions, UsePaginationReturn } from './composables/usePagination';
export { useTree } from './composables/useTree';
export type { UseTreeOptions, UseTreeReturn, TreeNodeData as HeadlessTreeNodeData, } from './composables/useTree';
export { useTable } from './composables/useTable';
export type { UseTableOptions, UseTableReturn, TableColumn, SortDirection, SortState, SelectionMode, } from './composables/useTable';
export { useCollapse } from './composables/useCollapse';
export type { UseCollapseOptions, UseCollapseReturn, CollapseItem as HeadlessCollapseItem, } from './composables/useCollapse';
export { useModal } from './composables/useModal';
export type { UseModalOptions, UseModalReturn } from './composables/useModal';
export { useToast } from './composables/useToast';
export type { UseToastOptions, UseToastReturn, ToastOptions as HeadlessToastOptions, ToastItem as HeadlessToastItem, ToastType as HeadlessToastType, ToastPosition as HeadlessToastPosition, } from './composables/useToast';
export { useAlert } from './composables/useAlert';
export type { UseAlertOptions, UseAlertReturn, AlertType as HeadlessAlertType, } from './composables/useAlert';
export { useTooltip } from './composables/useTooltip';
export type { UseTooltipOptions, UseTooltipReturn, TooltipPosition as HeadlessTooltipPosition, TooltipTrigger as HeadlessTooltipTrigger, } from './composables/useTooltip';
export { useTouchDevice } from './composables/useTouchDevice';
export { useCheckable } from './composables/useCheckable';
export type { UseCheckableOptions } from './composables/useCheckable';
export { useFormField } from './composables/useFormField';
export type { FormFieldConfig, FieldSize } from './composables/useFormField';
export { useSlider } from './composables/useSlider';
export type { UseSliderOptions, UseSliderReturn } from './composables/useSlider';
export { useNumberInput } from './composables/useNumberInput';
export type { UseNumberInputOptions, UseNumberInputReturn } from './composables/useNumberInput';
export { usePopover } from './composables/usePopover';
export type { UsePopoverOptions, UsePopoverReturn, PopoverPosition, PopoverTrigger, } from './composables/usePopover';
export { useSteps } from './composables/useSteps';
export type { UseStepsOptions, UseStepsReturn, StepItem as HeadlessStepItem, StepStatus as HeadlessStepStatus, } from './composables/useSteps';
export { useDrawer } from './composables/useDrawer';
export type { UseDrawerOptions, UseDrawerReturn, DrawerPosition } from './composables/useDrawer';
export { useMenu } from './composables/useMenu';
export type { UseMenuOptions, UseMenuReturn, MenuItem as HeadlessMenuItem, } from './composables/useMenu';
export { useVirtualList } from './composables/useVirtualList';
export type { UseVirtualListOptions, UseVirtualListReturn } from './composables/useVirtualList';
export { useDatePicker } from './composables/useDatePicker';
export type { UseDatePickerOptions, UseDatePickerReturn, DayCell, } from './composables/useDatePicker';
export { useUpload } from './composables/useUpload';
export type { UseUploadOptions, UseUploadReturn, UploadFile, UploadStatus, } from './composables/useUpload';
export { useAutoComplete } from './composables/useAutoComplete';
export type { AutoCompleteOption, UseAutoCompleteOptions, UseAutoCompleteReturn, } from './composables/useAutoComplete';
export { validateFieldValue } from './composables/useFormValidation';
export type { FormRule as HeadlessFormRule } from './composables/useFormValidation';
export { useLocale, provideLocale, getLocaleMessages, LocaleKey } from './composables/useLocale';
export type { LocaleMessages, Locale } from './locales';
export { zhCN, enUS } from './locales';
export { generateId, debounce, isEmpty } from './utils';
export { useConfig, ConfigKey } from './composables/useConfig';
export type { NeumorphismGlobalConfig } from './composables/useConfig';
export { ComponentRegistry } from './extensions/componentRegistry';
export { useNeumorphismSetup } from './extensions/createComponent';
export type { NeumorphismSetupContext } from './extensions/createComponent';
export type { ComponentOverrides, NeumorphismPluginOptions, ExtendedConfig, } from './extensions/types';
export { RadioGroupKey, FormKey, RowGutterKey } from './composables/injectionKeys';
export type { RadioGroupContext, FormContext, RowGutterContext } from './composables/injectionKeys';
/**
 * Register all built-in components plus any consumer-provided overrides.
 *
 * Supports both legacy and new plugin option formats:
 * - `app.use(NeumorphismUI, { button: { size: 'large' } })`   (legacy, unchanged)
 * - `app.use(NeumorphismUI, { config: {...}, components: {...}, prefix: 'X' })`   (new)
 */
export declare function install(app: App, options?: NeumorphismGlobalConfig | NeumorphismPluginOptions): void;
declare const _default: {
    install: typeof install;
    version: string;
};
export default _default;
