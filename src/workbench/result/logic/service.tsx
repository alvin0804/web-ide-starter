
// // 历史列表
// export const list = new Array(300).fill(1).map((_, index: number) => ({
//   name: `时间: 02-${index + 1} 13:18:00`,
//   id: `${index + 1}`
// }));
// export const activeId = list?.[0]?.id;
// export const card = {
//   data: [
//     {
//       id: "result.logger",
//       name: "查询日志",
//       data: '',
//       sortIndex: 2,
//       closable: false,
//       renderPane: (item) => (<div>logger: {JSON.stringify(item)}</div>)
//     },
//     {
//       id: "result.table",
//       name: "查询结果",
//       data: '',
//       sortIndex: 2,
//       closable: false,
//       renderPane: (item) => (<div>table: {JSON.stringify(item)}</div>)
//     },
//   ],
//   current: {
//     id: "result.logger",
//     name: "查询日志",
//     data: '',
//     sortIndex: 2,
//     closable: false,
//     renderPane: (item) => (<div>logger: {JSON.stringify(item)}</div>)
//   },
//   status: "成功",
//   times: "10:23:25",
//   count: "1000条"
// }


import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import { UniqueId } from "mo/common/types";
import { randomId, searchById } from "mo/common/utils";
import { Component } from "mo/react";
import { dataSource } from "mo/workbench/searchResult/panelView/helper";
import { container, singleton } from "tsyringe";
import { log } from "util";
import { ResultLogger } from "../loger";
import { ResultTable } from "../table";
import { CardTabType, CardTabTypes, IExecuteListItem, IResult, IResultCard, IResultGroup, ResultGroupModel, ResultModel, ResultStatusType, ResultStatusTypes } from "./model";
import { getStoreageData, saveStorageData } from "./storage";


export interface IResultService extends Component<ResultModel> {
  getGroupById?(groupId): IResultGroup | undefined;
  addResult?(groupId: UniqueId): void;
  // setExecuteListActiveId?(groupId: UniqueId, executeActiveId: UniqueId): void;
  setCardTabItemActive?(groupId: UniqueId, tabKey: UniqueId): void;

  addExecuteResult(
    groupId: UniqueId,
    logs: any[],
    tableSource: { dataSource: any[], columns: any[] },
    timestamp: number,
    executeId: string,
    isActive: boolean
  )
  toogleGroup(groupId: UniqueId): void;

  updateGroupExecuteTable<T>(groupId: UniqueId, executeId: UniqueId, data: { dataSource: any[], columns: [] }): void;
  udpateGroupExecuteLogger(groupId: UniqueId, executeId: UniqueId, data: string[], isAppend: boolean): void;
  updateGroupExecuteStatus(groupId: UniqueId, executeId: UniqueId, status: ResultStatusType): void;

  // 切换executeItem选项
  updateGroupExecuteActive(groupId: UniqueId, activeExecuteId: UniqueId): void;

  updateGroupExecuteTabActive(groupId: UniqueId, activeExecuteId: UniqueId, activeTabKey: UniqueId): void;

  testDataSource(groupId: UniqueId, executeId: UniqueId, repeatNum: number): void
}

@singleton()
export class ResultService extends Component<ResultModel> implements IResultService {

  protected state: IResult;
  constructor() {
    super();
    this.state = container.resolve(ResultModel);
  }

  public getGroupById(groupId): IResultGroup | undefined {
    const { groups } = this.state;
    return groups.find(searchById(groupId));
  }



  // 获取group，如果不存在该组，则自动创建
  public getGroupIfNotExistCreateById(groupId: UniqueId) {

  }

