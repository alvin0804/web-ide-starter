import { IExtension } from 'mo/model/extension';
import { IExtensionService } from 'mo/services';
import * as molecule from 'mo/molecule.api';
import { CommandQuickSideBarViewAction } from 'mo/monaco/quickToggleSideBarAction';
import { UniqueId } from 'mo/common/types';

export const ExtendsActivityBar: IExtension = {
    id: 'ExtendsActivityBar',
    name: 'Extend The Default ActivityBar',
    activate(extensionCtx: IExtensionService) {

        molecule.activityBar.onChange((pre, cur) => {
            if (cur !== pre) {
                molecule.activityBar.setActive(cur);
                molecule.sidebar.setActive(cur);

                const { sidebar } = molecule.layout.getState();
                if (sidebar.hidden) {
                    extensionCtx.executeCommand(
                        CommandQuickSideBarViewAction.ID,
                        cur
                    );
                }
            } else {
                extensionCtx.executeCommand(
                    CommandQuickSideBarViewAction.ID,
                    cur
                );
            }
        });

        molecule.activityBar.onClick((selectedKey: UniqueId, item: molecule.model.IActivityBarItem) => {
            const { ACTIVITY_BAR_GLOBAL_LAYOUT_PANEL } = molecule.builtin.getConstants();
            
            if(item.type === 'global') {
                switch (selectedKey) {
                    case ACTIVITY_BAR_GLOBAL_LAYOUT_PANEL: {
                        molecule.layout.togglePanelVisibility();
                        // molecule.activityBar.setActive(selectedKey);
                        break;
                    } 
                }
            }
        })
    },

    dispose() {},
};
