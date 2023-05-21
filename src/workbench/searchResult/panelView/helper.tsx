import { ITabProps } from "mo/components";
import { ArtColumn } from "mo/components/table";

import { ColorThemeMode } from "mo/model";
import { ResultLogger } from "../../result/loger";
import { ResultTable } from "../../result/table";

export function repeat<T>(arr: T[], n: number) {
  let result: T[] = []
  for (let i = 0; i < n; i++) {
    result = result.concat(arr)
  }
  return result
}

export const mockListData = new Array(300).fill(1).map((_, index: number) => ({
  name: `时间: 02-${index + 1} 13:18:00`,
  id: index+ 1
}))

export const mockData: ITabProps[] = [
  {
    id: '1',
    name: '查询日志',
    renderPane: <ResultLogger />,
    closable: false,
    icon: 'terminal',
  },
  {
    id: '2',
    name: '查询结果',
    renderPane: () => <ResultTable themeMode={ColorThemeMode.dark} loading={true} columns={columns} dataSource={dataSource} />,
    closable: false,
    icon: 'table',
  },
];
export const dataSource = [
  { provinceName: '湖北省', cityName: '武汉', confirmedCount: 37914, curedCount: 2519, deadCount: 1123, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '孝感', confirmedCount: 3114, curedCount: 313, deadCount: 62, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '黄冈', confirmedCount: 2817, curedCount: 611, deadCount: 68, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '荆州', confirmedCount: 1478, curedCount: 193, deadCount: 32, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '随州', confirmedCount: 1232, curedCount: 96, deadCount: 19, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '襄阳', confirmedCount: 1128, curedCount: 85, deadCount: 18, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '鄂州', confirmedCount: 1192, curedCount: 199, deadCount: 33, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '宜昌', confirmedCount: 906, curedCount: 92, deadCount: 15, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '黄石', confirmedCount: 980, curedCount: 170, deadCount: 13, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '荆门', confirmedCount: 902, curedCount: 112, deadCount: 28, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '咸宁', confirmedCount: 840, curedCount: 127, deadCount: 8, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '十堰', confirmedCount: 597, curedCount: 101, deadCount: 2, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '仙桃', confirmedCount: 514, curedCount: 63, deadCount: 17, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '天门', confirmedCount: 422, curedCount: 21, deadCount: 10, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '恩施州', confirmedCount: 244, curedCount: 71, deadCount: 4, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '潜江', confirmedCount: 116, curedCount: 12, deadCount: 5, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '高性能 React 表格组件 ali-react-table', confirmedCount: 10, curedCount: 8, deadCount: 0, updateTime: '2020-02-15' },
  { provinceName: '湖北省', cityName: '待明确地区', confirmedCount: 0, curedCount: 18, deadCount: 0, updateTime: '2020-02-06' },
  { provinceName: '湖北省', cityName: '未知地区', confirmedCount: 0, curedCount: 35, deadCount: 0, updateTime: '2020-02-02' },
  { provinceName: '湖北省', cityName: '恩施', confirmedCount: 87, curedCount: 0, deadCount: 0, updateTime: '2020-02-01' },
  { provinceName: '广东省', cityName: '深圳', confirmedCount: 406, curedCount: 115, deadCount: 0, updateTime: '2020-02-15' },
  { provinceName: '广东省', cityName: '广州', confirmedCount: 335, curedCount: 106, deadCount: 0, updateTime: '2020-02-15' },
  { provinceName: '广东省', cityName: '东莞', confirmedCount: 81, curedCount: 7, deadCount: 1, updateTime: '2020-02-15' },
  { provinceName: '广东省', cityName: '佛山', confirmedCount: 84, curedCount: 22, deadCount: 0, updateTime: '2020-02-15' },
  { provinceName: '广东省', cityName: '珠海', confirmedCount: 95, curedCount: 34, deadCount: 0, updateTime: '2020-02-15' },
]

export const columns: any[] = [
  { code: 'provinceName', name: '省份', width: 150, lock: false },
  { code: 'cityName', name: '城市', width: 150 },
  ...repeat<ArtColumn>(
    [
      { code: 'confirmedCount', name: '确诊', width: 100, align: 'left' },
      { code: 'curedCount', name: '治愈', width: 100, align: 'left' },
      { code: 'deadCount', name: '死亡', width: 100, align: 'left' },
    ],
    100
  ),
  { code: 'updateTime', name: '更新时间', width: 150, align: 'left' },
]
