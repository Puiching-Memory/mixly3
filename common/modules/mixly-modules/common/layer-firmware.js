goog.loadJs('common', () => {

goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.Layer');
goog.require('Mixly.HTMLTemplate');
goog.provide('Mixly.LayerFirmware');

const {
    Env,
    Msg,
    Layer,
    HTMLTemplate
} = Mixly;


class LayerFirmware extends Layer {
    static {
        HTMLTemplate.add(
            'html/dialog/firmware.html',
            new HTMLTemplate(goog.readFileSync(path.join(Env.templatePath, 'html/dialog/firmware.html')))
        );
    }

    #dialog_ = null;
    #$dialogContent_ = null;
    #$cancel_ = null;
    #$burn_ = null;
    #$select_ = null;
    #map_ = {};

    constructor(config = {}, shadowType = 'nav') {
        const $dialogContent_ = $(HTMLTemplate.get('html/dialog/firmware.html').render({
            cancel: Msg.Lang['nav.btn.cancel'],
            burn: Msg.Lang['nav.btn.burn']
        }));
        config.content = $dialogContent_;
        super(config, shadowType);
        this.#$dialogContent_ = $dialogContent_;
        this.#$cancel_ = $dialogContent_.find('.cancel');
        this.#$burn_ = $dialogContent_.find('.burn');
        this.#$select_ = $dialogContent_.find('.type');
        this.#$select_.select2({
            data: [],
            minimumResultsForSearch: Infinity,
            width: '380px',
            dropdownCssClass: 'mixly-scrollbar'
        });
        this.addEventsType(['burn']);
        this.#addEventsListener_();
    }

    #addEventsListener_() {
        this.#$cancel_.click(() => {
            this.hide();
        });

        this.#$burn_.click(() => {
            this.hide();
            this.runEvent('burn', this.#map_[this.#$select_.val()]);
        });
    }

    setMenu(items) {
        this.#$select_.empty();
        for (let item of items) {
            const newOption = new window.Option(item.text, item.id);
            this.#$select_.append(newOption);
        }
        this.#$select_.trigger('change');
    }

    setMap(firmwareMap) {
        this.#map_ = firmwareMap;
    }

    dispose() {
        this.#$select_.select2('destroy');
        this.#$select_.remove();
        this.#$select_ = null;
        this.#$cancel_.remove();
        this.#$cancel_ = null;
        this.#$burn_.remove();
        this.#$burn_ = null;
        this.#$dialogContent_.remove();
        this.#$dialogContent_ = null;
        this.#map_ = null;
        super.dispose();
    }
}

Mixly.LayerFirmware = LayerFirmware;

});