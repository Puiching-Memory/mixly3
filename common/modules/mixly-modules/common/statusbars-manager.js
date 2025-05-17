goog.loadJs('common', () => {

goog.require('path');
goog.require('layui');
goog.require('Mixly.XML');
goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.Registry');
goog.require('Mixly.Events');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.StatusBarOutput');
goog.require('Mixly.StatusBarSerial');
goog.require('Mixly.StatusBarFS');
goog.require('Mixly.StatusBarLibs');
goog.require('Mixly.StatusBarAmpy')
goog.require('Mixly.PagesManager');
goog.require('Mixly.ContextMenu');
goog.require('Mixly.DropdownMenu');
goog.require('Mixly.Menu');
goog.require('Mixly.IdGenerator');
goog.require('Mixly.Serial');
goog.require('Mixly.Config');
goog.require('Mixly.Debug');
goog.provide('Mixly.StatusBarsManager');

const {
    XML,
    Env,
    Msg,
    Registry,
    Events,
    HTMLTemplate,
    StatusBarOutput,
    StatusBarSerial,
    StatusBarFS,
    StatusBarLibs,
    StatusBarAmpy,
    PagesManager,
    ContextMenu,
    DropdownMenu,
    Menu,
    IdGenerator,
    Serial,
    Config,
    Debug
} = Mixly;

const { layer } = layui;
const { BOARD } = Config;


class StatusBarsManager extends PagesManager {
    static {
        HTMLTemplate.add(
            'html/statusbar/statusbars-manager.html',
            new HTMLTemplate(goog.readFileSync(path.join(Env.templatePath, 'html/statusbar/statusbars-manager.html')))
        );
        HTMLTemplate.add(
            'html/statusbar/statusbars-tab.html',
            new HTMLTemplate(goog.readFileSync(path.join(Env.templatePath, 'html/statusbar/statusbars-tab.html')))
        );
        this.typesRegistry = new Registry();
        this.managersRegistry = new Registry();
        this.typesRegistry.register(['#default', 'terminal'], StatusBarOutput);
        this.typesRegistry.register(['serial'], StatusBarSerial);
        this.typesRegistry.register(['board-fs'], StatusBarFS);
        this.typesRegistry.register(['libs'], StatusBarLibs);
        this.typesRegistry.register(['ampy'], StatusBarAmpy);

        this.getMain = function() {
            if (!this.managersRegistry.length()) {
                return null;
            }
            const key = this.managersRegistry.keys()[0];
            return this.managersRegistry.getItem(key);
        }

        this.add = function(manager) {
            this.managersRegistry.register(manager.id, manager);
        }

        this.remove = function(manager) {
            this.managersRegistry.unregister(manager.id);
        }
    }

    #shown_ = false;
    #dropdownMenu_ = null;

    constructor(element) {
        const managerHTMLTemplate = HTMLTemplate.get('html/statusbar/statusbars-manager.html');
        const tabHTMLTemplate = HTMLTemplate.get('html/statusbar/statusbars-tab.html');
        const $manager = $(managerHTMLTemplate.render());
        const $tab = $(tabHTMLTemplate.render());
        super({
            parentElem: element,
            managerContentElem: $manager[0],
            bodyElem: $manager.find('.body')[0],
            tabElem: $manager.find('.tabs')[0],
            tabContentElem: $tab[0],
            typesRegistry: StatusBarsManager.typesRegistry
        });
        this.tabId = tabHTMLTemplate.id;
        this.id = IdGenerator.generate();
        this.addEventsType(['show', 'hide', 'onSelectMenu', 'getMenu']);
        $tab.find('.statusbar-close > button').click(() => this.hide());
        this.#addDropdownMenu_();
        this.#addEventsListener_();
        StatusBarsManager.add(this);
    }

    getStatusBarById(id) {
        return this.get(id);
    }

    removeStatusBarById(id) {
        this.remove(id);
    }

    show() {
        this.runEvent('show');
    }

    hide() {
        this.runEvent('hide');
    }
    
    toggle() {
        this.isShown() ? this.hide() : this.show();
    }

    isShown() {
        return this.#shown_;
    }

    openSelectedPort() {
        const port = Serial.getSelectedPortName();
        if (port) {
            this.show();
            this.#onSelectMenu_(port);
        } else {
            layer.msg(Msg.Lang['statusbar.serial.noDevice'], {
                time: 1000
            });
        }
    }

    #addDropdownMenu_() {
        const selector = `div[m-id="${this.tabId}"] > .statusbar-dropdown-menu > .layui-btn`;
        let menu = new Menu();
        let serialChildMenu = new Menu(true);
        menu.add({
            weight: 0,
            id: 'serial-default',
            preconditionFn: () => {
                return !!Serial.getCurrentPortsName().length;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['statusbar.openSelectedPort'], ''),
                callback: (key, opt) => {
                    this.openSelectedPort();
                }
            }
        });
        menu.add({
            weight: 1,
            id: 'serial',
            children: serialChildMenu,
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['statusbar.openPort'], '')
            }
        });

        /*menu.add({
            weight: 2,
            id: 'lib',
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem('第三方库管理', ''),
                callback: (key, opt) => {
                    this.add('libs', 'libs', '第三方库管理');
                    this.changeTo('libs');
                }
            }
        });*/

        if (['micropython', 'circuitpython'].includes(BOARD.language.toLowerCase())
            && !['BBC micro:bit', 'Mithon CC'].includes(BOARD.boardType)) {
            menu.add({
                weight: 2,
                id: 'sep1',
                data: '---------'
            });
            menu.add({
                weight: 3,
                id: 'ampy',
                data: {
                    isHtmlName: true,
                    name: ContextMenu.getItem(Msg.Lang['statusbar.ampy'], ''),
                    callback: (key, opt) => {
                        this.add({
                            id: 'ampy',
                            type: 'ampy',
                            name: Msg.Lang['statusbar.ampy'],
                            title: Msg.Lang['statusbar.ampy']
                        });
                        this.changeTo('ampy');
                    }
                }
            });
        }
        serialChildMenu.bind('onRead', () => {
            const options = this.#getMenu_() ?? {};
            options.list = options.list ?? [];
            options.empty = options.empty ?? Msg.Lang['statusbar.serial.noPort'];
            const result = [];
            if (!options.list.length) {
                result.push({
                    weight: 1,
                    id: 'empty',
                    data: {
                        isHtmlName: true,
                        name: options.empty,
                        disabled: true
                    }
                });
            }
            for (let i in options.list) {
                result.push({
                    weight: 1,
                    id: `serial${i}`,
                    data: {
                        isHtmlName: true,
                        name: options.list[i],
                        callback: (key, opt) => this.#onSelectMenu_(options.list[i])
                    }
                });
            }
            return result;
        });
        this.#dropdownMenu_ = new DropdownMenu(selector);
        this.#dropdownMenu_.register('menu', menu);
        this.#dropdownMenu_.bind('getMenu', () => 'menu');
    }

    #onSelectMenu_(port) {
        this.runEvent('onSelectMenu', port);
    }

    #getMenu_() {
        let menus = this.runEvent('getMenu');
        if (menus && menus.length) {
            return menus[0];
        }
        return { list: [], empty: Msg.Lang['statusbar.dropdownMenu.noOptions'] };
    }

    #addEventsListener_() {
        this.bind('getMenu', () => {
            return StatusBarSerial.getMenu();
        });

        this.bind('onSelectMenu', (port) => {
            this.add('serial', port);
            this.changeTo(port);
            const statusBarSerial = this.getStatusBarById(port);
            if (statusBarSerial.isInited() && !statusBarSerial.isOpened()) {
                statusBarSerial.open().catch(Debug.error);
            }
        });
    }

    getDropdownMenu() {
        return this.#dropdownMenu_;
    }

    dispose() {
        StatusBarsManager.remove(this);
        super.dispose();
    }
}

Mixly.StatusBarsManager = StatusBarsManager;

});