goog.loadJs('common', () => {

goog.require('dialog');
goog.require('Mixly.Env');
goog.require('Mixly.Registry');
goog.require('Mixly.Component');
goog.require('Mixly.HTMLTemplate');
goog.provide('Mixly.Layer');

const {
    Env,
    Registry,
    Component,
    HTMLTemplate
} = Mixly;


class Layer extends Component {
    static {
        this.templates = new Registry();

        this.register = function (key, value) {
            this.templates.register(key, value);
        }

        this.register('all', (new HTMLTemplate(
            goog.readFileSync(path.join(Env.templatePath, 'html/dialog/shadow-all.html'))
        )).render());
        this.register('nav', (new HTMLTemplate(
            goog.readFileSync(path.join(Env.templatePath, 'html/dialog/shadow-nav.html'))
        )).render());
    }

    #dialog_ = null;

    constructor(config = {}, shadowType = 'nav') {
        super();
        const shadow = Layer.templates.getItem(shadowType);
        this.setContent($(shadow));
        this.#dialog_ = dialog({
            skin: 'min-dialog tips',
            padding: 0,
            ...config
        });
    }

    show() {
        this.mountOn($(window.document.body));
        this.#dialog_.show();
    }

    hide() {
        this.getContent().detach();
        this.#dialog_.close();
        this.onUnmounted();
    }

    title(text) {
        this.#dialog_.title(text);
    }

    width(value) {
        this.#dialog_.width(value);
    }

    height(value) {
        this.#dialog_.height(value);
    }

    reset() {
        this.#dialog_.reset();
    }

    focus() {
        this.#dialog_.focus();
    }

    blur() {
        this.#dialog_.blur();
    }

    dispose() {
        this.#dialog_.remove();
        this.#dialog_ = null;
        super.dispose();
    }
}

Mixly.Layer = Layer;

});