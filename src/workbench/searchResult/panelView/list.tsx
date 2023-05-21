import { UniqueId } from "mo/common/types";
import { IItemProps, Item, List } from "mo/components"
import { ScrollBar } from "mo/components/scrollBar"
import { searchResultListClasaName, searchResultListContentClasaName, searchResultListHeaderClasaName } from "../base";

export interface IResultHistoryListItemProps extends IItemProps {
  name: string;
}

export interface IResultHistoryList {
  activeId: string;
  data: IResultHistoryListItemProps[]
}

export default function ResultHistoryList(props: IResultHistoryList) {
  const { activeId, data } = props;

  return <div className={searchResultListClasaName}>
    <div className={searchResultListHeaderClasaName}>查询记录(倒序排序)</div>
    <ScrollBar
      className={searchResultListContentClasaName}
      style={{ height: '100%', width: '100%' }}
      inactiveHidden={true}
    >
      <List
        data-testid="myList"
        className="testList"
        mode="vertical"
        current={activeId}
      >
        {
          data.map((item: IResultHistoryListItemProps, index: number) => (<Item id={`${item.id}`} key={index} title={item.name}>{item.name}</Item>))
        }
      </List>
    </ScrollBar>
  </div>  
}