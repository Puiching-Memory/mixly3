goog.loadJs('web', () => {

goog.require('path');
goog.require('Mixly.Config');
goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.Registry');
goog.require('Mixly.Serial');
goog.require('Mixly.LayerExt');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.Web.SerialPort');
goog.require('Mixly.Web.USB');
goog.require('Mixly.Web.USBMini');
goog.require('Mixly.Web.HID');
goog.provide('Mixly.Web.Serial');

const {
    Config,
    Env,
    Msg,
    Registry,
    Serial,
    LayerExt,
    HTMLTemplate,
    Web
} = Mixly;

const {
    SerialPort,
    USB,
    USBMini,
    HID
} = Web;

const { BOARD } = Config;

const platform = goog.platform();
const fullPlatform = goog.fullPlatform();


class WebSerial extends Serial {
    static {
        this.devicesRegistry = new Registry();
        this.type = Serial.type;
        this.DEVICES_SELECT_LAYER = new HTMLTemplate(
            goog.readFileSync(path.join(Env.templatePath, 'html/devices-select-layer.html'))
        );

        this.getConfig = function () {
            return Serial.getConfig();
        }

        this.getSelectedPortName = function () {
            return Serial.getSelectedPortName();
        }

        this.getCurrentPortsName = function () {
            return Serial.getCurrentPortsName();
        }

        this.refreshPorts = function () {
            Serial.refreshPorts();
        }

        this.requestPort = function () {
            if (this.devicesRegistry.length() < 1) {
                throw Error('can not find any device handler');
            } else if (this.devicesRegistry.length() === 1) {
                const keys = this.devicesRegistry.keys();
                return this.devicesRegistry.getItem(keys[0]).requestPort();
            }
            const msg = {
                serialMsg: Msg.Lang['layer.devices.serial'],
                serialStatus: this.devicesRegistry.hasKey('serial') ? '' : 'disabled',
                hidMsg: Msg.Lang['layer.devices.hid'],
                hidStatus: this.devicesRegistry.hasKey('hid') ? '' : 'disabled',
                usbMsg: Msg.Lang['layer.devices.usb'],
                usbStatus: (
                    this.devicesRegistry.hasKey('usb') || this.devicesRegistry.hasKey('usbmini')
                ) ? '' : 'disabled'
            };
            return new Promise((resolve, reject) => {
                let selected = false;
                const layerNum = LayerExt.open({
                    title: [Msg.Lang['layer.devices.select'], '36px'],
                    area: ['400px', '150px'],
                    max: false,
                    min: false,
                    content: this.DEVICES_SELECT_LAYER.render(msg),
                    shade: LayerExt.SHADE_ALL,
                    resize: false,
                    success: function (layero, index) {
                        $(layero).on('click', 'button', (event) => {
                            selected = true;
                            layer.close(layerNum);
                            const $btn = $(event.currentTarget);
                            let mId = $btn.attr('m-id');
                            if (mId === 'usb' && WebSerial.devicesRegistry.hasKey('usbmini')) {
                                mId = 'usbmini';
                            }
                            const Device = WebSerial.devicesRegistry.getItem(mId);
                            Device.requestPort().then(resolve).catch(reject);
                        });
                    },
                    end: function () {
                        if (!selected) {
                            reject('user not select any device');
                        }
                        $(`#layui-layer-shade${layerNum}`).remove();
                    }
                });
            });
        }

        this.getHandler = function (device) {
            if (device.constructor.name === 'SerialPort') {
                return SerialPort;
            } else if (device.constructor.name === 'HIDDevice') {
                return HID;
            } else if (device.constructor.name === 'USBDevice') {
                if (this.devicesRegistry.hasKey('usbmini')) {
                    return USBMini;
                } else {
                    return USB;
                }
            }
            return null;
        }

        this.getPort = function (name) {
            return Serial.nameToPortRegistry.getItem(name);
        }

        this.addPort = function (device) {
            const handler = this.getHandler(device);
            if (!handler) {
                return;
            }
            handler.addPort(device);
        }

        this.removePort = function (device) {
            const handler = this.getHandler(device);
            if (!handler) {
                return;
            }
            handler.removePort(device);
        }

        this.addEventsListener = function () {}

        this.init = function () {
            if (Env.hasSocketServer) {
                return;
            }
            if (platform === 'win32' && fullPlatform !== 'win10') {
                if (BOARD?.web?.devices?.hid) {
                    this.devicesRegistry.register('hid', HID);
                    HID.init();
                }
                if (BOARD?.web?.devices?.serial) {
                    this.devicesRegistry.register('serial', SerialPort);
                    SerialPort.init();
                }
                if (BOARD?.web?.devices?.usb) {
                    if (['BBC micro:bit', 'Mithon CC'].includes(BOARD.boardType)) {
                        this.devicesRegistry.register('usb', USB);
                        USB.init();
                    }
                }
            } else if (platform === 'mobile') {
                if (['BBC micro:bit', 'Mithon CC'].includes(BOARD.boardType)) {
                    this.devicesRegistry.register('usb', USB);
                    USB.init();
                } else {
                    this.devicesRegistry.register('usbmini', USBMini);
                    USBMini.init();
                }
            } else {
                if (BOARD?.web?.devices?.serial) {
                    this.devicesRegistry.register('serial', SerialPort);
                    SerialPort.init();
                } else if (BOARD?.web?.devices?.usb) {
                    if (['BBC micro:bit', 'Mithon CC'].includes(BOARD.boardType)) {
                        this.devicesRegistry.register('usb', USB);
                        USB.init();
                    } else {
                        this.devicesRegistry.register('usbmini', USBMini);
                        USBMini.init();
                    }
                } else if (BOARD?.web?.devices?.hid) {
                    this.devicesRegistry.register('hid', HID);
                    HID.init();
                }
            }
        }

        this.init();
    }

    constructor(port) {
        super(port);
        const device = WebSerial.getPort(port);
        const handler = WebSerial.getHandler(device);
        if (!handler) {
            return;
        }
        return new handler(port);
    }
}


Web.Serial = WebSerial;

});