goog.loadJs('web', () => {

goog.require('Mixly.Serial');
goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.Debug');
goog.require('Mixly.Registry');
goog.require('Mixly.WebSocket');
goog.provide('Mixly.WebSocket.Serial');


const {
    Serial,
    Env,
    Msg,
    Debug,
    Registry,
    WebSocket
} = Mixly;


class WebSocketSerial extends Serial {
    static {
        this.eventRegistry = new Registry();
        this.socket = null;

        this.getConfig = function () {
            return Serial.getConfig();
        }

        this.getSelectedPortName = function () {
            return Serial.getSelectedPortName();
        }

        this.getCurrentPortsName = function () {
            return Serial.getCurrentPortsName();
        }

        this.getPorts = async function () {
            return new Promise((resolve, reject) => {
                this.socket.emit('serial.getPorts', (response) => {
                    const [error, result] = response;
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        }

        this.refreshPorts = function () {
            this.getPorts()
            .then((ports) => {
                Serial.renderSelectBox(ports);
            })
            .catch(Debug.error);
        }

        this.init = function (socket) {
            this.socket = socket;

            socket.on('serial.attachEvent', () => {
                this.refreshPorts();
            });

            socket.on('serial.detachEvent', () => {
                this.refreshPorts();
            });

            socket.on('serial.bufferEvent', (port, buffer) => {
                const eventName = `${port}-buffer`;
                if (!this.eventRegistry.hasKey(eventName)) {
                    return;
                }
                const event = this.eventRegistry.getItem(eventName);
                event(buffer);
            });

            socket.on('serial.stringEvent', (port, str) => {
                const eventName = `${port}-string`;
                if (!this.eventRegistry.hasKey(eventName)) {
                    return;
                }
                const event = this.eventRegistry.getItem(eventName);
                event(str);
            });

            socket.on('serial.errorEvent', (port, error) => {
                const eventName = `${port}-error`;
                if (!this.eventRegistry.hasKey(eventName)) {
                    return;
                }
                const event = this.eventRegistry.getItem(eventName);
                event(error);
            });

            socket.on('serial.openEvent', (port) => {
                const eventName = `${port}-open`;
                if (!this.eventRegistry.hasKey(eventName)) {
                    return;
                }
                const event = this.eventRegistry.getItem(eventName);
                event();
            });

            socket.on('serial.closeEvent', (port, code) => {
                const eventName = `${port}-close`;
                if (!this.eventRegistry.hasKey(eventName)) {
                    return;
                }
                const event = this.eventRegistry.getItem(eventName);
                event(code);
            });
        }

        this.getSocket = function () {
            return this.socket;
        }

        this.getEventRegistry = function () {
            return this.eventRegistry;
        }
    }

    constructor(port) {
        super(port);
        this.#addEventsListener_();
        const socket = WebSocketSerial.getSocket();
        socket.emit('serial.create', port);
    }

    #addEventsListener_() {
        const port = this.getPortName();
        const eventRegistry = WebSocketSerial.getEventRegistry();
        eventRegistry.register(`${port}-buffer`, (buffer) => {
            this.onBuffer(buffer);
        });
        eventRegistry.register(`${port}-string`, (str) => {
            this.onString(str);
        });
        eventRegistry.register(`${port}-error`, (error) => {
            this.onError(String(error));
            this.onClose(1);
        });
        eventRegistry.register(`${port}-open`, () => {
            this.onOpen();
        });
        eventRegistry.register(`${port}-close`, (code) => {
            this.onClose(code);
        });
    }

    async open(baud) {
        return new Promise((resolve, reject) => {
            const portsName = Serial.getCurrentPortsName();
            const currentPort = this.getPortName();
            if (!portsName.includes(currentPort)) {
                reject('无可用串口');
                return;
            }
            if (this.isOpened()) {
                resolve();
                return;
            }
            baud = baud ?? this.getBaudRate();
            const socket = WebSocketSerial.getSocket();
            socket.emit('serial.open', this.getPortName(), baud, (response) => {
                const [error, result] = response;
                if (error) {
                    this.onError(error);
                    reject(error);
                } else {
                    super.open(baud);
                    this.setBaudRate(baud);
                    resolve(result);
                }
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            if (!this.isOpened()) {
                resolve();
                return;
            }
            super.close();
            const socket = WebSocketSerial.getSocket();
            socket.emit('serial.close', this.getPortName(), (response) => {
                const [error, result] = response;
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async setBaudRate(baud) {
        return new Promise((resolve, reject) => {
            if (!this.isOpened()
                || this.getBaudRate() === baud
                || !this.baudRateIsLegal(baud)) {
                resolve();
                return;
            }
            const socket = WebSocketSerial.getSocket();
            socket.emit('serial.setBaudRate', this.getPortName(), baud, (response) => {
                const [error,] = response;
                if (error) {
                    reject(error);
                } else {
                    super.setBaudRate(baud);
                    this.setDTRAndRTS(this.getDTR(), this.getRTS()).finally(resolve);
                }
            });
        });
    }

    async send(data) {
        return new Promise((resolve, reject) => {
            if (!this.isOpened()) {
                resolve();
                return;
            }
            const socket = WebSocketSerial.getSocket();
            socket.emit('serial.send', this.getPortName(), data, (response) => {
                const [error, result] = response;
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async sendString(str) {
        return this.send(str);
    }

    async sendBuffer(buffer) {
        return this.send(buffer);
    }

    async setDTRAndRTS(dtr, rts) {
        return new Promise((resolve, reject) => {
            if (!this.isOpened()) {
                resolve();
                return;
            }
            const socket = WebSocketSerial.getSocket();
            socket.emit('serial.setDTRAndRTS', this.getPortName(), dtr, rts, (response) => {
                const [error, result] = response;
                if (error) {
                    reject(error);
                } else {
                    super.setDTRAndRTS(dtr, rts);
                    resolve(result);
                }
            });
        });
    }

    async setDTR(dtr) {
        return this.setDTRAndRTS(dtr, this.getRTS());
    }

    async setRTS(rts) {
        return this.setDTRAndRTS(this.getDTR(), rts);
    }

    onBuffer(buffer) {
        super.onBuffer(buffer);
        for (let i = 0; i < buffer.length; i++) {
            super.onByte(buffer[i]);
        }
        const string = this.decodeBuffer(buffer);
        if (!string) {
            return;
        }
        for (let char of string) {
            super.onChar(char);
        }
    }

    async dispose() {
        return new Promise((resolve, reject) => {
            const port = this.getPortName();
            const eventRegistry = WebSocketSerial.getEventRegistry();
            eventRegistry.unregister(`${port}-buffer`);
            eventRegistry.unregister(`${port}-string`);
            eventRegistry.unregister(`${port}-error`);
            eventRegistry.unregister(`${port}-open`);
            eventRegistry.unregister(`${port}-close`);
            super.dispose()
                .then(() => {
                    const socket = WebSocketSerial.getSocket();
                    socket.emit('serial.dispose', port, ([error, result]) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                })
                .catch(reject);
        })
    }
}

WebSocket.Serial = WebSocketSerial;

});