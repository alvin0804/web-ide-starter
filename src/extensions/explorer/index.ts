import * as molecule from 'mo/molecule.api';
import { IExtension } from 'mo/model/extension';
import { UniqueId } from 'mo/common/types';

// const removePanel = function (panel) {
//     molecule.explorer.removePanel(panel.id);
// };

export const ExtendsExplorer: IExtension = {
    id: 'ExtendsExplorer',
    name: 'Extends Explorer',
    activate() {
        // 初始化设置文件编辑器面板展开
        const { SAMPLE_FOLDER_PANEL_ID } = molecule.builtin.getConstants();
        if(SAMPLE_FOLDER_PANEL_ID) {
            molecule.explorer.setExpandedPanels([undefined, SAMPLE_FOLDER_PANEL_ID]);
        }

        molecule.explorer.onCollapseAllFolders(() => {
            console.log("折叠所有文件夹");
        })

        molecule.explorer.onPanelToolbarClick(() => {
            console.log("onPanelToolbarClick");
        })

        molecule.explorer.onClick(() => {
            console.log("onClick");
        })

        molecule.explorer.onCollapseChange((keys: UniqueId[]) => {
            molecule.explorer.setExpandedPanels(keys);
        })
    },

    dispose() {
        // TODO There should remove the onRemovePanel event
        // molecule.explorer.dispose(removePanel);
    },
};
