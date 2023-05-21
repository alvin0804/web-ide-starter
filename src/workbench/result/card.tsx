import { UniqueId } from "mo/common/types";
import { Tabs } from "mo/components";
import { searchResultCardClasaName, searchResultCardContentClassName, searchResultCardExtraClassName, searchResultCardHeaderClassName, searchResultCardTabClassName } from "./base";
import { ICardTabItem, IResultCard } from "./logic/model";


export interface ICardProps extends IResultCard {
  onTabItemChange?(key: UniqueId): void;
  onResultDownload?(key: UniqueId): void;
}

export function Card(props: ICardProps) {
  const { current, tabs, status, times, count, onTabItemChange, onResultDownload } = props;

  console.log("current data Card: ", current, tabs);

  const content = typeof current?.renderPane === 'function' ? current?.renderPane?.(current) : current?.renderPane;

  const sortedPanels = tabs?.sort((a: ICardTabItem, b: ICardTabItem) => {
    if (a.sortIndex && b.sortIndex) {
      return a.sortIndex - b.sortIndex;
    }
    return 0;
  });

  function handleDownloadResult() {
    onResultDownload(current?.id);
  }

  return <div className={searchResultCardClasaName}>
    <div className={searchResultCardHeaderClassName}>
      <div className={searchResultCardTabClassName}>
        <Tabs activeTab={current.id} data={tabs} onSelectTab={onTabItemChange} />
      </div>

      <div className={searchResultCardExtraClassName}>
        <span>状态{status}</span>
        <span>时间{times}</span>
        <span>统计{count}</span>
        <button onClick={handleDownloadResult}>下载结果1</button>
      </div>
    </div>
    <div className={searchResultCardContentClassName} tabIndex={0}>{content}</div>
  </div>
}