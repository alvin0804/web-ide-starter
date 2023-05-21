import {
    getBEMElement,
    getBEMModifier,
    prefixClaName,
} from 'mo/common/className';

export const defaultEditorClassName = prefixClaName('editor');
export const groupClassName = getBEMElement(defaultEditorClassName, 'group');
export const groupContainerClassName = getBEMElement(
    defaultEditorClassName,
    'group-container'
);
export const groupContrinerNoHandlerAreaClassName = getBEMElement(
    defaultEditorClassName,
    'group-container-no-handler-area'
)
export const groupHeaderClassName = getBEMElement(
    defaultEditorClassName,
    'group-header'
);
export const groupTabsClassName = getBEMElement(
    defaultEditorClassName,
    'group-tabs'
);
export const groupActionsClassName = getBEMElement(
    defaultEditorClassName,
    'group-actions'
);
export const groupActionsItemClassName = getBEMElement(
    defaultEditorClassName,
    'group-actions-item'
);

export const groupActionItemDisabledClassName = getBEMModifier(
    groupActionsItemClassName,
    'disabled'
);

export const groupBreadcrumbClassName = getBEMElement(
    defaultEditorClassName,
    'group-breadcrumb'
);




export const groupHandlerClassName = getBEMElement(
    defaultEditorClassName,
    'group-handler'
);
export const groupHandlersLockClassName = getBEMElement(groupHandlerClassName, 'lock')
export const groupHandlerItemClassName = getBEMElement(
    defaultEditorClassName,
    'group-handler-item'
);
export const groupHandlerItemLockClassName = getBEMElement(
    groupHandlerItemClassName,
    "lock"
)
export const groupHandlerItemLockShowClassName = getBEMElement(
    groupHandlerItemClassName,
    "lock-show"
)
export const groupHandlerItemInnderClassName = getBEMElement(groupHandlerItemClassName, 'inner')
export const groupHandlerLeftClassName = getBEMElement(
    defaultEditorClassName,
    'group-handler-left-area',
)
export const groupHandlerRightClassName = getBEMElement(
    defaultEditorClassName,
    'group-handler-right-area'
)