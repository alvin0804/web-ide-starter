import { cloneDeep } from "lodash";
import logger from "mo/common/logger";
import { UniqueId } from "mo/common/types";
import { searchById } from "mo/common/utils";
import { ISearchResult, SearchResultModel } from "mo/model/searchResult";
import { IHistoryItem } from "mo/model/workbench/history";
import { Component } from "mo/react/component";
import { container, singleton } from "tsyringe";


export interface ISearchResultService extends Component<ISearchResult> {

  // /**
  //  * Set the current active history item
  //  * @param id 
  //  */
  // setActive(id: UniqueId): void;

  // /**
  //  * add new Result History
  //  * @param item 
  //  */
  // add(item: ISearchResultHistoryItem | ISearchResultHistoryItem[]): void;

  // /**
  //  * Reset data in state
  //  */
  // reset(): void;
}


@singleton()
export class SearchResultService extends Component<ISearchResult> implements ISearchResultService {
  protected state: ISearchResult;

  constructor() {
    super();
    this.state = container.resolve(SearchResultModel);
  }

  // public getSearchResultHistoryItem(id: UniqueId): ISearchResultHistoryItem | undefined {
  //   const { data = [] } = this.state;
  //   return cloneDeep(data.find(searchById(id)));
  // }

  // public setActive(id: UniqueId): void {
  //   const searchResultItem = this.getSearchResultHistoryItem(id);

  //   if(searchResultItem) {
  //     this.setState({ current: searchResultItem });
  //   } else {
  //     logger.error(`There is no History Item in data via ${id}`)
  //   }
  // }

  // public add(item: ISearchResultHistoryItem | ISearchResultHistoryItem[], isActive = false): void {
  //   let next = cloneDeep(this.state.data || []);
  //   const cloneData = cloneDeep(item);
  //   if(Array.isArray(cloneData)) {
  //     next = next?.concat(cloneData);
  //   } else {
  //     next.push(cloneData);
  //     this.setState({ current: cloneData })
  //   }

  //   // sort list
  //   next.sort((pre, next) => {
  //     const preIndex = pre.sortIndex || Number.MAX_SAFE_INTEGER;
  //     const nextIndex = next.sortIndex || Number.MAX_SAFE_INTEGER;
  //     return preIndex - nextIndex;
  //   });

  //   this.setState({ data: next })
  // }

  // public reset(): void {
  //   this.setState({ current: null, data: [] })
  // }
}