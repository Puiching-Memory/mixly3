goog.loadJs('web', () => {

goog.require('Mixly.Debug');
goog.require('Mixly.Config');
goog.require('Mixly.StatusBarsManager');
goog.require('Mixly.Socket');
goog.require('Mixly.WebSocket.Serial');
goog.require('Mixly.WebSocket.ArduShell');
goog.require('Mixly.WebSocket.BU');
goog.require('Mixly.WebSocket.Ampy');
goog.provide('Mixly.WebSocket.Loader');

const {
    Debug,
    Config,
    StatusBarsManager,
    Socket,
    WebSocket
} = Mixly;

const {
    Loader,
    Serial,
    ArduShell,
    BU,
    Ampy
} = WebSocket;

const { SOFTWARE } = Config;


Loader.init = function () {
    let url = '';
    if (SOFTWARE.webSocket?.url) {
        const info = new window.URL(SOFTWARE.webSocket.url);
        if (info.hostname === 'default') {
            info.hostname = window.location.hostname;
            url = info.origin;
        } else {
            url = SOFTWARE.webSocket.url;
        }
    } else {
        url = `wss://${window.location.host}`;
    }
    const mixlySocket = new Socket(`${url}/all`, {
        path: '/mixly-socket/',
        reconnection: true,
        reconnectionDelayMax: 10000,
        transports: ['websocket'],
        protocols: ['my-protocol-v1']
    });

    const socket = mixlySocket.getSocket();

    socket.on('connect', () => {
        Serial.getPorts()
            .then((ports) => {
                let portsName = [];
                for (let port of ports) {
                    portsName.push(port.name);
                }
                const { mainStatusBarTabs } = Mixly;
                let keys = mainStatusBarTabs.keys();
                const statusBarType = StatusBarsManager.typesRegistry.getItem('serial');
                for (let key of keys) {
                    const statusBar = mainStatusBarTabs.getStatusBarById(key);
                    if (!(statusBar instanceof statusBarType)) {
                        continue;
                    }
                    const portName = statusBar.getPortName();
                    if (!portsName.includes(portName)) {
                        continue;
                    }
                    socket.emit('serial.create', portName);
                }
                Serial.renderSelectBox(ports);
            })
            .catch(Debug.error);
    });

    socket.on('disconnect', () => {
        const { mainStatusBarTabs } = Mixly;
        let keys = mainStatusBarTabs.keys();
        const statusBarType = StatusBarsManager.typesRegistry.getItem('serial');
        for (let key of keys) {
            const statusBar = mainStatusBarTabs.getStatusBarById(key);
            if (statusBar instanceof statusBarType) {
                statusBar.close().catch(Debug.error);
            }
        }
        Serial.refreshPorts();
    });

    Serial.init(mixlySocket);
    ArduShell.init(mixlySocket);
    BU.init(mixlySocket);
    Ampy.init(mixlySocket);
}

});
