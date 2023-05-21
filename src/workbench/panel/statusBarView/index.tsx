import { Icon } from "mo/components";
import { IStatusBarItem } from "mo/model";
import { memo } from "react";

export function PanelStatusBarView(props: IStatusBarItem) {
  return <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#3d7f60', height: '100%', paddingLeft: '6px', paddingRight: '6px', marginLeft: '-12px' }}>
    <Icon type={"table"} style={{ paddingRight: '4px' }} />
    <span>查询结果</span>
  </div>
}

export default memo(PanelStatusBarView);