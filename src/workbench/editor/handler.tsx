import { classNames } from "mo/common/className";
import { DropDown, Icon, Menu } from "mo/components";
import { DropDownRef } from "mo/components/dropdown";
import { IEditorHandlerItem, IEditorHandlerItemTypes, IEditorHandlerPositionTypes } from "mo/model";
import { useRef } from "react";
import {
  groupHandlerClassName, groupHandlerItemClassName, groupHandlerItemInnderClassName,
  groupHandlerItemLockClassName,
  groupHandlerItemLockShowClassName,
  groupHandlerLeftClassName, groupHandlerRightClassName, groupHandlersLockClassName
} from "./base";


export interface IEditorHandlerProps {
  isShowHandler: boolean;
  handlers: IEditorHandlerItem[];
  onClickHandlers: any
}

export function EditorHandler(props: IEditorHandlerProps) {
  const { isShowHandler, handlers = [], onClickHandlers } = props;
  const childRef = useRef<DropDownRef>(null);

  const handleOnMenuClick = (_, item) => {
    onClickHandlers(item);
    childRef.current?.dispose();
  };

  const handleHandlersClick = (handler) => {
    onClickHandlers(handler);
  };

  const renderOverlay = (menuData: IEditorHandlerItem[]) => (<Menu style={{ width: 220 }} data={menuData} onClick={handleOnMenuClick} />)

  const renderItems = (items: IEditorHandlerItem[]) => {
    return items.map((item, index) => (
      <div className={groupHandlerItemClassName} key={index}>
        {
          item.handlerType === IEditorHandlerItemTypes.Dropdown ? (
            <DropDown
              ref={childRef}
              placement="bottom"
              trigger="click"
              title={item?.name}
              style={{ width: item?.width || 200 }}
              overlay={renderOverlay(item?.dataSource || [])}
            >
              <div className={groupHandlerItemInnderClassName}>
                <Icon type={item?.icon}></Icon>{item?.name}{item?.value ? `(${item?.value})` : ''} 
              </div>
              <div className={classNames(groupHandlerItemLockClassName, item?.isLockStatus ? groupHandlerItemLockShowClassName : '')}>
                <Icon type="lock"></Icon>
              </div>
            </DropDown>
          ) : (
            <div className={groupHandlerItemClassName} key={index}
              onClick={() => !item.isLockStatus && handleHandlersClick(item)}>
              <div className={groupHandlerItemInnderClassName}><Icon type={item?.icon}></Icon>{item?.name}</div>
              <div className={classNames(groupHandlerItemLockClassName, item?.isLockStatus ? groupHandlerItemLockShowClassName : '')}>
                <Icon type="lock"></Icon>
              </div>
            </div>
          )
        }
      </div>
    ))
  }
  const leftItems = handlers.filter(item => item.handlerPosition === IEditorHandlerPositionTypes.Left)
  const rightItems = handlers.filter(item => item.handlerPosition === IEditorHandlerPositionTypes.Right)

  return <div className={groupHandlerClassName}>
    {
      isShowHandler ? (<>
        <div className={groupHandlerLeftClassName}>
          {renderItems(leftItems)}
        </div>
        <div className={groupHandlerRightClassName}>
          {renderItems(rightItems)}
        </div>
      </>) : null
    }
    {/* <div className={groupHandlersLockClassName}><Icon type="lock" /></div> */}
  </div>
}