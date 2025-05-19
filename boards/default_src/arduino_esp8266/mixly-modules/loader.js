import * as goog from 'goog';
import { Msg } from 'blockly/core';
import { Workspace, Menu } from 'mixly';
import FSArduEsp8266Handler from './fs-board-handler';


export default function addBoardFSItem () {
    const mainWorkspace = Workspace.getMain();
    const statusBarsManager = mainWorkspace.getStatusBarsManager();
    const dropdownMenu = statusBarsManager.getDropdownMenu();
    const menu = dropdownMenu.getItem('menu');
    menu.add({
        weight: 2,
        type: 'sep1',
        preconditionFn: () => {
            return goog.isElectron;
        },
        data: '---------'
    });
    menu.add({
        weight: 3,
        type: 'filesystem-tool',
        preconditionFn: () => {
            return goog.isElectron;
        },
        data: {
            isHtmlName: true,
            name: Menu.getItem(Msg.BOARD_FS),
            callback: () => {
                statusBarsManager.add({
                    type: 'board-fs',
                    id: 'board-fs',
                    name: Msg.BOARD_FS,
                    title: Msg.BOARD_FS
                });
                statusBarsManager.changeTo('board-fs');
                const fsStatusBar = statusBarsManager.getStatusBarById('board-fs');
                fsStatusBar.setHandler(new FSArduEsp8266Handler());
            }
        }
    });
}