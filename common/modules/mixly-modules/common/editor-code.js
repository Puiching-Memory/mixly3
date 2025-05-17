goog.loadJs('common', () => {

goog.require('ace');
goog.require('ace.ExtLanguageTools');
goog.require('Mixly.Config');
goog.require('Mixly.XML');
goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.ContextMenu');
goog.require('Mixly.IdGenerator');
goog.require('Mixly.Menu');
goog.require('Mixly.EditorMonaco');
goog.provide('Mixly.EditorCode');

const {
    Config,
    XML,
    Env,
    Msg,
    ContextMenu,
    IdGenerator,
    Menu,
    EditorMonaco
} = Mixly;
const { USER } = Config;

class EditorCode extends EditorMonaco {
    #contextMenu_ = null;

    constructor() {
        super();
    }

    init() {
        super.init();
        this.setLanguage('text');
        this.setTabSize(4);
        this.#addContextMenu_();
        this.setTheme(USER.theme);
    }

    onMounted() {
        super.onMounted();
        this.#addChangeEventListenerExt_();
    }

    #addContextMenu_() {
        this.#contextMenu_ = new ContextMenu(`div[page-id="${this.getId()}"]`, {
            zIndex: 300
        });
        let menu = new Menu();
        menu.add({
            weight: 0,
            id: 'cut',
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['editor.contextMenu.cut'], 'Ctrl+X'),
                callback: (key, opt) => this.cut()
            }
        });
        menu.add({
            weight: 1,
            id: 'copy',
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['editor.contextMenu.copy'], 'Ctrl+C'),
                callback: (key, opt) => this.copy()
            }
        });
        menu.add({
            weight: 2,
            id: 'paste',
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['editor.contextMenu.paste'], 'Ctrl+V'),
                callback: (key, opt) => this.paste()
            }
        });
        menu.add({
            weight: 3,
            id: 'sep1',
            data: '---------'
        });
        menu.add({
            weight: 4,
            id: 'togglecomment',
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['editor.contextMenu.togglecomment'], 'Ctrl+/'),
                callback: (key, opt) => this.commentLine()
            }
        });
        menu.add({
            weight: 5,
            id: 'toggleBlockComment',
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem(Msg.Lang['editor.contextMenu.toggleBlockComment'], 'Shift+Alt+A'),
                callback: (key, opt) => this.blockComment()
            }
        });
        this.#contextMenu_.register('code', menu);
        this.#contextMenu_.bind('getMenu', () => 'code');
    }

    getContextMenu() {
        return this.#contextMenu_;
    }

    setValue(data, ext) {
        this.disableChangeEvent();
        super.setValue(data, ext);
        this.setLanguage(this.getLanguageByExt(ext));
        this.enableChangeEvent();
    }

    getLanguageByExt(ext) {
        let language = 'plaintext';
        switch(ext) {
        case '.json':
            language = 'json';
            break;
        case '.c':
        case '.cpp':
        case '.h':
        case '.hpp':
        case '.ino':
            language = 'cpp';
            break;
        case '.js':
            language = 'javascript';
            break;
        case '.py':
            language = 'python';
            break;
        case '.lua':
            language = 'lua';
            break;
        case '.md':
        case '.mdx':
            language = 'markdown';
            break;
        default:
            language = 'plaintext';
        }
        return language;
    }

    #addChangeEventListenerExt_() {
        this.offEvent('change');
        this.bind('change', () => this.addDirty());
    }

    dispose() {
        this.#contextMenu_.dispose();
        this.#contextMenu_ = null;
        super.dispose();
    }
}

Mixly.EditorCode = EditorCode;

});