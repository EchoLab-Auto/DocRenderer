/**
 * Locale message keys used across the component library.
 * All messages are flat strings (no nested objects) for easy overriding.
 */
export interface LocaleMessages {
    /** Badge */
    badgeOnline?: string;
    badgeUnread?: string;
    badgeAvatar?: string;
    /** Skeleton */
    skeletonLoading?: string;
    /** ThemeToggle */
    themeToggleLight?: string;
    themeToggleAuto?: string;
    themeToggleDark?: string;
    themeToggleLabel?: string;
    /** Canvas */
    canvasZoomOut?: string;
    canvasZoomIn?: string;
    canvasZoomReset?: string;
    /** Tree */
    treeExpandAll?: string;
    treeCollapseAll?: string;
    treeSearchPlaceholder?: string;
    treeEmpty?: string;
    treeClearSearch?: string;
    treeExpand?: string;
    treeCollapse?: string;
    treeLabel?: string;
    /** Table */
    tableLoading?: string;
    tableEmpty?: string;
    /** Select */
    selectPlaceholder?: string;
    selectEmpty?: string;
    selectClear?: string;
    selectListLabel?: string;
    /** Modal */
    modalClose?: string;
    modalCancel?: string;
    modalConfirm?: string;
    /** Pagination */
    paginationPrev?: string;
    paginationNext?: string;
    paginationTotal?: string;
    paginationLabel?: string;
    paginationPageLabel?: string;
    /** Toast */
    toastClose?: string;
    /** Tabs */
    tabsNavLabel?: string;
    /** Alert */
    alertClose?: string;
    /** Tag */
    tagClose?: string;
    /** Layout */
    layoutExpandSider?: string;
    layoutCollapseSider?: string;
    /** Breadcrumb */
    breadcrumbLabel?: string;
    /** Form validation */
    formRequired?: string;
    formMinLength?: string;
    formMaxLength?: string;
    formPattern?: string;
    formMin?: string;
    formMax?: string;
    formValidator?: string;
    /** Progress */
    progressLabel?: string;
    /** DatePicker */
    datePickerPlaceholder?: string;
    datePickerClear?: string;
    datePickerToday?: string;
    datePickerPrevMonth?: string;
    datePickerNextMonth?: string;
    datePickerPrevYear?: string;
    datePickerNextYear?: string;
    /** Upload */
    uploadSelectFile?: string;
    uploadDropFile?: string;
    uploadRemove?: string;
    uploadPreview?: string;
    /** List */
    listLoading?: string;
    listEmpty?: string;
    listLabel?: string;
}
export type Locale = 'zh-CN' | 'en-US';
