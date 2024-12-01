goog.loadJs('web', () => {

goog.require('io');
goog.require('Mixly.WebSocket');
goog.require('Mixly.WebSocket.Serial');
goog.require('Mixly.WebSocket.ArduShell');
goog.provide('Mixly.WebSocket.Socket');

const { WebSocket } = Mixly;
const { Socket, Serial, ArduShell } = WebSocket;


Socket.init = function () {
    const socket = io('wss://127.0.0.1:4000', {
        path: '/mixly-socket/',
        reconnectionDelayMax: 10000,
        transports: ['websocket'],
        protocols: ['my-protocol-v1']
    });

    Serial.init(socket);
    ArduShell.init(socket);
}

});