  // 设置执行结果，用户执行完成之后对结果进行展示
  public addExecuteResult(
    groupId: UniqueId,
    logs: any[],
    tableSource: { dataSource: any[], columns: any[] },
    timestamp: number,
    executeId: string = randomId() + '',
    isActive: boolean = false,
  ) {

    // 获取当前group
    const { groups } = this.state;;
    const index = groups.findIndex(group => group.id === groupId);
    const group = index > -1 ? groups.find(searchById(groupId)) : new ResultGroupModel(groupId);
    const { executeList, activeId } = group;

    // 保存持久化数据
    const loggerKey = `logger_${executeId}`;
    saveStorageData(loggerKey, logs);

    const tableKey = `table_${executeId}`;
    saveStorageData(tableKey, tableSource);

    // 生成新的group对象
    const newExecuteItem: IExecuteListItem = {
      id: executeId,
      name: `时间: ${dayjs(new Date(timestamp)).format("MM-DD HH:mm:ss").toString()}`,
      loggerKey,
      tableKey,
      currentKey: CardTabTypes.logger,
      status: ResultStatusTypes.running,
      times: '-',
      count: '-'
    }
    const nextExecuteList = [newExecuteItem].concat(executeList ?? []);
    const nextActiveId = isActive ? executeId : activeId;

    const nextGroup = cloneDeep(group);
    nextGroup.currentCard = null;
    nextGroup.activeId = nextActiveId + '';
    nextGroup.executeList = nextExecuteList;
    nextGroup.id = groupId;

    // 生成新的groups
    const nextGroups = index > -1 ? groups.map(g => g.id === groupId ? nextGroup : g) : [nextGroup].concat(groups || [])

    // 更新UI
    const tabs = [this.generateLoggerTabItem(logs), this.generateTableTabItem(tableSource)]
    const currentTabItem = tabs.find(tab => tab.id === newExecuteItem.currentKey);
    const currentCard: IResultCard = {
      current: currentTabItem,
      tabs: tabs,
      status: newExecuteItem.status,
      times: newExecuteItem.times,
      count: newExecuteItem.count,
    }
    const nextCurrentGroup = cloneDeep(nextGroup);
    nextCurrentGroup.currentCard = currentCard;

    // 更新数据
    this.setState({ groups: nextGroups, currentGroup: nextCurrentGroup })
  }
  // 切换tab的时候触发
  public toogleGroup(groupId: UniqueId): void {
    const { groups, currentGroup } = this.state;;

    if (currentGroup.id === groupId) return;

    const index = groups.findIndex(group => group.id === groupId);
    if (index <= -1) return;

    const group = groups[index];
    const { activeId, executeList } = group;

    const currentExecuteItem: IExecuteListItem = executeList.find(executeItem => executeItem.id === activeId);
    const { loggerKey, tableKey, currentKey, status, times, count } = currentExecuteItem;

    const logs = getStoreageData(loggerKey);
    const tableSource = getStoreageData(tableKey);
    const tabs = [this.generateLoggerTabItem(logs), this.generateTableTabItem(tableSource)]
    const currentTabItem = tabs.find(tab => tab.id === currentKey);
    const nextCurrentCard: IResultCard = {
      current: currentTabItem,
      tabs: tabs,
      status: status,
      times: times,
      count: count,
    }

    const nextCurrentGroup = cloneDeep(group);
    nextCurrentGroup.currentCard = nextCurrentCard;

    const nextGroups = groups.map(g => g.id === groupId ? group : g);

    this.setState({ groups: nextGroups, currentGroup: nextCurrentGroup });
  }
  // 更新数据源数据
  public updateGroupExecuteTable<T>(groupId: UniqueId, executeId: UniqueId, data: { dataSource: any[], columns: any[] }): void {
    const { groups, currentGroup } = this.state;

    const index = groups.findIndex(g => g.id === groupId);
    if (index <= -1) return;

    const group = groups[index];
    const { executeList } = group;
    const currentExecuteItem: IExecuteListItem = executeList.find(executeItem => executeItem.id === executeId);
    const { loggerKey, tableKey, status, times, count } = currentExecuteItem;

    const newLogs: string[] = getStoreageData(loggerKey) || [];
    const newTableSource = data || { dataSource: [], columns: [] };

    // 更新storage中的数据
    saveStorageData(tableKey, newTableSource);


    // 如果是同group 同executeId ，说明是当前渲染项，需要 更新currentGroup
    const { activeId, id, currentCard: { current: currentGroupActiveTabItem } } = currentGroup;
    if (groupId === id && executeId === activeId) {
      const tabs = [this.generateLoggerTabItem(newLogs), this.generateTableTabItem(newTableSource)]
      const currentTabItem = tabs.find(tab => tab.id === currentGroupActiveTabItem.id);
      const nextCurrentCard: IResultCard = {
        current: currentTabItem,
        tabs: tabs,
        status: status,
        times: times,
        count: count,
      }
      const nextCurrentGroup = cloneDeep(group);
      nextCurrentGroup.currentCard = nextCurrentCard;

      this.setState({ currentGroup: nextCurrentGroup })
    }
  }
  // 更新查询日志
  public udpateGroupExecuteLogger(groupId: UniqueId, executeId: UniqueId, data: string[], isAppend: boolean = true) {
    const { groups, currentGroup } = this.state;

    const index = groups.findIndex(g => g.id === groupId);
    if (index <= -1) return;

    const group = groups[index];
    const { executeList } = group;
    const currentExecuteItem: IExecuteListItem = executeList.find(executeItem => executeItem.id === executeId);
    const { loggerKey, tableKey, status, times, count } = currentExecuteItem;

    const prevLogs: string[] = getStoreageData(loggerKey) || [];
    const newLogs = isAppend ? prevLogs.concat(data as string[]) : [].concat(data as string[]);
    const newTableSource = getStoreageData(tableKey) || { dataSource: [], columns: [] };

    // 更新storage中的数据
    saveStorageData(loggerKey, newLogs);
    // saveStorageData(tableKey, newTableSource);

    // 如果是同group 同executeId ，说明是当前渲染项，需要 更新currentGroup
    const { activeId, id, currentCard: { current: currentGroupActiveTabItem } } = currentGroup;
    if (groupId === id && executeId === activeId) {
      const tabs = [this.generateLoggerTabItem(newLogs), this.generateTableTabItem(newTableSource)]
      const currentTabItem = tabs.find(tab => tab.id === currentGroupActiveTabItem.id);
      const nextCurrentCard: IResultCard = {
        current: currentTabItem,
        tabs: tabs,
        status: status,
        times: times,
        count: count,
      }
      const nextCurrentGroup = cloneDeep(group);
      nextCurrentGroup.currentCard = nextCurrentCard;

      this.setState({ currentGroup: nextCurrentGroup })
    }
  }

