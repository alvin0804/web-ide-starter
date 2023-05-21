import { getBEMElement, prefixClaName } from "mo/common/className";


export const defaultSearchResultClassName = prefixClaName("searchResult");

export const searchResultCardClasaName = getBEMElement(defaultSearchResultClassName, 'card')
export const searchResultCardHeaderClassName = getBEMElement(defaultSearchResultClassName, 'card-header')
export const searchResultCardTabClassName = getBEMElement(defaultSearchResultClassName, 'card-tabs')
export const searchResultCardExtraClassName = getBEMElement(defaultSearchResultClassName, 'card-extra')
export const searchResultCardExtraItemClassName = getBEMElement(defaultSearchResultClassName, 'card-extra-item')
export const searchResultCardContentClassName = getBEMElement(defaultSearchResultClassName, 'card-content')

export const searchResultListClasaName = getBEMElement(defaultSearchResultClassName, 'list')
export const searchResultListHeaderClasaName = getBEMElement(defaultSearchResultClassName, 'list-header')
export const searchResultListContentClasaName = getBEMElement(defaultSearchResultClassName, 'list-content')

export const searchTableWrapperClassName = getBEMElement(defaultSearchResultClassName, 'table-wrapper');
export const searchLoggerWrapperClassName = getBEMElement(defaultSearchResultClassName, 'logger_wrapper');


// export const cardClassName = getBEMElement(defaultSearchResultClassName, 'card')
// export const cardHeaderClassName = getBEMElement(defaultSearchResultClassName, 'card-header')
// export const cardHeaderTabsClassName = getBEMElement(defaultSearchResultClassName, 'card-tabs')
// export const cardHeaderExtraInfoClassName = getBEMElement(defaultSearchResultClassName, 'card-extra')
// // export const cardHeaderExtraInfoWrapperClassName = getBEMElement(cardClassName, 'header-extra-wrapper')
// export const cardHeaderExtraInfoItemClassName = getBEMElement(cardHeaderExtraInfoClassName, 'card-extra-item')
// // export const cardHeaderExtraInfoItemBtnClassName = getBEMElement(cardHeaderExtraInfoClassName, 'item-btn')


// export const cardContentClassName = getBEMElement(cardClassName, 'content')