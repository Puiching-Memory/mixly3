goog.loadJs('web', () => {

goog.require('layui');
goog.require('dayjs.duration');
goog.require('Mixly.Boards');
goog.require('Mixly.Debug');
goog.require('Mixly.LayerExt');
goog.require('Mixly.Msg');
goog.require('Mixly.Workspace');
goog.require('Mixly.LayerProgress');
goog.require('Mixly.WebSocket.Serial');
goog.provide('Mixly.WebSocket.ArduShell');

const {
    Boards,
    Debug,
    LayerExt,
    Msg,
    Workspace,
    LayerProgress,
    WebSocket
} = Mixly;

const { Serial } = WebSocket;

const { layer } = layui;


class WebSocketArduShell {
    static {
        this.mixlySocket = null;
        this.socket = null;
        this.shell = null;

        this.getSocket = function () {
            return this.socket;
        }

        this.getMixlySocket = function () {
            return this.mixlySocket;
        }

        this.init = function (mixlySocket) {
            this.mixlySocket = mixlySocket;
            this.socket = mixlySocket.getSocket();
            this.shell = new WebSocketArduShell();
            const socket = this.socket;

            socket.on('arduino.dataEvent', (data) => {
                if (data.length > 1000) {
                    return;
                }
                const { mainStatusBarTabs } = Mixly;
                const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
                statusBarTerminal.addValue(data);
            });

            socket.on('arduino.errorEvent', (data) => {
                const { mainStatusBarTabs } = Mixly;
                const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
                try {
                    data = unescape(data.replace(/(_E[0-9A-F]{1}_[0-9A-F]{2}_[0-9A-F]{2})+/gm, '%$1'));
                    data = unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
                } catch (error) {
                    Debug.error(error);
                }
                statusBarTerminal.addValue(data);
            });
        }

        this.initCompile = function () {
            if (!this.mixlySocket.isConnected()) {
                layer.msg(Msg.Lang['websocket.offline'], { time: 1000 });
                return;
            }
            const { mainStatusBarTabs } = Mixly;
            const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
            mainStatusBarTabs.changeTo('output');
            mainStatusBarTabs.show();
            const mainWorkspace = Workspace.getMain();
            const editor = mainWorkspace.getEditorsManager().getActive();
            const code = editor.getCode();
            statusBarTerminal.setValue(`${Msg.Lang['shell.compiling']}...\n`);
            this.shell.compile(code)
                .then((info) => {
                    this.endCallback(info.code, info.time);
                })
                .catch((error) => {
                    Debug.error(error);
                    statusBarTerminal.addValue(`\n==${Msg.Lang['shell.compileFailed']}==\n`);
                });
        }

        this.initUpload = function () {
            if (!this.mixlySocket.isConnected()) {
                layer.msg(Msg.Lang['websocket.offline'], { time: 1000 });
                return;
            }
            const port = Serial.getSelectedPortName();
            if (!port) {
                layer.msg(Msg.Lang['statusbar.serial.noDevice'], {
                    time: 1000
                });
                return;
            }
            const { mainStatusBarTabs } = Mixly;
            const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
            mainStatusBarTabs.changeTo('output');
            mainStatusBarTabs.show();
            statusBarTerminal.setValue(`${Msg.Lang['shell.uploading']}...\n`);
            const mainWorkspace = Workspace.getMain();
            const editor = mainWorkspace.getEditorsManager().getActive();
            const code = editor.getCode();
            const statusBarSerial = mainStatusBarTabs.getStatusBarById(port);
            const closePromise = statusBarSerial ? statusBarSerial.close() : Promise.resolve();
            closePromise
                .then(() => {
                    return this.shell.upload(port, code)
                })
                .then((info) => {
                    this.endCallback(info.code, info.time);
                    if (info.code || !Serial.portIsLegal(port)) {
                        return;
                    }
                    mainStatusBarTabs.add('serial', port);
                    mainStatusBarTabs.changeTo(port);
                    const statusBarSerial = mainStatusBarTabs.getStatusBarById(port);
                    statusBarSerial.open()
                        .then(() => {
                            const baudRates = code.match(/(?<=Serial.begin[\s]*\([\s]*)[0-9]*(?=[\s]*\))/g);
                            if (!baudRates?.length) {
                                return statusBarSerial.setBaudRate(9600);
                            } else {
                                return statusBarSerial.setBaudRate(baudRates[0] - 0);
                            }
                        })
                        .catch(Debug.error);
                })
                .catch((error) => {
                    Debug.error(error);
                    statusBarTerminal.addValue(`\n==${Msg.Lang['shell.uploadFailed']}==\n`);
                });
        }

        this.endCallback = function (code, time) {
            const { mainStatusBarTabs } = Mixly;
            const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
            mainStatusBarTabs.changeTo('output');
            let message = '';
            if (code) {
                message = (this.shell.isCompiling() ? Msg.Lang['shell.compileFailed'] : Msg.Lang['shell.uploadFailed']);
                statusBarTerminal.addValue(`\n==${message}==\n`);
            } else {
                message = (this.shell.isCompiling() ? Msg.Lang['shell.compileSucc'] : Msg.Lang['shell.uploadSucc']);
                statusBarTerminal.addValue(`\n==${message}(${Msg.Lang['shell.timeCost']} ${
                    dayjs.duration(time).format('HH:mm:ss.SSS')
                })==\n`);
            }
            layer.msg(message, { time: 1000 });
        }
    }

    #running_ = false;
    #upload_ = false;
    #killing_ = false;
    #layer_ = null;

    constructor() {
        this.#layer_ = new LayerProgress({
            width: 200,
            cancelValue: Msg.Lang['nav.btn.stop'],
            skin: 'layui-anim layui-anim-scale',
            cancel: () => {
                if (this.#killing_) {
                    return false;
                }
                this.#layer_.title(`${Msg.Lang['shell.aborting']}...`);
                this.#killing_ = true;
                this.kill().catch(Debug.error);
                return false;
            },
            cancelDisplay: false
        });
    }

    async compile(code) {
        return new Promise(async (resolve, reject) => {
            this.#running_ = true;
            this.#upload_ = false;
            this.#killing_ = false;
            this.showProgress();
            const key = Boards.getSelectedBoardCommandParam();
            const config = { key, code };
            const mixlySocket = WebSocketArduShell.getMixlySocket();
            mixlySocket.emit('arduino.compile', config, (response) => {
                this.hideProgress();
                if (response.error) {
                    reject(response.error);
                    return;
                }
                const [error, result] = response;
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async upload(port, code) {
        return new Promise(async (resolve, reject) => {
            this.#running_ = true;
            this.#upload_ = true;
            this.#killing_ = false;
            this.showProgress();
            const key = Boards.getSelectedBoardCommandParam();
            const config = { key, code, port };
            const mixlySocket = WebSocketArduShell.getMixlySocket();
            mixlySocket.emit('arduino.upload', config, (response) => {
                this.hideProgress();
                if (response.error) {
                    reject(response.error);
                    return;
                }
                const [error, result] = response;
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async kill() {
        return new Promise(async (resolve, reject) => {
            const mixlySocket = WebSocketArduShell.getMixlySocket();
            mixlySocket.emit('arduino.kill', (response) => {
                if (response.error) {
                    reject(response.error);
                    return;
                }
                const [error, result] = response;
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    showProgress() {
        const message = this.isCompiling() ? Msg.Lang['shell.compiling'] : Msg.Lang['shell.uploading'];
        this.#layer_.title(`${message}...`);
        this.#layer_.show();
    }

    hideProgress() {
        this.#layer_.hide();
    }

    isUploading() {
        return this.#running_ && this.#upload_;
    }

    isCompiling() {
        return this.#running_ && !this.#upload_;
    }
}

WebSocket.ArduShell = WebSocketArduShell;

});