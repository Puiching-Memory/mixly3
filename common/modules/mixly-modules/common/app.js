goog.loadJs('common', () => {

goog.require('path');
goog.require('hotkeys');
goog.require('Mixly.Url');
goog.require('Mixly.Config');
goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.Drag');
goog.require('Mixly.Nav');
goog.require('Mixly.Menu');
goog.require('Mixly.ContextMenu');
goog.require('Mixly.Workspace');
goog.require('Mixly.FooterBar');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.LayerExt');
goog.require('Mixly.Debug');
goog.require('Mixly.Component');
goog.require('Mixly.EditorMix');
goog.require('Mixly.Electron.Loader');
goog.require('Mixly.Electron.FS');
goog.require('Mixly.Electron.File');
goog.require('Mixly.Electron.LibManager');
goog.require('Mixly.Electron.Serial');
goog.require('Mixly.Electron.ArduShell');
goog.require('Mixly.Electron.BU');
goog.require('Mixly.Electron.PythonShell');
goog.require('Mixly.Web.BU');
goog.require('Mixly.Web.FS');
goog.require('Mixly.Web.File');
goog.require('Mixly.Web.Serial');
goog.require('Mixly.WebCompiler.ArduShell');
goog.require('Mixly.WebSocket.File');
goog.require('Mixly.WebSocket.Serial');
goog.require('Mixly.WebSocket.ArduShell');
goog.require('Mixly.WebSocket.BU');
goog.provide('Mixly.App');

const {
    Url,
    Config,
    Env,
    Msg,
    Drag,
    Nav,
    Menu,
    ContextMenu,
    Workspace,
    FooterBar,
    HTMLTemplate,
    LayerExt,
    Debug,
    Component,
    EditorMix,
    Electron = {},
    Web = {},
    WebCompiler = {},
    WebSocket = {}
} = Mixly;

const { Loader } = Electron;

let currentObj = null;

if (goog.isElectron) {
    currentObj = Electron;
} else {
    if (Env.hasSocketServer) {
        currentObj = WebSocket;
    } else {
        currentObj = Web;
    }
}

const {
    FS,
    File,
    LibManager,
    BU,
    PythonShell,
    Serial
} = currentObj;

let ArduShell = null;
if (!goog.isElectron && Env.hasCompiler) {
    ArduShell = WebCompiler.ArduShell;
} else {
    ArduShell = currentObj.ArduShell;
}

const { BOARD, SELECTED_BOARD } = Config;


class App extends Component {
    static {
        HTMLTemplate.add(
            'html/app.html',
            new HTMLTemplate(goog.readFileSync(path.join(Env.templatePath, 'html/app.html')))
        );
    }

    #resizeObserver_ = null;
    #workspace_ = null;
    #nav_ = null;
    #footerbar_ = null;

    constructor(element) {
        super();
        const $content = $(HTMLTemplate.get('html/app.html').render());
        $content.on('contextmenu', (e) => e.preventDefault());
        this.setContent($content);
        this.mountOn($(element));
        this.#nav_ = new Nav();
        this.#nav_.mountOn($content.find('.mixly-nav'));
        this.#workspace_ = new Workspace($content.find('.mixly-workspace')[0]);
        const editorsManager = this.#workspace_.getEditorsManager();
        editorsManager.add({
            type: '.mix',
            id: 'Untitled-1.mix',
            name: 'Untitled-1.mix',
            title: 'Untitled-1.mix',
            favicon: 'fileicon-mix'
        });
        this.#footerbar_ = new FooterBar();
        this.#footerbar_.mountOn($content.find('.mixly-footerbar'));
        this.#addEventsListenerForNav_();
        this.#addObserver_();
        Mixly.mainStatusBarTabs = this.#workspace_.getStatusBarsManager();
        Serial.refreshPorts();
        if (goog.isElectron) {
            PythonShell.init();
        }
    }

    #addEventsListenerForNav_() {
        const editorsManager = this.#workspace_.getEditorsManager();
        this.#nav_.register({
            id: 'home-btn',
            preconditionFn: () => {
                return true;
            },
            callback: () => {
                this.#onbeforeunload_();
            },
            scopeType: Nav.Scope.LEFT,
            weight: -1
        });
        this.#nav_.register({
            icon: 'icon-ccw',
            title: 'undo(ctrl+z)',
            id: 'undo-btn',
            displayText: Msg.Lang['nav.btn.undo'],
            preconditionFn: () => {
                return !!editorsManager.getActive();
            },
            callback: () => editorsManager.getActive().undo(),
            scopeType: Nav.Scope.LEFT,
            weight: 0
        });
        this.#nav_.register({
            icon: 'icon-cw',
            title: 'redo(ctrl+y)',
            id: 'redo-btn',
            displayText: Msg.Lang['nav.btn.redo'],
            preconditionFn: () => {
                return !!editorsManager.getActive();
            },
            callback: () => editorsManager.getActive().redo(),
            scopeType: Nav.Scope.LEFT,
            weight: 1
        });

        this.#nav_.register({
            icon: 'icon-link',
            title: '',
            id: 'port-add-btn',
            displayText: Msg.Lang['nav.btn.addDevice'],
            preconditionFn: () => {
                if (goog.isElectron || Env.hasSocketServer) {
                    return false;
                }
                return true;
            },
            callback: () => BU.requestPort().catch(Debug.error),
            scopeType: Nav.Scope.LEFT,
            weight: 3
        });

        this.#nav_.register({
            icon: 'icon-check',
            title: '',
            id: 'arduino-compile-btn',
            displayText: Msg.Lang['nav.btn.compile'],
            preconditionFn: () => {
                if (!goog.isElectron && !Env.hasSocketServer && !Env.hasCompiler) {
                    return false;
                }
                if (!SELECTED_BOARD?.nav?.compile || !SELECTED_BOARD?.nav?.upload) {
                    return false;
                }
                const workspace = Workspace.getMain();
                const editorsManager = workspace.getEditorsManager();
                const editor = editorsManager.getActive();
                if (!editor) {
                    return false;
                }
                if (editor instanceof EditorMix) {
                    return true;
                }
                return false;
            },
            callback: () => ArduShell.initCompile(),
            scopeType: Nav.Scope.LEFT,
            weight: 4
        });

        this.#nav_.register({
            icon: 'icon-upload',
            title: '',
            id: 'arduino-upload-btn',
            displayText: Msg.Lang['nav.btn.upload'],
            preconditionFn: () => {
                if (!goog.isElectron && !Env.hasSocketServer && !Env.hasCompiler) {
                    return false;
                }
                if (!SELECTED_BOARD?.nav?.compile || !SELECTED_BOARD?.nav?.upload) {
                    return false;
                }
                const workspace = Workspace.getMain();
                const editorsManager = workspace.getEditorsManager();
                const editor = editorsManager.getActive();
                if (!editor) {
                    return false;
                }
                if (editor instanceof EditorMix) {
                    return true;
                }
                return false;
            },
            callback: () => ArduShell.initUpload(),
            scopeType: Nav.Scope.LEFT,
            weight: 5
        });

        this.#nav_.register({
            icon: 'icon-upload-1',
            title: '',
            id: 'command-burn-btn',
            displayText: Msg.Lang['nav.btn.burn'],
            preconditionFn: () => {
                if (goog.isElectron || Env.hasSocketServer) {
                    return SELECTED_BOARD?.nav?.burn;
                }
                if (Serial.devicesRegistry.hasKey('serial')) {
                    return SELECTED_BOARD?.nav?.burn;
                } else {
                    return false;
                }
            },
            callback: () => BU.initBurn(),
            scopeType: Nav.Scope.LEFT,
            weight: 3
        });

        this.#nav_.register({
            icon: 'icon-upload',
            title: '',
            id: 'command-upload-btn',
            displayText: Msg.Lang['nav.btn.upload'],
            preconditionFn: () => {
                return SELECTED_BOARD?.nav?.upload && !SELECTED_BOARD?.nav?.compile;
            },
            callback: () => BU.initUpload(),
            scopeType: Nav.Scope.LEFT,
            weight: 5
        });

        this.#nav_.register({
            icon: 'icon-play-circled',
            title: '',
            id: 'python-run-btn',
            displayText: Msg.Lang['nav.btn.run'],
            preconditionFn: () => {
                return goog.isElectron && SELECTED_BOARD?.nav?.run;
            },
            callback: () => PythonShell.run(),
            scopeType: Nav.Scope.LEFT,
            weight: 4
        });

        this.#nav_.register({
            icon: 'icon-cancel',
            title: '',
            id: 'python-stop-btn',
            displayText: Msg.Lang['nav.btn.stop'],
            preconditionFn: () => {
                return goog.isElectron && SELECTED_BOARD?.nav?.cancel;
            },
            callback: () => PythonShell.stop(),
            scopeType: Nav.Scope.LEFT,
            weight: 5
        });

        this.#nav_.register({
            icon: 'icon-usb',
            title: '',
            id: 'serial-open-btn',
            displayText: Msg.Lang['statusbar.serial.port'],
            preconditionFn: () => {
                return true;
            },
            callback: () => {
                const statusBarsManager = this.#workspace_.getStatusBarsManager();
                statusBarsManager.openSelectedPort();
            },
            scopeType: Nav.Scope.LEFT,
            weight: 10
        });

        /*const leftSideBarOption = this.#nav_.register({
            icon: 'codicon-layout-sidebar-left-off',
            title: '操作左侧边栏',
            id: 'left-sidebar-btn',
            preconditionFn: () => {
                return true;
            },
            callback: (element) => {
                const $a = $(element).children('a');
                const drag = this.#workspace_.dragVLeft;
                if (drag.shown === Drag.Extend.NEGATIVE) {
                    drag.exitfull(Drag.Extend.NEGATIVE);
                } else {
                    drag.full(Drag.Extend.NEGATIVE);
                }
            },
            scopeType: Nav.Scope.CENTER,
            weight: 1
        });

        const leftSideBarEvents = this.#workspace_.dragVLeft;
        leftSideBarEvents.bind('onfull', (type) => {
            const { $btn } = leftSideBarOption;
            const $a = $btn.children('a');
            if (type !== Drag.Extend.NEGATIVE) {
                return;
            }
            $a.removeClass('codicon-layout-sidebar-left');
            $a.addClass('codicon-layout-sidebar-left-off');
        });

        leftSideBarEvents.bind('exitfull', (type) => {
            const { $btn } = leftSideBarOption;
            const $a = $btn.children('a');
            if (type !== Drag.Extend.NEGATIVE) {
                return;
            }
            $a.removeClass('codicon-layout-sidebar-left-off');
            $a.addClass('codicon-layout-sidebar-left');
        });

        const rightSideBarOption = this.#nav_.register({
            icon: 'codicon-layout-sidebar-right-off',
            title: '操作右侧边栏',
            id: 'right-sidebar-btn',
            preconditionFn: () => {
                return true;
            },
            callback: (element) => {
                const $a = $(element).children('a');
                const drag = this.#workspace_.dragVRight;
                if (drag.shown === Drag.Extend.POSITIVE) {
                    drag.exitfull(Drag.Extend.POSITIVE);
                } else {
                    drag.full(Drag.Extend.POSITIVE);
                }
            },
            scopeType: Nav.Scope.CENTER,
            weight: 3
        });

        const rightSideBarEvents = this.#workspace_.dragVRight;
        rightSideBarEvents.bind('onfull', (type) => {
            const { $btn } = rightSideBarOption;
            const $a = $btn.children('a');
            if (type !== Drag.Extend.POSITIVE) {
                return;
            }
            $a.removeClass('codicon-layout-sidebar-right');
            $a.addClass('codicon-layout-sidebar-right-off');
        });

        rightSideBarEvents.bind('exitfull', (type) => {
            const { $btn } = rightSideBarOption;
            const $a = $btn.children('a');
            if (type !== Drag.Extend.POSITIVE) {
                return;
            }
            $a.removeClass('codicon-layout-sidebar-right-off');
            $a.addClass('codicon-layout-sidebar-right');
        });*/

        const bottomSideBarOption = this.#nav_.register({
            icon: 'codicon-layout-panel-off',
            title: Msg.Lang['nav.btn.toggleStatusbar'],
            id: 'bottom-sidebar-btn',
            preconditionFn: () => {
                return true;
            },
            callback: (element) => {
                const $a = $(element).children('a');
                const drag = this.#workspace_.dragH;
                if (drag.shown === Drag.Extend.POSITIVE) {
                    drag.exitfull(Drag.Extend.POSITIVE);
                } else {
                    drag.full(Drag.Extend.POSITIVE);
                }
            },
            scopeType: Nav.Scope.CENTER,
            weight: 2
        });

        const bottomSideBarEvents = this.#workspace_.dragH;
        bottomSideBarEvents.bind('onfull', (type) => {
            const { $btn } = bottomSideBarOption;
            const $a = $btn.children('a');
            if (type !== Drag.Extend.POSITIVE) {
                return;
            }
            $a.removeClass('codicon-layout-panel');
            $a.addClass('codicon-layout-panel-off');
        });

        bottomSideBarEvents.bind('exitfull', (type) => {
            const { $btn } = bottomSideBarOption;
            const $a = $btn.children('a');
            if (type !== Drag.Extend.POSITIVE) {
                return;
            }
            $a.removeClass('codicon-layout-panel-off');
            $a.addClass('codicon-layout-panel');
        });

        const fileMenu = new Menu();
        const settingMenu = new Menu();

        this.#nav_.register({
            id: 'file',
            displayText: `${Msg.Lang['nav.btn.file']}(F)`,
            scopeType: Nav.Scope.RIGHT,
            weight: 1,
            menu: fileMenu
        });

        this.#nav_.register({
            id: 'setting',
            displayText: `${Msg.Lang['nav.btn.setting']}(S)`,
            scopeType: Nav.Scope.RIGHT,
            weight: 2,
            menu: settingMenu
        });

        fileMenu.add({
            weight: 0,
            id: 'new',
            preconditionFn: () => {
                return true;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['nav.btn.file.new'], 'Ctrl+N'),
                callback: () => File.new()
            }
        });

        hotkeys('ctrl+n', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            File.new();
        });

        fileMenu.add({
            weight: 1,
            id: 'open-file',
            preconditionFn: () => {
                return true;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['nav.btn.file.open'], 'Ctrl+O'),
                callback: (key, opt) => File.open()
            }
        });

        hotkeys('ctrl+o', function(event) {
            event.preventDefault();
            File.open();
        });

        fileMenu.add({
            weight: 2,
            id: 'sep1',
            data: '---------'
        });

        fileMenu.add({
            weight: 3,
            id: 'save',
            preconditionFn: () => {
                return true;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['nav.btn.file.save'], 'Ctrl+S'),
                callback: () => File.save()
            }
        });

        hotkeys('ctrl+s', function(event) {
            event.preventDefault();
            File.save();
        });

        fileMenu.add({
            weight: 4,
            id: 'save-as',
            preconditionFn: () => {
                return true;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['nav.btn.file.saveAs'], 'Ctrl+Shift+S'),
                callback: () => File.saveAs()
            }
        });

        hotkeys('ctrl+shift+s', function(event) {
            event.preventDefault();
            File.saveAs();
        });

        fileMenu.add({
            weight: 5,
            id: 'sep2',
            preconditionFn: () => {
                return goog.isElectron && BOARD?.nav?.setting?.thirdPartyLibrary;
            },
            data: '---------'
        });

        fileMenu.add({
            weight: 6,
            id: 'export',
            preconditionFn: () => {
                return goog.isElectron && BOARD?.nav?.setting?.thirdPartyLibrary;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['nav.btn.file.exportAs'], 'Ctrl+E'),
                callback: () => File.exportLib()
            }
        });

        if (goog.isElectron && BOARD?.nav?.setting?.thirdPartyLibrary) {
            hotkeys('ctrl+e', function(event) {
                event.preventDefault();
                File.exportLib();
            });
        }

        settingMenu.add({
            weight: 0,
            id: 'feedback',
            preconditionFn: () => {
                return true;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['nav.btn.setting.feedback'], 'Ctrl+Shift+F'),
                callback: () => {
                    const href = 'https://gitee.com/bnu_mixly/mixly3/issues';
                    Url.open(href);
                }
            }
        });

        hotkeys('ctrl+shift+f', function(event) {
            const href = 'https://gitee.com/bnu_mixly/mixly3/issues';
            Url.open(href);
        });

        settingMenu.add({
            weight: 1,
            id: 'wiki',
            preconditionFn: () => {
                return true;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem('文档', 'Ctrl+H'),
                callback: () => {
                    const href = 'https://mixly.readthedocs.io/zh-cn/latest/contents.html';
                    Url.open(href);
                }
            }
        });

        hotkeys('ctrl+h', function(event) {
            const href = 'https://mixly.readthedocs.io/zh-cn/latest/contents.html';
            Url.open(href);
        });

        settingMenu.add({
            weight: 2,
            id: 'sep1',
            preconditionFn: () => {
                return goog.isElectron && BOARD?.nav?.setting?.thirdPartyLibrary;
            },
            data: '---------'
        });

        settingMenu.add({
            weight: 3,
            id: 'manage-libraries',
            preconditionFn: () => {
                return goog.isElectron && BOARD?.nav?.setting?.thirdPartyLibrary;
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['nav.btn.setting.manageLibs'], 'Ctrl+M'),
                callback: () => LibManager.showManageDialog()
            }
        });

        if (goog.isElectron && BOARD?.nav?.setting?.thirdPartyLibrary) {
            hotkeys('ctrl+m', function(event) {
                LibManager.showManageDialog();
            });
        }
    }

    #addObserver_() {
        this.#resizeObserver_ = new ResizeObserver((entries) => {
            let contentRect = entries[0].contentRect;
            if (!(contentRect.width || contentRect.height)) return;
            this.resize();
        });
        this.#resizeObserver_.observe(this.getContent()[0]);
    }

    #onbeforeunload_() {
        if (goog.isElectron) {
            Loader.onbeforeunload();
        } else {
            let href = path.join(Env.srcDirPath, 'index.html') + '?' + Url.jsonToUrl({ boardType: BOARD.boardType });
            window.location.replace(href);
        }
    }

    getNav() {
        return this.#nav_;
    }

    getWorkspace() {
        return this.#workspace_;
    }

    getFooterBar() {
        return this.#footerbar_;
    }

    resize() {
        this.#nav_.resize();
        this.#workspace_.resize();
        this.#footerbar_.resize();
    }

    removeSkeleton() {
        const $appLoading = $('.mixly-app-loading');
        $appLoading.remove();
    }

    dispose() {
        this.#resizeObserver_.disconnect();
        this.#workspace_.dispose();
        super.dispose();
    }
}

Mixly.App = App;

});