import { UniqueId } from "mo/common/types";
import { Button, Icon, ITabProps, Tab, Tabs } from "mo/components";
import { IPanelItem } from "mo/model";
import { 
  searchResultCardClasaName, 
  searchResultCardContentClassName, 
  searchResultCardExtraClassName, 
  searchResultCardExtraItemClassName, 
  searchResultCardHeaderClassName, 
  searchResultCardTabClassName
} from "../base";

export interface ICardItem<T = any> extends ITabProps<T> {
  title?: string;
  data?: T;
  sortIndex?: number;
}

export interface ICardProps {
  current?: ICardItem | null;
  data?: ICardItem[];

  // 当前运行状态
  runStatus: 'success' | 'failed' | 'running';
  // 运行时长
  runtime: number;
  // 查询结果数
  resultTotal: number;

  onTabChange?(key: UniqueId): void;
}

export default function ResultCard(props: any) {
  const { current, data, onTabChange } = props;

  const content = typeof current?.renderPane === 'function' ? current?.renderPane?.(current) : current?.renderPane;

  const sortedPanels = data?.sort((a: IPanelItem, b: IPanelItem) => {
    if (a.sortIndex && b.sortIndex) {
      return a.sortIndex - b.sortIndex;
    }
    return 0;
  });


  return (
    <div className={searchResultCardClasaName}>
      <div className={searchResultCardHeaderClassName}>
        <div className={searchResultCardTabClassName}>
          <Tabs activeTab={current?.id} data={sortedPanels} onSelectTab={onTabChange}></Tabs>
        </div>
        <div className={searchResultCardExtraClassName}>
        {/* <div className={searchResultCardExtraItemClassName} style={{ width: '120px' }}>状态：<div style={{ color: 'green' }}>成功</div></div> */}
        <div className={searchResultCardExtraItemClassName}>状态：<div style={{ color: 'green' }}>成功</div></div>
            <div className={searchResultCardExtraItemClassName}>运行时间: 1S</div>
            <div className={searchResultCardExtraItemClassName}>结果统计: 1000</div>
            <div className={searchResultCardExtraItemClassName}>
              <Button style={{ marginBottom: 0, width: '160px' }}><Icon type="arrow-circle-down" />下载结果数据</Button>
            </div>
        </div>
      </div>
      <div className={searchResultCardContentClassName} tabIndex={0}>
        {content}
      </div>
    </div>
  )
}