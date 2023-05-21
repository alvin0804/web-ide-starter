import { ScrollBar } from "mo/components/scrollBar";
import { IItemProps, Item, List } from "mo/components"
import { UniqueId } from "mo/common/types";
import { IResultController } from "./logic/controller";

export interface IExecuteListItemProps {
  id: UniqueId;
  name: string;
  onClick?(event: React.MouseEvent, item?: IItemProps): void;
}
export interface IExecuteListProps {
  activeId: UniqueId;
  data: IExecuteListItemProps[];
  onExecuteItemClick?(event: React.MouseEvent<Element, MouseEvent>, item?: IItemProps): void
}

export function ExecuteList(props: IExecuteListProps) {
  const { activeId, data, onExecuteItemClick } = props;

  return (
    <div className={"list"}  style={{ height: '150px' }}>
      <div className={"header"}>查询记录(倒序排序)</div>
      <ScrollBar
        className={"content"}
        style={{ height: '100%', width: '100%' }}
        inactiveHidden={true}
      >
        <List
          data-testid="myList"
          className="testList"
          mode="vertical"
          // @ts-ignore
          current={activeId}
          onSelect={onExecuteItemClick}
        >
          {
            data.map((item: IExecuteListItemProps, index: number) => (<Item id={`${item.id}`} key={index} title={item.name}>{item.name}</Item>))
          }
        </List>
      </ScrollBar>
    </div>
  )
}