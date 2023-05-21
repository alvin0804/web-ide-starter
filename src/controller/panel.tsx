import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import React from 'react';
import { IActionBarItemProps } from 'mo/components/actionBar';
import { Controller } from 'mo/react/controller';
import { PanelEvent } from 'mo/model/workbench/panel';
import {
    BuiltinService,
    IBuiltinService,
    IPanelService,
    IStatusBarService,
    PanelService,
    StatusBarService,
} from 'mo/services';
import { IMonacoService, MonacoService } from 'mo/monaco/monacoService';
import { QuickTogglePanelAction } from 'mo/monaco/quickTogglePanelAction';
import Output from 'mo/workbench/panel/output';
import type { UniqueId } from 'mo/common/types';
import { cloneDeep } from 'lodash';
import { Float, IStatusBarItem } from 'mo/model';
import { PanelStatusBarView } from 'mo/workbench/panel';

export interface IPanelController extends Partial<Controller> {
    onTabChange?(key: UniqueId): void;
    onToolbarClick?(e: React.MouseEvent, item: IActionBarItemProps): void;
    onClose?(key: UniqueId): void;
}

@singleton()
export class PanelController extends Controller implements IPanelController {
    private readonly panelService: IPanelService;
    private readonly monacoService: IMonacoService;
    private readonly builtinService: IBuiltinService;
    private readonly statusBarService: IStatusBarService;

    constructor() {
        super();
        this.panelService = container.resolve(PanelService);
        this.monacoService = container.resolve(MonacoService);
        this.builtinService = container.resolve(BuiltinService);
        this.statusBarService = container.resolve(StatusBarService);
    }

    public initView() {
        const {
            // builtInOutputPanel,
            builtInPanelToolbox,
            builtInPanelToolboxResize,
            STATUS_PANEL_INFO
        } = this.builtinService.getModules();
        // if (builtInOutputPanel) {
        //     const output = builtInOutputPanel;
        //     output.renderPane = (item) => (
        //         <Output
        //             onUpdateEditorIns={(instance) => {
        //                 // Please notice the problem about memory out
        //                 // 'Cause we didn't dispose the older instance
        //                 item.outputEditorInstance = instance;
        //             }}
        //             {...item}
        //         />
        //     );
        //     this.panelService.add(output);
        //     this.panelService.setActive(output.id);
        // }

        const toolbox = [builtInPanelToolboxResize, builtInPanelToolbox].filter(
            Boolean
        ) as IActionBarItemProps[];

        this.panelService.setState({
            toolbox,
        });


        // // const nextLeftItems = cloneDeep(this.statusBarService.getState().leftItems);
        // if(STATUS_PANEL_INFO) {
        //     const defaultPanelResultItem = {
        //         ...STATUS_PANEL_INFO,
        //         render: (item: IStatusBarItem) => {
        //             return <PanelStatusBarView {...item} />
        //         },
        //     }
        //     // this.statusBarService.add(defaultPanelResultItem, Float.left);
        // }

    }

    public readonly onTabChange = (key: UniqueId): void => {
        if (key) {
            this.panelService.setActive(key);
        }
        this.emit(PanelEvent.onTabChange, key);
    };

    public readonly onClose = (key: UniqueId) => {
        if (key) {
            this.emit(PanelEvent.onTabClose, key);
        }
    };

    public readonly onToolbarClick = (
        e: React.MouseEvent,
        item: IActionBarItemProps
    ): void => {
        const { PANEL_TOOLBOX_RESIZE, PANEL_TOOLBOX_CLOSE } = this.builtinService.getConstants();
        if (item.id === PANEL_TOOLBOX_CLOSE) {
            this.monacoService.commandService.executeCommand(
                QuickTogglePanelAction.ID
            );
        } else if (item.id === PANEL_TOOLBOX_RESIZE) {
            this.panelService.toggleMaximize();
        }
        this.emit(PanelEvent.onToolbarClick, e, item);
    };
}
