goog.loadJs('common', () => {

goog.require('tippy');
goog.require('Mixly.IdGenerator');
goog.require('Mixly.ContextMenu');
goog.provide('Mixly.DropdownMenu');

const {
    IdGenerator,
    ContextMenu
} = Mixly;


class DropdownMenu extends ContextMenu {
    static {
        this.$container = $('<div class="mixly-dropdown-menus"></div>');
        $(document.body).append(this.$container);
    }

    #shown_ = false;
    #layer_ = null;
    #contextMenuId_ = '';
    #$contextMenuElem_ = null;
    constructor(elem) {
        const layer = tippy(elem, {
            allowHTML: true,
            content: '',
            trigger: 'click',
            interactive: true,
            maxWidth: 'none',
            offset: [0, 0],
            appendTo: document.body,
            arrow: false,
            placement: 'bottom-start',
            delay: 0,
            duration: [0, 0],
            onCreate: (instance) => {
                $(instance.popper).addClass('mixly-drapdown-menu');
            },
            onMount: () => {
                this.show();
            },
            onHide: () => {
                this.#shown_ && this.hide();
            }
        });

        const contextMenuId = IdGenerator.generate();
        const selector = `body > .mixly-dropdown-menus > div[m-id="${contextMenuId}"]`;

        super(selector, {
            trigger: 'none',
            appendTo: $(layer.popper).children().children(),
            zIndex: 1001,
            position: (opt) => {
                opt.$menu.css('margin', 0);
            },
            events: {
                show: () => {
                    this.#shown_ = true;
                    this.#layer_.setProps({});
                },
                hide: () => {
                    this.#shown_ = false;
                    if (this.#layer_.state.isShown) {
                        this.#layer_.hide();
                    }
                }
            }
        });

        this.#$contextMenuElem_ = $(`<div m-id="${contextMenuId}"><div>`);
        DropdownMenu.$container.append(this.#$contextMenuElem_);
        this.#contextMenuId_ = contextMenuId;
        this.#layer_ = layer;
    }

    show() {
        this.#$contextMenuElem_.contextMenu();
    }

    hide() {
        this.#$contextMenuElem_.contextMenu('hide');
    }

    dispose() {
        super.dispose();
        this.#layer_.destroy();
        this.#layer_ = null;
        this.#$contextMenuElem_.remove();
        this.#$contextMenuElem_ = null;
    }
}

Mixly.DropdownMenu = DropdownMenu;

});