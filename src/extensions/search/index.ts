import * as molecule from "mo/molecule.api";
import { IEditorTab, IExtension, IFolderTreeNodeProps } from "mo/model";
import { cloneDeep } from "lodash";
import folderTreeData from "../data/folderTree.json";
import { transformToEditorTab } from "../helper";



export const ExtendsSearch: IExtension = {
  id: "ExtendsSearch",
  name: "Extends Search",
  activate() {
    molecule.search.onSearch(async (value, config) => {
      if (!value) return;
  
      // TODO: 待更换真实数据
      const data: any = cloneDeep(folderTreeData.data.children);
      molecule.search.setResult(data);
    })

    molecule.search.onResultClick((item) => {
      molecule.editor.open(transformToEditorTab(item));
    });

    molecule.search.onRefresh(() => {
      console.log("onRefresh")
    })

    molecule.search.onToolbarClick(() => {
      console.log("onToolbarClick")
    })
  },
  dispose() {}
}