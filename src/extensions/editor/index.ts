import * as molecule from 'mo/molecule.api';
import { IExtension } from 'mo/model/extension';
import { createQuickCreateTab, transformToEditorTab, updateStatusBarLanguage, updateStatusBarLocation } from '../helper';


export const ExtendsEditor: IExtension = {
  id: 'ExtendsEditor',
  name: 'Extends Editor',
  dispose() { },
  activate() {
    setTimeout(() => {
      // 初始化创建一个临时查询tab
      createQuickCreateTab();
    }, 1000)

    molecule.editor.onCloseTab((tabId, groupId) => {
      if (tabId !== undefined && groupId !== undefined) {
        molecule.editor.closeTab(tabId, groupId);
      }
    });

    molecule.editor.onCloseAll((groupId) => {
      if (groupId !== undefined) {
        molecule.editor.closeAll(groupId);
      }
    });

    molecule.editor.onCloseOther((tabItem, groupId) => {
      if (tabItem && groupId !== undefined) {
        molecule.editor.closeOther(tabItem, groupId);
      }
    });

    molecule.editor.onCloseToLeft((tabItem, groupId) => {
      if (tabItem && groupId !== undefined) {
        molecule.editor.closeToLeft(tabItem, groupId);
      }
    });

    molecule.editor.onCloseToRight((tabItem, groupId) => {
      if (tabItem && groupId !== undefined) {
        molecule.editor.closeToRight(tabItem, groupId);
      }
    });

    molecule.editor.onQucikCreate(() => createQuickCreateTab())
  },
};
