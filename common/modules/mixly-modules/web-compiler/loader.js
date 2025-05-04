goog.loadJs('web', () => {

goog.require('Mixly.Debug');
goog.require('Mixly.StatusBarsManager');
goog.require('Mixly.Socket');
goog.require('Mixly.WebCompiler.ArduShell');
goog.provide('Mixly.WebCompiler.Loader');

const {
    Debug,
    StatusBarsManager,
    Socket,
    WebCompiler
} = Mixly;

const {
    Loader,
    ArduShell
} = WebCompiler;


Loader.init = function () {
    const mixlySocket = new Socket(`wss://${location.hostname}:4000/compile`, {
        path: '/mixly-socket/',
        reconnection: true,
        reconnectionDelayMax: 10000,
        transports: ['websocket'],
        protocols: ['my-protocol-v1']
    });

    const socket = mixlySocket.getSocket();
    socket.on('connect', () => {});
    socket.on('disconnect', () => {});
    ArduShell.init(mixlySocket);
}

});