  // 更新执行状态
  public updateGroupExecuteStatus(groupId: UniqueId, executeId: UniqueId, status: ResultStatusType) {
    const { groups, currentGroup } = this.state;

    const index = groups.findIndex(g => g.id === groupId);
    if (index <= -1) return;

    const group = groups[index];
    const { executeList } = group;

    const nextExecuteList: IExecuteListItem[] = executeList.map((executeItem: IExecuteListItem) => {
      if (executeItem.id === executeId) {
        return { ...executeItem, status }
      }
      return executeItem;
    });
    group.executeList = nextExecuteList;
    groups[index] = cloneDeep(group);


    // 如果是同group 同executeId ，说明是当前渲染项，需要 更新currentGroup
    const { activeId, id, currentCard } = currentGroup;
    if (groupId === id && executeId === activeId) {
      const nextCurrentCard = cloneDeep(currentCard);
      nextCurrentCard.status = status;

      const nextCurrentGroup = cloneDeep(currentGroup);
      nextCurrentGroup.currentCard = nextCurrentCard;

      this.setState({ groups: groups, currentGroup: nextCurrentGroup })
    } else {
      this.setState({ groups: groups });
    }

  }

  // 更新当前选中项
  public updateGroupExecuteActive(groupId: UniqueId, activeExecuteId: UniqueId) {
    const { groups, currentGroup } = this.state;

    const index = groups.findIndex(g => g.id === groupId);
    if (index <= -1) return;

    const group = groups[index];
    group.activeId = activeExecuteId;
    groups[index] = cloneDeep(group);


    const { id, executeList } = cloneDeep(currentGroup);
    // 如果是 currentGroup 则需要更新UI
    if (groupId === id) {

      const currentExecuteItem = executeList.find(executeItem => executeItem.id === activeExecuteId);
      const { loggerKey, tableKey, currentKey, status, times, count } = currentExecuteItem;

      const logs = getStoreageData(loggerKey) || [];
      const tableSource = getStoreageData(tableKey) || { dataSource: [], columns: [] };

      const tabs = [this.generateLoggerTabItem(logs), this.generateTableTabItem(tableSource)]
      const currentTabItem = tabs.find(tab => tab.id === currentKey);

      const nextCurrentCard: IResultCard = {
        current: currentTabItem,
        tabs,
        status,
        times,
        count
      }
      const nextCurrentGroup: IResultGroup = {
        id,
        executeList,
        activeId: activeExecuteId,
        currentCard: nextCurrentCard,
      }

      this.setState({ groups: groups, currentGroup: nextCurrentGroup })
    } else {
      this.setState({ groups: groups })
    }
  }

