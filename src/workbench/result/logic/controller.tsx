import { UniqueId } from "mo/common/types";
import { searchById } from "mo/common/utils";
import { connect, Controller } from "mo/react";
import { BuiltinService, IBuiltinService, IPanelService, PanelService } from "mo/services";
import { container, singleton } from "tsyringe";
import { IResultService, ResultService } from "./service";
import SearchResultPaneView from "../index";

export interface IResultController extends Partial<Controller> {
  onCardTabItemChange?(groupId: UniqueId, executeId: UniqueId, tabKey: UniqueId)
  onExecuteItemClick?(groupId: UniqueId, executeId: UniqueId)
}


@singleton()
export class ResultController extends Controller implements IResultController {
  
  private readonly resultService: IResultService;
  private readonly panelService: IPanelService;
  private readonly builtinService: IBuiltinService;
  constructor() {
    super();
    this.panelService = container.resolve(PanelService);
    this.builtinService = container.resolve(BuiltinService);
    this.resultService = container.resolve(ResultService);
  }

  public initView(): void {
    const { builtInPanelSearchResult } = this.builtinService.getModules();

    if(builtInPanelSearchResult) {
      const events = {
        onCardTabItemChange: this.onCardTabItemChange,
        onExecuteItemClick: this.onExecuteItemClick,
        initView: this.initView
      }
      const ResultView = connect(this.resultService, SearchResultPaneView, events as any);
      const searchResultPanel = builtInPanelSearchResult;
      searchResultPanel.renderPane = () => <ResultView />
      
      this.panelService.add(searchResultPanel);
      this.panelService.setActive(searchResultPanel.id);
    }

    // @ts-ignore
    window.resultService = this.resultService;
    // resultService.addExecuteResult("tab_2022-12-20", ['restu', 'sdfsaf'], { dataSource: [], columns: [] }, 1680170386128, 1601701236164, true);
    // resultService.addExecuteResult("tab_2022-12-20", ['restu', 'sdfsaf'], { dataSource: [], columns: [] }, 1680170346128, 1601701236164, true);
    // resultService.addExecuteResult("tab_2022-12-21", ['restu', 'sdfsaf'], { dataSource: [], columns: [] }, 1680170326128, 1601701236164, true);
    // resultService.addExecuteResult("tab_2022-12-20", ['restu', 'sdfsaf'], { dataSource: [], columns: [] }, 1680170316128, 1601701236164, true);
    // resultService.addExecuteResult("tab_2022-12-21", ['restu', 'sdfsaf'], { dataSource: [], columns: [] }, 1680170286128, 1601701236164, true);
    // this.resultService.addResult("tab_2022-12-20");
    // setTimeout(() => {
    //   this.resultService.addResult("tab_2022-12-21");
    // }, 2000)
  }

  // 点击【查询日志】和【查询结果】按钮时
  public onCardTabItemChange = (groupId: UniqueId, executeId: UniqueId, tabKey: UniqueId) => {
    // const group = this.resultService.getGroupById(groupId);
    // const card = group.executeList.find(searchById(executeId));
    // //  TODO: xxx
    // debugger;
    // this.resultService.setCardTabItemActive(groupId, tabKey)

    this.resultService.updateGroupExecuteTabActive(groupId, executeId, tabKey);
  }

  // 当点击结果列表点击时
  public onExecuteItemClick = (groupId: UniqueId, executeId: UniqueId) => {
    // this.resultService.setExecuteListActiveId(groupId, executeId);
    this.resultService.updateGroupExecuteActive(groupId, executeId);
  }
}