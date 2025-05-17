goog.loadJs('common', () => {

goog.require('Mixly.Debug');
goog.require('Mixly.IdGenerator');
goog.require('Mixly.Events');
goog.provide('Mixly.Menu');

const {
    Debug,
    IdGenerator,
    Events
} = Mixly;

class Menu {
    #menuItems_ = [];
    #ids_ = {};
    #isDynamic_ = false;
    #events_ = new Events(['onRead']);
    constructor(isDynamic) {
        this.#ids_ = {};
        this.#menuItems_ = [];
        this.#isDynamic_ = isDynamic;
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
        const { id, weight } = item;
        if (this.#ids_[id]) {
            delete this.#ids_[id];
        }
        let i = 0;
        for (; i < this.#menuItems_.length; i++) {
            if (this.#menuItems_[i].weight <= weight) {
                continue;
            }
            break;
        }
        this.#menuItems_.splice(i, 0, item);
        this.#ids_[id] = item;
        return id;
    }

    remove(id) {
        if (!this.#ids_[id]) {
            return;
        }
        delete this.#ids_[id];
        for (let i in this.#menuItems_) {
            if (this.#menuItems_[i].id !== id) {
                continue;
            }
            this.#menuItems_.splice(i, 1);
            break;
        }
    }

    empty() {
        this.#ids_ = {};
        this.#menuItems_ = [];
    }

    hasKey(id) {
        return !!this.#ids_[id];
    }

    getItem(id) {
        return this.#ids_[id] ?? null;
    }

    getAllItems() {
        if (this.#isDynamic_) {
            this.empty();
            const results = this.runEvent('onRead');
            if (results?.length) {
                for (let item of results[0]) {
                    this.add(item);
                }
            }
        }
        return this.#menuItems_;
    }

    bind(type, func) {
        return this.#events_.bind(type, func);
    }

    unbind(id) {
        this.#events_.unbind(id);
    }

    addEventsType(eventsType) {
        this.#events_.addType(eventsType);
    }

    runEvent(eventsType, ...args) {
        return this.#events_.run(eventsType, ...args);
    }

    offEvent(eventsType) {
        this.#events_.off(eventsType);
    }

    resetEvent() {
        this.#events_.reset();
    }
}

Mixly.Menu = Menu;

});