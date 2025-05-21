goog.loadJs('common', () => {

goog.require('path');
goog.require('tippy');
goog.require('Mixly.Env');
goog.require('Mixly.Menu');
goog.require('Mixly.Registry');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.IdGenerator');
goog.require('Mixly.ContextMenu');
goog.require('Mixly.DropdownMenu');
goog.provide('Mixly.DropdownMenuGroup');

const {
    Env,
    Menu,
    Registry,
    HTMLTemplate,
    IdGenerator,
    ContextMenu,
    DropdownMenu
} = Mixly;


class DropdownMenuGroup {
    static {
        HTMLTemplate.add(
            'html/dropdown-menu-item.html',
            new HTMLTemplate(goog.readFileSync(path.join(Env.templatePath, 'html/dropdown-menu-item.html')))
        );
    }

    #singleton_ = null;
    #menuItems_ = [];
    #ids_ = {};
    #instanceIds_ = {};
    #activeInstance_ = null;
    #instanceShown_ = false;
    #menuShown_ = false;
    #trigged_ = false;
    #$instancePopper_ = null;
    #$instanceContent_ = null;
    #$content_ = null;
    constructor(elem) {
        this.#$content_ = $(elem);
        this.#$content_.css('z-index', 200);
        this.#singleton_ = tippy.createSingleton([], {
            interactive: true,
            maxWidth: 'none',
            offset: [0, 3],
            appendTo: document.body,
            arrow: false,
            placement: 'bottom-end',
            animation: 'shift-toward-extreme',
            hideOnClick: false,
            delay: [200, null],
            onShow: () => {
                if (this.#activeInstance_) {
                    this.showMenu(this.#activeInstance_.id);
                }
                this.#instanceShown_ = true;
            },
            onTrigger: (_, event) => {
                const id = $(event.currentTarget).attr('data-id');
                if (this.#instanceShown_) {
                    if (this.#activeInstance_) {
                        this.#trigged_ = true;
                        this.hideMenu(this.#activeInstance_.id);
                        this.#activeInstance_ = null;
                    }
                    this.showMenu(id);
                }
                this.#activeInstance_ = this.#instanceIds_[id].instance;
            },
            onHide: () => {
                if (this.#menuShown_) {
                    return false;
                }
                this.#instanceShown_ = false;
                return true;
            }
        });
        this.#$instancePopper_ = $(this.#singleton_.popper);
        this.#$instancePopper_.addClass('mixly-drapdown-menu');
        this.#$instanceContent_ = this.#$instancePopper_.children().children();
    }

    add(item) {
        if (!item.id) {
            if (item.type) {
                item.id = item.type;
            } else {
                item.id = IdGenerator.generate();
            }
        }
        if (!item.weight) {
            item.weight = 0;
        }
        this.remove(item.id);
        item.$elem = $(HTMLTemplate.get('html/dropdown-menu-item.html').render({
            text: item.displayText
        }));
        const instance = tippy(item.$elem[0]);
        item.$elem.attr('data-id', instance.id);
        item.$i = item.$elem.children('i');
        item.instance = instance;
        const contextMenuId = IdGenerator.generate();
        const selector = `body > .mixly-dropdown-menus > div[m-id="${contextMenuId}"]`;
        const contextMenu = new ContextMenu(selector, {
            trigger: 'none',
            appendTo: this.#$instanceContent_,
            shadow: true,
            autoHide: false,
            async: false,
            zIndex: 150,
            position: (opt) => {
                opt.$menu.css('margin', 0);
            },
            events: {
                show: (opt) => {
                    item.$i.addClass('menu-shown');
                    this.#menuShown_ = true;
                    this.#singleton_.setProps({});
                },
                hide: (opt) => {
                    item.$i.removeClass('menu-shown');
                    if (this.#trigged_) {
                        this.#trigged_ = false;
                        return true;
                    }
                    this.#menuShown_ = false;
                    this.#singleton_.hide();
                }
            }
        });
        item.contextMenu = contextMenu;
        contextMenu.register('menu', item.menu);
        contextMenu.bind('getMenu', () => 'menu');
        item.$menu = $(`<div m-id="${contextMenuId}"><div>`);
        DropdownMenu.$container.append(item.$menu);
        let i = 0;
        for (; i < this.#menuItems_.length; i++) {
            if (this.#menuItems_[i].weight <= item.weight) {
                continue;
            }
            break;
        }
        if (i === this.#menuItems_.length) {
            if (this.#menuItems_.length) {
                this.#menuItems_[i - 1].$elem.after(item.$elem);
            } else {
                this.#$content_.append(item.$elem);
            }
        } else {
            this.#menuItems_[i].$elem.before(item.$elem);
        }
        this.#menuItems_.splice(i, 0, item);
        this.#ids_[item.id] = item;
        this.#instanceIds_[instance.id] = item;
        const instances = [];
        for (let menuItem of this.#menuItems_) {
            instances.push(menuItem.instance);
        }
        this.#singleton_.setInstances(instances);
        return item.id;
    }

    getContextMenu(id) {
        if (!this.#ids_[id]) {
            return null;
        }
        return this.#ids_[id].contextMenu;
    }

    getInstance() {
        return this.#singleton_;
    }

    remove(id) {
        let item = this.#ids_[id];
        if (!item) {
            return;
        }
        delete this.#ids_[id];
        const instanceId = item.instance.id;
        delete this.#instanceIds_[instanceId];
        for (let i in this.#menuItems_) {
            if (this.#menuItems_[i].id !== id) {
                continue;
            }
            this.#menuItems_.splice(i, 1);
            break;
        }
        item.instance.destroy();
        item.contextMenu.dispose();
        item.$elem.remove();
        item.$menu.remove();
        item = null;
    }

    showMenu(instanceId) {
        const item = this.#instanceIds_[instanceId];
        item.$menu.contextMenu();
    }

    hideMenu(instanceId) {
        const item = this.#instanceIds_[instanceId];
        item.$menu.contextMenu('hide');
    }

    dispose() {
        super.dispose();
        this.#$instanceContent_.remove();
        this.#$instanceContent_ = null;
        this.#$instancePopper_.remove();
        this.#$instancePopper_ = null;
        this.#$content_.empty();
        this.#$content_ = null;
        for (let id in this.#ids_) {
            this.remove(id);
        }
        this.#singleton_.destroy();
        this.#singleton_ = null;
        this.#menuItems_ = null;
        this.#ids_ = null;
        this.#instanceIds_ = null;
        this.#activeInstance_ = null;
    }
}

Mixly.DropdownMenuGroup = DropdownMenuGroup;

});