import { UniqueId } from "mo/common/types";
import { ITabProps } from "mo/components";




interface T {
  tab: {
    results: [
      {
        id: string
        name: string
        loggerKey: string
        tableKey: string
        currentKey: string
        status: ResultStatusType;
        times: string;
        count: string;
      }
    ]
  }
}

export enum CardTabTypes {
  logger = 'logger',
  table = 'table'
}
export type CardTabType = keyof typeof CardTabTypes;

export enum ResultStatusTypes {
  success= 'success',
  failed = 'failed',
  running = 'running',
  stoped = 'stoped'
}
export type ResultStatusType = keyof typeof ResultStatusTypes


export interface IExecuteListItem {
  id: UniqueId;
  name: string;

  loggerKey: string; // logger data storage key
  tableKey: string; // table data storage key
  currentKey: UniqueId; // tab key
  status: ResultStatusType;
  times: string;
  count: string;
}

export interface ICardTabItem<T = any> extends ITabProps<T> {
  title?: string;
  data?: T;
  sortIndex?: number;
}
export interface IResultCard {
  // current 和 tab 记录着card当中的【查询日志】和【查询结果】
  current?: ICardTabItem | null;
  tabs?: ICardTabItem[];

  status: ResultStatusType;
  times: string;
  count: string;
}

export interface IResultGroup {
  // editor Tab Id
  id: UniqueId;

  executeList: IExecuteListItem[];
  activeId: UniqueId;

  // 因为 currentCard 当中展示的数据过于巨大，所以在List当中记录着数据的 storageKey 
  // 在setActive 的时候，对 currentCard 的数据进行组装
  currentCard: IResultCard | null;
}

export class ResultGroupModel implements IResultGroup {

  // id 与 编辑器的TabId保持一致
  public id: UniqueId;
  public executeList: IExecuteListItem[];
  public activeId: UniqueId;
  public currentCard: IResultCard;

  constructor(
    id: UniqueId,
    executeList: IExecuteListItem[] = [],
    activeId: UniqueId = '',
    currentCard: IResultCard = null
  ) {
    this.id = id;
    this.executeList = executeList;
    this.activeId = activeId;
    this.currentCard = currentCard;
  }
}

// groups的数量和tab执行过的数量保持同步
export interface IResult {
  currentGroup?: IResultGroup | null;
  groups: IResultGroup[];
}

export class ResultModel implements IResult {
  public currentGroup?: IResultGroup | null;
  public groups: IResultGroup[];

  constructor(
    groups: IResultGroup[] = [],
    currentGroup: IResultGroup | null = null,
  ) {
    this.groups = groups;
    this.currentGroup = currentGroup;
  }
}