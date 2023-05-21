import { HTMLElementProps, UniqueId } from "mo/common/types";
import { IActionBarItemProps, IMenuItemProps } from "mo/components";
import { ReactNode } from "react";

export enum HistoryEvent {
  onSearch = 'search.onSearch',
  onChange = 'history.onChange',
  onResultClick = 'search.onResultClick',
}

// 历史列表右键列表
export interface IHistoryMenuItemProps extends IMenuItemProps {
  id: UniqueId;
}

export interface IHistoryItem extends HTMLElementProps {
  id?: UniqueId;

  icon?: string | JSX.Element;
  name?: ReactNode;
  timestamp?: ReactNode;

  sortIndex?: number;
  contextMenu?: IHistoryMenuItemProps[];
  render?: () => ReactNode | JSX.Element;
}

export interface IHistoryProps {
  headerToolBar?: IActionBarItemProps[];

  searchAddons?: IActionBarItemProps[];
  value?: string;
  selected?: UniqueId;

  data?: IHistoryItem[];

  isRegex: boolean;
  isCaseSensitive: boolean;
  isWholeWords: boolean;
  preserveCase: boolean;
}


export class HistoryModel implements IHistoryProps {

  public headerToolBar?: IActionBarItemProps[];
  public searchAddons?: IActionBarItemProps[];
  public value?: string;
  public selected?: UniqueId;
  public data?: IHistoryItem[];
  public isRegex: boolean = false;
  public isCaseSensitive: boolean = false;
  public isWholeWords: boolean = false;
  public preserveCase: boolean = false;

  constructor(
    headerToolBar: IActionBarItemProps[] = [],
    searchAddons: IActionBarItemProps[] = [],
    value: string = '',
    selected: string = '',
    data: IHistoryItem[] = [],
    isCaseSensitive = false,
    isWholeWords = false,
    isRegex = false,
    preserveCase = false,
  ) {
    this.headerToolBar = headerToolBar;
    this.searchAddons = searchAddons;
    this.value = value;
    this.selected = selected;
    this.data = data;

    this.isCaseSensitive = isCaseSensitive;
    this.isWholeWords = isWholeWords;
    this.isRegex = isRegex;
    this.preserveCase = preserveCase;
  }
}