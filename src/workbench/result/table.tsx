import numeral from 'numeral'
import cx from 'classnames'
import { debounce } from "lodash";
import styled from 'styled-components';
import { BaseTable } from 'mo/components';
import { ArtColumn } from 'mo/components/table';
import { ColorThemeMode } from 'mo/model';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { searchTableWrapperClassName } from '../searchResult/base';

function repeat<T>(arr: T[], n: number) {
  let result: T[] = []
  for (let i = 0; i < n; i++) {
    result = result.concat(arr)
  }
  return result
}


const LightBaseTable = styled(BaseTable)`
  td {
    --cell-padding: 5px 12px;
    --row-height: 34px;
    user-select: text;
  }

  &,
  .art-horizontal-scroll-container {
    ::-webkit-scrollbar {
      width: 14px;
      height: 14px;
    }

    ::-webkit-scrollbar-thumb {
      background: #666666;
      box-sizing: border-box;

    }
    ::-webkit-scrollbar-track {
      background: #d6d6d6;
      border: 1px solid #d6d6d6;
      box-sizing: border-box;
    }
  }
`
const DarkBaseTable = styled(BaseTable)`

  // 暗黑模式 
  --bgcolor: #333;
  --header-bgcolor: #45494f;
  --hover-bgcolor: #46484a;
  --header-hover-bgcolor: #606164;
  --highlight-bgcolor: #191a1b;
  --header-highlight-bgcolor: #191a1b;
  --color: #dadde1;
  --header-color: #dadde1;
  --lock-shadow: rgb(37 37 37 / 0.5) 0 0 6px 2px;
  --border-color: #3c4045;

  td {
    --cell-padding: 5px 12px;
    --row-height: 34px;
    user-select: text;
  }

  &,
  .art-horizontal-scroll-container {
    ::-webkit-scrollbar {
      width: 14px;
      height: 14px;
    }

    ::-webkit-scrollbar-thumb {
      background: #46484a;
      box-sizing: border-box;

    }
    ::-webkit-scrollbar-track {
      background: #1c1c1c;
      border: 1px solid #1c1c1c;
      box-sizing: border-box;
    }
  }
`

export interface IResultTableProps extends ComponentProps<any> {
  loading: boolean;
  themeMode: ColorThemeMode;

  dataSource: any[];
  columns: ArtColumn[];
}


export function ResultTable(props: IResultTableProps) {
  // console.log("ResultTable: ", props);
  const { data, loading, themeMode } = props;
  const { columns, dataSource } = data;

  const [wrapperRect, setWrapperRect] = useState({ height: 260, width: 300 });
  const wrapper = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false)


  let BaseTableComponent = LightBaseTable
  if (themeMode === ColorThemeMode.dark) {
    BaseTableComponent = DarkBaseTable;
  }

  useEffect(() => {
    const resizeCallback = debounce(() => {
      // 容器发生变化之后，将表格状态变成loading，然后数据置空
      // console.log("wrapper.current!.getBoundingClientRect(): ", wrapper.current!.getBoundingClientRect());

      setWrapperRect(wrapper.current!.getBoundingClientRect());
      setIsLoading(false);
    }, 500, { 'leading': true, 'trailing': true })
    // 监听容器宽高变化
    const resizeObserver = new ResizeObserver(function () {
      setIsLoading(true);
      resizeCallback();
    });
    resizeObserver.observe(wrapper.current);
    return () => {
      resizeObserver.disconnect();
    }
  }, [])

  // useEffect(() => {
  //   setIsLoading(true);
  //   debounce(() => {
  //     setIsLoading(false);
  //   }, 500, { 'leading': true, 'trailing': true })
  // }, [columns, dataSource]);
  useEffect(() => {
    setIsLoading(loading)
  }, [loading]);


  return <div ref={wrapper} className={searchTableWrapperClassName}>
    <BaseTableComponent
      stickyScrollHeight={14}
      isLoading={isLoading}
      useOuterBorder={false}
      hasStickyScroll={true}
      hasHeader={true}
      isStickyHeader={true}
      isStickyFooter={false}
      style={{
        overflow: 'auto',
        maxHeight: `${wrapperRect?.height ?? 14}px`,
        maxWidth: `${wrapperRect?.width ?? 14}px`,
        height: '100%',
        width: '100%',
        transform: `rotate(0) scale(1)`,
        // backgroundColor: 'red'
      }}
      columns={!isLoading ? columns : []}
      dataSource={!isLoading ? dataSource : []}
    />
  </div>
}