goog.loadJs('web', () => {

goog.require('DAPjs');
goog.require('Mixly.Serial');
goog.require('Mixly.Registry');
goog.require('Mixly.Config');
goog.require('Mixly.Web');
goog.provide('Mixly.Web.USB');

const {
    Serial,
    Registry,
    Config,
    Web
} = Mixly;

const { SELECTED_BOARD } = Config;

class USB extends Serial {
    static {
        this.type = 'usb';
        this.serialNumberToNameRegistry = new Registry();

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
            Serial.refreshPorts();;
        }

        this.requestPort = async function () {
            let options = SELECTED_BOARD?.web?.devices?.usb;
            if (!options || typeof(options) !== 'object') {
                options = {
                    filters: []
                };
            }
            const device = await navigator.usb.requestDevice(options);
            this.addPort(device);
            this.refreshPorts();
        }

        this.getPort = function (name) {
            return Serial.nameToPortRegistry.getItem(name);
        }

        this.addPort = function (device) {
            if (Serial.portToNameRegistry.hasKey(device)) {
                return;
            }
            const { serialNumber } = device;
            let name = this.serialNumberToNameRegistry.getItem(serialNumber);
            if (!name) {
                for (let i = 1; i <= 20; i++) {
                    name = `usb${i}`;
                    if (Serial.nameToPortRegistry.hasKey(name)) {
                        continue;
                    }
                    break;
                }
                this.serialNumberToNameRegistry.register(serialNumber, name);
            }
            Serial.portToNameRegistry.register(device, name);
            Serial.nameToPortRegistry.register(name, device);
        }

        this.removePort = function (device) {
            if (!Serial.portToNameRegistry.hasKey(device)) {
                return;
            }
            const name = Serial.portToNameRegistry.getItem(device);
            if (!name) {
                return;
            }
            Serial.portToNameRegistry.unregister(device);
            Serial.nameToPortRegistry.unregister(name);
        }

        this.addEventsListener = function () {
            navigator?.usb?.addEventListener('connect', (event) => {
                this.addPort(event.device);
                this.refreshPorts();
            });

            navigator?.usb?.addEventListener('disconnect', (event) => {
                event.device.onclose && event.device.onclose();
                this.removePort(event.device);
                this.refreshPorts();
            });
        }

        this.init = function () {
            navigator?.usb?.getDevices().then((devices) => {
                for (let device of devices) {
                    this.addPort(device);
                }
            });
            this.addEventsListener();
        }
    }

    #device_ = null;
    #webUSB_ = null;
    #dapLink_ = null;
    #keepReading_ = null;
    #reader_ = null;
    #writer_ = null;
    #stringTemp_ = '';
    constructor(port) {
        super(port);
    }

    #addEventsListener_() {
        this.#addReadEventListener_();
    }

    #addReadEventListener_() {
        this.#reader_ = this.#startSerialRead_();

        this.#device_.onclose = () => {
            if (!this.isOpened()) {
                return;
            }
            super.close();
            this.#stringTemp_ = '';
            this.onClose(1);
        }
    }

    async #startSerialRead_(serialDelay = 1, autoConnect = false) {
        this.#dapLink_.serialPolling = true;

        while (this.#dapLink_.serialPolling) {
            const data = await this.#dapLink_.serialRead();
            if (data !== undefined) {
                const numberArray = Array.prototype.slice.call(new Uint8Array(data));
                this.onBuffer(numberArray);
            }
            await new Promise(resolve => setTimeout(resolve, serialDelay));
        }
    }

    async open(baud) {
        const portsName = Serial.getCurrentPortsName();
        const currentPortName = this.getPortName();
        if (!portsName.includes(currentPortName)) {
            throw new Error('no device available');
        }
        if (this.isOpened()) {
            return;
        }
        baud = baud ?? this.getBaudRate();
        this.#device_ = USB.getPort(currentPortName);
        this.#webUSB_ = new DAPjs.WebUSB(this.#device_);
        this.#dapLink_ = new DAPjs.DAPLink(this.#webUSB_);
        await this.#dapLink_.connect();
        super.open(baud);
        await this.setBaudRate(baud);
        this.onOpen();
        this.#addEventsListener_();
    }

    async close() {
        if (!this.isOpened()) {
            return;
        }
        super.close();
        this.#dapLink_.stopSerialRead();
        if (this.#reader_) {
            await this.#reader_;
        }
        await this.#dapLink_.disconnect();
        this.#dapLink_ = null;
        await this.#webUSB_.close();
        this.#webUSB_ = null;
        await this.#device_.close();
        this.#device_ = null;
        this.onClose(1);
    }

    async setBaudRate(baud) {
        if (!this.isOpened() || this.getBaudRate() === baud) {
            return;
        }
        await this.#dapLink_.setSerialBaudrate(baud);
        await super.setBaudRate(baud);
    }

    async sendString(str) {
        return this.#dapLink_.serialWrite(str);
    }

    async sendBuffer(buffer) {
        if (buffer.constructor.name !== 'Uint8Array') {
            buffer.unshift(buffer.length);
            buffer = new Uint8Array(buffer);
        }
        await this.#dapLink_.send(132, buffer);
    }

    async setDTRAndRTS(dtr, rts) {
        if (!this.isOpened()
            || (this.getDTR() === dtr && this.getRTS() === rts)) {
            return;
        }
        await super.setDTRAndRTS(dtr, rts);
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
            if (['\r', '\n'].includes(char)) {
                super.onString(this.#stringTemp_);
                this.#stringTemp_ = '';
            } else {
                this.#stringTemp_ += char;
            }
        }
    }
}

Web.USB = USB;

});