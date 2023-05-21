import { getBEMElement, prefixClaName } from "mo/common/className";

export const defaultSearchInputClassName = prefixClaName('search-input');


export const validationBaseSearchInputClassName = getBEMElement(
  defaultSearchInputClassName,
  'base'
);

export const validationInfoSearchInputClassName = getBEMElement(defaultSearchInputClassName, 'info');
export const validationWarningSearchInputClassName = getBEMElement(defaultSearchInputClassName, 'warning');
export const validationErrorSearchInputClassName = getBEMElement(defaultSearchInputClassName, 'error');

export const searchInputToolBarClassName = getBEMElement(
  defaultSearchInputClassName,
  'toolbar'
);
