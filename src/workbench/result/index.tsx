import { UniqueId } from "mo/common/types";
import { IItemProps, Pane, SplitPane } from "mo/components";
import { memo, useState } from "react";
import { defaultSearchResultClassName } from "./base";
import { Card } from "./card";
import { ExecuteList } from "./list";
import { IResultController } from "./logic/controller";
import { IResult } from "./logic/model";

function Result(props: IResult & IResultController) {
  const [resultSizes, setResultSizes] = useState([180, '100%'])
  const { currentGroup, groups, onCardTabItemChange, onExecuteItemClick } = props;

  if (!currentGroup) {
    return <div>currentGroup equals null</div>
  }

  const { id, executeList, activeId, currentCard } = currentGroup;

  const getEvents = (groupId: UniqueId) => {
    return {
      onCardTabItemChange,
      onExecuteItemClick,
    }
  }

  const handleTabItemChange = (tabKey: UniqueId) => {
    // const currentCardItem = cloneDeep(currentCard);
    // const cardTabItem = currentCardItem.data.find(searchById(id))
    // currentCardItem.current = cardTabItem;

    // setCardItem(cloneDeep(currentCardItem))
    onCardTabItemChange?.(id, activeId, tabKey)
  }

  const handlerSelectExecuteItem = (event: React.MouseEvent<Element, MouseEvent>, item?: IItemProps) => {
    event.stopPropagation();
    onExecuteItemClick?.(id, item.id);
  }


  return <div className={defaultSearchResultClassName} style={{ height: '100%' }}>
    <SplitPane
      sizes={resultSizes}
      split="vertical"
      showSashes={true}
      onChange={function (sizes: number[]): void {
        setResultSizes(sizes)
      }}
    >
      <Pane minSize={180} maxSize={300} style={{ boxSizing: 'border-box', paddingRight: '0px' }}>
        <ExecuteList activeId={activeId} data={executeList} onExecuteItemClick={handlerSelectExecuteItem} />
      </Pane>
      <Card {...currentCard} onTabItemChange={handleTabItemChange} />
    </SplitPane>
  </div>
}

export default memo(Result)