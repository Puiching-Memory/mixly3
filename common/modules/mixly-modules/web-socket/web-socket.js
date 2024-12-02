goog.loadJs('web', () => {

goog.require('io');
goog.require('Mixly');
goog.provide('Mixly.WebSocket');


class WebSocket {
    #socket_ = null;
    constructor(path, option) {
        this.#socket_ = io(path, option);
    }

    emit(eventName, ...args) {
        if (this.isConnected()) {
            return this.#socket_.emit(eventName, ...args);
        } else {
            const callback = args.pop();
            callback({
                error: new Error('socket is not connected')
            });
        }
    }

    getSocket() {
        return this.#socket_;
    }

    isConnected() {
        return this.#socket_?.connected;
    }
}

Mixly.WebSocket = WebSocket;

});