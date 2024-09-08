import { app, Nav } from 'mixly';
import * as Blockly from 'blockly/core';
import PythonShell from './python-shell';

const NavExt = {};

NavExt.init = async function () {
    const nav = app.getNav();

    nav.register({
        icon: 'icon-play-circled',
        title: '',
        id: 'python-run-btn',
        displayText: Blockly.Msg.MSG['run'],
        preconditionFn: () => {
            return true;
        },
        callback: () => {
            PythonShell.run();
        },
        scopeType: Nav.Scope.LEFT,
        weight: 4
    });

    nav.register({
        icon: 'icon-cancel',
        title: '',
        id: 'python-stop-btn',
        displayText: Blockly.Msg.MSG['stop'],
        preconditionFn: () => {
            return true;
        },
        callback: () => {
            PythonShell.stop();
        },
        scopeType: Nav.Scope.LEFT,
        weight: 5
    });

    await PythonShell.init();
}

export default NavExt;