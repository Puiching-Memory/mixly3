goog.loadJs('web', () => {

goog.require('Mixly.Debug');
goog.require('Mixly.Config');
goog.require('Mixly.StatusBarsManager');
goog.require('Mixly.Socket');
goog.require('Mixly.WebCompiler.ArduShell');
goog.provide('Mixly.WebCompiler.Loader');

const {
    Debug,
    Config,
    StatusBarsManager,
    Socket,
    WebCompiler
} = Mixly;

const {
    Loader,
    ArduShell
} = WebCompiler;

const { SOFTWARE } = Config;


Loader.init = function () {
    let url = '';
    if (SOFTWARE.webCompiler?.url) {
        const info = new window.URL(SOFTWARE.webCompiler.url);
        if (window.location.protocol === 'http:') {
            info.protocol = 'ws:';
        }
        if (info.hostname === 'default') {
            info.hostname = window.location.hostname;
        }
        url = info.origin;
    } else {
        url = `wss://${window.location.host}`;
    }
    const mixlySocket = new Socket(`${url}/compile`, {
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