  // 更新当前tab选中项
  public updateGroupExecuteTabActive(groupId: UniqueId, activeExecuteId: UniqueId, activeTabKey: UniqueId) {

    // 先更新groups
    const { groups, currentGroup } = this.state;

    const index = groups.findIndex(g => g.id === groupId);
    if (index <= -1) return;

    const group = groups[index];
    const { executeList } = group;

    const nextExecuteList: IExecuteListItem[] = executeList.map((executeItem: IExecuteListItem) => {
      if (executeItem.id === activeExecuteId) {
        return { ...executeItem, currentKey: activeTabKey }
      }
      return executeItem;
    });
    group.executeList = nextExecuteList;
    groups[index] = cloneDeep(group);


    // 再更新currentGroup
    const { currentCard, id: currentGroupId, executeList: currentExecuteList } = currentGroup;
    if (groupId === currentGroupId) {
      const nextCurrentExecuteList: IExecuteListItem[] = currentExecuteList.map((executeItem: IExecuteListItem) => {
        if (executeItem.id === activeExecuteId) {
          return { ...executeItem, currentKey: activeTabKey }
        }
        return executeItem;
      })

      const { tabs = [] } = currentCard;
      const nextCurrentTab = tabs.find(tab => tab.id === activeTabKey);
      const nextCurrentCard = cloneDeep(currentCard);
      nextCurrentCard.current = nextCurrentTab;

      const nextCurrentGroup = cloneDeep(currentGroup);
      nextCurrentGroup.executeList = nextCurrentExecuteList; 
      nextCurrentGroup.currentCard = nextCurrentCard;

      this.setState({ groups: groups, currentGroup: nextCurrentGroup })
    } else {
      this.setState({ groups: groups })
    }
  }

  private generateLoggerTabItem(logs: any[]) {
    return {
      id: CardTabTypes.logger,
      name: '查询日志',
      renderPane: (data: any) => <ResultLogger {...data} />,
      closable: false,
      icon: 'terminal',
      data: logs || []
    }
  }
  private generateTableTabItem(tableSource: { dataSource: any[], columns: any[] }) {
    return {
      id: CardTabTypes.table,
      name: '查询结果',
      renderPane: (data: any) => <ResultTable {...data} />,
      closable: false,
      icon: 'table',
      data: tableSource
    }
  }


  public updateExecuteResult(groupId, executeId: UniqueId, log) { }


