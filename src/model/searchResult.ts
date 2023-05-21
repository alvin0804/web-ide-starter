import { IItemProps as IListItemProps } from "mo/components";

export interface IHistoryItem extends IListItemProps {
  title:  string;
}

export interface ISearchResult {
  // 查询历史记录列表
  historyList: IHistoryItem[];
  // 当前展示的历史记录项
  historyCurrent: IHistoryItem;
  // 当前的查询日志数据
  currentLogger: any;
  // 当前的查询结果数据
  currentTable: any
}


export class SearchResultModel implements ISearchResult {
  public historyList: IHistoryItem[];
  public historyCurrent: IHistoryItem;
  public currentLogger: any;
  public currentTable: any;

  constructor(
    historyList: IHistoryItem[] = [],
    historyCurrent: IHistoryItem,
    currentLogger: any,
    currentTable: any
  ) {
    this.historyList = historyList;
    this.historyCurrent = historyCurrent;
    this.currentLogger = currentLogger;
    this.currentTable = currentTable;
  }
} 