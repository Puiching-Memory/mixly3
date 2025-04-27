goog.loadJs('common', () => {

goog.require('Mixly.Env');
goog.require('Mixly.Layer');
goog.require('Mixly.HTMLTemplate');
goog.provide('Mixly.LayerProgress');

const {
    Env,
    Layer,
    HTMLTemplate
} = Mixly;


class LayerProgress extends Layer {
    static {
        HTMLTemplate.add(
            'html/dialog/progress.html',
            new HTMLTemplate(goog.readFileSync(path.join(Env.templatePath, 'html/dialog/progress.html')))
        );
    }

    #dialog_ = null;
    #$dialogContent_ = null;

    constructor(config = {}, shadowType = 'nav') {
        const $dialogContent_ = $(HTMLTemplate.get('html/dialog/progress.html').render());
        config.content = $dialogContent_;
        super(config, shadowType);
        this.#$dialogContent_ = $dialogContent_;
    }

    dispose() {
        this.#$dialogContent_.remove();
        this.#$dialogContent_ = null;
        super.dispose();
    }
}

Mixly.LayerProgress = LayerProgress;

});