  public testDataSource(groupId: UniqueId, executeId: UniqueId, repeatNum: number = 10) {
    function repeat<T>(arr: T[], n: number) {
      let result: T[] = []
      for (let i = 0; i < n; i++) {
        result = result.concat(arr)
      }
      return result
    }
    
    const dataSource = [
      { provinceName: '湖北省', cityName: '武汉', confirmedCount: 37914, curedCount: 2519, deadCount: 1123, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '孝感', confirmedCount: 3114, curedCount: 313, deadCount: 62, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '黄冈', confirmedCount: 2817, curedCount: 611, deadCount: 68, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '荆州', confirmedCount: 1478, curedCount: 193, deadCount: 32, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '随州', confirmedCount: 1232, curedCount: 96, deadCount: 19, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '襄阳', confirmedCount: 1128, curedCount: 85, deadCount: 18, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '鄂州', confirmedCount: 1192, curedCount: 199, deadCount: 33, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '宜昌', confirmedCount: 906, curedCount: 92, deadCount: 15, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '黄石', confirmedCount: 980, curedCount: 170, deadCount: 13, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '荆门', confirmedCount: 902, curedCount: 112, deadCount: 28, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '咸宁', confirmedCount: 840, curedCount: 127, deadCount: 8, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '十堰', confirmedCount: 597, curedCount: 101, deadCount: 2, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '仙桃', confirmedCount: 514, curedCount: 63, deadCount: 17, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '天门', confirmedCount: 422, curedCount: 21, deadCount: 10, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '恩施州', confirmedCount: 244, curedCount: 71, deadCount: 4, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '潜江', confirmedCount: 116, curedCount: 12, deadCount: 5, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '高性能 React 表格组件 ali-react-table', confirmedCount: 10, curedCount: 8, deadCount: 0, updateTime: '2020-02-15' },
      { provinceName: '湖北省', cityName: '待明确地区', confirmedCount: 0, curedCount: 18, deadCount: 0, updateTime: '2020-02-06' },
      { provinceName: '湖北省', cityName: '未知地区', confirmedCount: 0, curedCount: 35, deadCount: 0, updateTime: '2020-02-02' },
      { provinceName: '湖北省', cityName: '恩施', confirmedCount: 87, curedCount: 0, deadCount: 0, updateTime: '2020-02-01' },
      { provinceName: '广东省', cityName: '深圳', confirmedCount: 406, curedCount: 115, deadCount: 0, updateTime: '2020-02-15' },
      { provinceName: '广东省', cityName: '广州', confirmedCount: 335, curedCount: 106, deadCount: 0, updateTime: '2020-02-15' },
      { provinceName: '广东省', cityName: '东莞', confirmedCount: 81, curedCount: 7, deadCount: 1, updateTime: '2020-02-15' },
      { provinceName: '广东省', cityName: '佛山', confirmedCount: 84, curedCount: 22, deadCount: 0, updateTime: '2020-02-15' },
      { provinceName: '广东省', cityName: '珠海', confirmedCount: 95, curedCount: 34, deadCount: 0, updateTime: '2020-02-15' },
    ]
    
    const columns: any[] = [
      { code: 'provinceName', name: '省份', width: 150, lock: false },
      { code: 'cityName', name: '城市', width: 150 },
      ...repeat<any>(
        [
          { code: 'confirmedCount', name: '确诊', width: 100, align: 'left' },
          { code: 'curedCount', name: '治愈', width: 100, align: 'left' },
          { code: 'deadCount', name: '死亡', width: 100, align: 'left' },
        ],
        repeatNum
      ),
      { code: 'updateTime', name: '更新时间', width: 150, align: 'left' },
    ]
    
    this.updateGroupExecuteTable(groupId, executeId, { dataSource: [...repeat(dataSource, repeatNum)], columns })
  }








  // // 添加执行结果
  // public addExecuteResult(groupId: UniqueId, isActive: boolean = false): void {

  //   // 添加执行列表项


  //   const { groups: beforeGroups = [] } = this.state;


