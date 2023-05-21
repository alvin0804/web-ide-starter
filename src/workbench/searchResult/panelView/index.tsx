import { Button, Icon, ITabProps, Item, List, Pane, SplitPane, Tabs } from "mo/components";
import { ArtColumn } from "mo/components/table";
import { memo, useEffect, useRef, useState } from "react";
import { defaultSearchResultClassName } from "../base";
import { debounce } from "lodash";
import { ScrollBar } from "mo/components/scrollBar";
import { ResultTable } from "../../result/table";
import { ColorThemeMode } from "mo/model";
import { ISearchResult } from "mo/model/searchResult";
import { UniqueId } from "mo/common/types";
import { columns, dataSource, mockData, mockListData } from "./helper";
import ResultCard from "./card";
import ResultHistoryList from "./list";


function SearchResultPaneView(props: ISearchResult) {
  const { historyList = [], historyCurrent, currentLogger, currentTable } = props;

  const [resultSizes, setResultSizes] = useState([180, '100%'])
  const [isLoading, setIsLoading] = useState(false)
  const [current, setCurrent] = useState()

  const onSelectTabChange = (id: UniqueId) => {
    const item: any = mockData.find(item => item.id === id);
    setCurrent(item); 
  }

  if (typeof document === 'undefined') {
    return null
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
        <ResultHistoryList data={mockListData} activeId={"2"}  />
      </Pane>
      <ResultCard 
        data={mockData} 
        current={current}
        onTabChange={onSelectTabChange}
      ></ResultCard>
    </SplitPane>
  </div>
}

export default memo(SearchResultPaneView);