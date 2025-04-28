import $ from 'jquery';
import * as Blockly from 'blockly/core';
import {
    app,
    Nav,
    Debug,
    HTMLTemplate,
    Msg,
    Workspace,
    Storage
} from 'mixly';
import PythonShell from './python-shell';
import LEVEL_SELECTOR_TEMPLATE from '../templates/html/level-selector.html';


const NavExt = {};
const LEVELS = [
    `<xml>
        <block type="initSettedMap_1"></block>
    </xml>`,
    `<xml>
        <block type="initSettedMap_2"></block>
    </xml>`,
    `<xml>
        <block type="initSettedMap_3"></block>
    </xml>`,
    `<xml>
        <block type="initSettedMap_4"></block>
    </xml>`,
    `<xml>
        <block type="initSettedMap_5"></block>
    </xml>`,
    `<xml>
        <block type="initSettedMap_6"></block>
    </xml>`,
    `<xml>
        <block type="initSettedMap_7"></block>
    </xml>`
];
NavExt.$shadow = $('<div style="position:absolute;z-index:1000;width:100%;background:transparent;bottom:0px;top:var(--nav-height);"></div>');
NavExt.count = 0;

NavExt.init = function () {
    PythonShell.init();
    const nav = app.getNav();

    nav.register({
        icon: 'icon-play-circled',
        title: '',
        id: 'python-steprun-btn',
        displayText: Blockly.Msg.MSG['step_run'],
        preconditionFn: () => {
            return true;
        },
        callback: () => {
            PythonShell.steprun().catch(Debug.error);
        },
        scopeType: Nav.Scope.LEFT,
        weight: 4
    });

    nav.register({
        icon: 'icon-play-circled',
        title: '',
        id: 'python-run-btn',
        displayText: Blockly.Msg.MSG['run'],
        preconditionFn: () => {
            return true;
        },
        callback: () => {
            PythonShell.run().catch(Debug.error);
        },
        scopeType: Nav.Scope.LEFT,
        weight: 5
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
            PythonShell.stop().catch(Debug.error);
        },
        scopeType: Nav.Scope.LEFT,
        weight: 6
    });

    const template = new HTMLTemplate(LEVEL_SELECTOR_TEMPLATE);
    const $selector = $(template.render());
    nav.getBoardSelector().before($selector);
    $selector.select2({
        width: '90px',
        minimumResultsForSearch: Infinity,
        dropdownCssClass: `mixly-scrollbar mixly-${template.getId()}`,
        dropdownAutoWidth: true,
        placeholder: '',
        language: Msg.nowLang
    });
    for (let i = 0; i < LEVELS.length; i++) {
        const option = new Option(`关卡 ${i + 1}`, i);
        $selector.append(option);
    }
    $selector.on('select2:select', (event) => {
        const { data } = event.params;
        const mainWorkspace = Workspace.getMain();
        const editor = mainWorkspace.getEditorsManager().getActive();
        editor.setValue(LEVELS[parseInt(data.id)], '.mix');
    });
    $selector.on('select2:opening', () => {
        NavExt.count += 1;
        $(document.body).append(NavExt.$shadow);
    });
    $selector.on('select2:closing', () => {
        NavExt.count -= 1;
        !NavExt.count && NavExt.$shadow.detach();
    });
    $selector.trigger('change');
    Storage.board('mix', LEVELS[0]);
    Storage.board('path', '');
}

export default NavExt;