  //   const executeListItems: IExecuteListItem[] = new Array(10).fill(1).map((_, index: number) => {
  //     const executeId = randomId();
  //     return {
  //       id: executeId,
  //       name: `时间: ${dayjs(new Date()).add(index, 'days').format("MM-DD HH:mm:ss").toString()}`,
  //       loggerKey: `logger_${executeId}`,
  //       tableKey: `table_${executeId}`,
  //       currentKey: CardTabTypes.logger,
  //       status: ResultStatusTypes.running,
  //       times: '-',
  //       count: '-'
  //     }
  //   })


  //   const currentCard: IResultCard = {
  //     current: {
  //       id: CardTabTypes.table,
  //       name: '查询结果',
  //       renderPane: (data: any) => <ResultTable {...data} />,
  //       closable: false,
  //       icon: 'table',
  //       data: { dataSource: [], columns: [] }
  //     },
  //     tabs: [
  //       {
  //         id: CardTabTypes.logger,
  //         name: '查询日志',
  //         renderPane: (data: any) => <ResultLogger {...data} />,
  //         closable: false,
  //         icon: 'terminal',
  //         data: []
  //       },
  //       {
  //         id: CardTabTypes.table,
  //         name: '查询结果',
  //         renderPane: (data: any) => <ResultTable {...data} />,
  //         closable: false,
  //         icon: 'table',
  //         data: { dataSource: [], columns: [] }
  //       },
  //     ],
  //     status: ResultStatusTypes.running,
  //     times: '-',
  //     count: '-'
  //   }
  //   const currentGroup = new ResultGroupModel(groupId, executeListItems, executeListItems?.[2].id, currentCard);




  //   const nextGroup = cloneDeep(currentGroup);
  //   this.setState({
  //     currentGroup: nextGroup,
  //     groups: beforeGroups.concat([nextGroup])
  //   })
  // }


  // 从storage当中获取数据，返回json
  private getStoreDataByKey(storageKey: string) {
    return getStoreageData(storageKey)
  }

  // : ICardProps | null
  public getCurrentCard(item: IExecuteListItem) {
    const { id, loggerKey, tableKey, currentKey, status, times, count } = item;

    const loggerData = this.getStoreDataByKey(loggerKey);
    const tableData = this.getStoreDataByKey(tableKey);

  }

  // // 设置执行列表的激活选项
  // public setExecuteListActiveId(groupId: UniqueId, executeActiveId: UniqueId) {

  //   const { groups = [], currentGroup } = this.state;

  //   const nextGroup = cloneDeep(this.getGroupById(groupId));
  //   nextGroup.activeId = executeActiveId;

  //   const nextGroups = groups.map(item => {
  //     if (item.id === groupId) {
  //       return nextGroup;
  //     }
  //     item.currentCard = null;
  //     return item;
  //   });

  //   if (currentGroup.id === nextGroup.id) {
  //     currentGroup.activeId = executeActiveId
  //   }

  //   this.setState({ groups: nextGroups, currentGroup: cloneDeep(currentGroup) })
  // }

  // 更新tab activeId 
  // 1. 更新当前group的executeList 和 currentCard.current
  // 2. 对当前组直接替换groups
  public setCardTabItemActive(groupId: UniqueId, tabKey: UniqueId) {
    const { groups = [] } = this.state;

    const group = cloneDeep(this.getGroupById(groupId));
    const nextGroup = cloneDeep(group);

    const { activeId, executeList, currentCard } = group;

    // 更新后的executeList
    const nextExecuteItem = executeList.find(item => item.id === activeId);
    nextExecuteItem.currentKey = tabKey;
    const nextExecuteList = executeList.map(item => item.id === activeId ? cloneDeep(nextExecuteItem) : item)

    // 更新后的current
    const { tabs } = cloneDeep(currentCard);
    const currentTab = tabs.find(searchById(tabKey));

    nextGroup.executeList = nextExecuteList;
    nextGroup.currentCard.current = currentTab

    // 更新数据
    const nextGroups = groups.map(item => item.id === nextGroup.id ? nextGroup : item);
    this.setState({ currentGroup: nextGroup, groups: nextGroups });
  }
}