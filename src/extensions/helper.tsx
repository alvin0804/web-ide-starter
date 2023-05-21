import * as molecule from 'mo/molecule.api';
import { Float, IEditorTab, IFolderTreeNodeProps, IStatusBarItem } from "mo/model";
import dayjs from 'dayjs';
import { formatSql } from 'mo/common/sql';


export const STATUS_BAR_LANGUAGE: IStatusBarItem = {
  id: 'LanguageStatus',
  sortIndex: 3,
}

export const STATUS_BAR_LOCATION: IStatusBarItem = {
  id: 'Location',
  sortIndex: 4
}

const statusIconMap = {
  SUCCESS: { name: 'SUCCESS', color: '#00f' },
  FAILED: { name: 'FAILED', color: '#f00' },
  RUNNING: { name: 'RUNNING', color: '#6299b7' },
  STOPED: { name: 'STOPED', color: '#f00' }
}
type StatusIconEnum = keyof typeof statusIconMap;
function getStatusIcon(status: StatusIconEnum) {
  const item: any = statusIconMap[status] || {};
  return <div style={Object.assign({ fontSize: '10px', fontWeight: '800' }, item)}>{item?.name}</div>;
}

export function transformToEditorTab(item: IFolderTreeNodeProps): IEditorTab {
  const tabData: IEditorTab = {
    ...item,
    id: item.id?.toString(),
    data: {
      path: item.location,
      ...(item.data || {}),
      value: formatSql(item.data.value)
    },
    breadcrumb: item.location
      ? item.location
        .split('/')
        .map((local: string) => ({ id: local, name: local }))
      : [],
    // engine: 'spark'
    
    // editable: true,
    // status: "edited",

    // success pass workspace-trusted
    // icon: <Icon type={"pass"} style={{ color: '#5ecc71' }}></Icon>

    // failed run-errors
    // icon: <Icon type={"workspace-untrusted"} style={{ color: '#de2f2d' }}></Icon>

    // stop debug-disconnect
    // icon: <Icon type={"beaker-stop"} style={{ color: '#de2f2d' }}></Icon>

    // running vm-running
    // icon: <Icon type={"vm-running"} style={{ color: '#5ecc71' }}></Icon>

    // default code

    // icon: createElement(SuccessIcon)
    // icon: 'database',
    // icon: <div style={{ fontSize: '10px', color: '#6299b7', fontWeight: '800' }}>SPARK</div>,
  };
  return tabData;
}


export function updateStatusBarLanguage(language: string) {
  if (!language) return;
  language = language.toUpperCase();
  const languageStatusItem = molecule.statusBar.getStatusBarItem(STATUS_BAR_LANGUAGE.id, Float.left);
  if (languageStatusItem) {
    languageStatusItem.name = language;
    molecule.statusBar.update(languageStatusItem, Float.left);
  } else {
    molecule.statusBar.add(Object.assign({}, STATUS_BAR_LANGUAGE, { name: language }), Float.left);
  }
}


export function updateStatusBarLocation(location: string) {
  if (!location) return;

  const locationStatusItem = molecule.statusBar.getStatusBarItem(STATUS_BAR_LOCATION.id, Float.left);
  if (locationStatusItem) {
    locationStatusItem.name = `Location(${location})`;
    molecule.statusBar.update(locationStatusItem, Float.left);
  } else {
    molecule.statusBar.add(Object.assign({}, STATUS_BAR_LOCATION, { name: `Location(${location})` }), Float.left);
  }
}

/**
 * 快速创建编辑器tab
 */
export function createQuickCreateTab() {
  const timestamp = Date.now();
  const filename = ['临时查询', dayjs(timestamp).format("HH:mm:ss").toString()].join("_");
  const currentItem: any = {
    icon: 'file-code',
    "id": timestamp,
    "name": filename,
    "location": filename,
    "fileType": "File",
    "isLeaf": true,
    data: {
      // eslint-disable-next-line
      value: "SELECT ",
      language: 'sql'
    },
  }

  molecule.editor.open(transformToEditorTab(currentItem));
  updateStatusBarLanguage(currentItem.data.language);
  updateStatusBarLocation(currentItem.location);
}