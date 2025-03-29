goog.loadJs('web', () => {

goog.require('Mixly.Serial');
goog.require('Mixly.Config');
goog.require('Mixly.Web');
goog.provide('Mixly.Web.HID');

const {
    Serial,
    Config,
    Web
} = Mixly;

const { SELECTED_BOARD } = Config;

class WebHID extends Serial {
    static {
        this.type = 'hid';

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
            let options = SELECTED_BOARD?.web?.devices?.hid;
            if (!options || typeof(options) !== 'object') {
                options = {
                    filters: []
                };
            }
            const devices = await navigator.hid.requestDevice(options);
            if (!devices.length) {
                return;
            }
            for (let device of devices) {
                this.addPort(device);
            }
            this.refreshPorts();
        }

        this.getPort = function (name) {
            return Serial.nameToPortRegistry.getItem(name);
        }

        this.addPort = function (device) {
            if (Serial.portToNameRegistry.hasKey(device)) {
                return;
            }
            let name = '';
            for (let i = 1; i <= 20; i++) {
                name = `hid${i}`;
                if (Serial.nameToPortRegistry.hasKey(name)) {
                    continue;
                }
                break;
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
            navigator?.hid?.addEventListener('connect', (event) => {
                this.addPort(event.device);
                this.refreshPorts();
            });

            navigator?.hid?.addEventListener('disconnect', (event) => {
                event.device.onclose && event.device.onclose();
                this.removePort(event.device);
                this.refreshPorts();
            });
        }

        this.init = function () {
            navigator?.hid?.getDevices().then((devices) => {
                for (let device of devices) {
                    this.addPort(device);
                }
            });
            this.addEventsListener();
        }
    }

    #device_ = null;
    #keepReading_ = null;
    #reader_ = null;
    #writer_ = null;
    #stringTemp_ = '';
    #dataLength_ = 31;
    constructor(port) {
        super(port);
    }

    #addEventsListener_() {
        this.#device_.oninputreport = (event) => {
            const { data } = event;
            const length = Math.min(data.getUint8(0) + 1, data.byteLength);
            let buffer = [];
            for (let i = 1; i < length; i++) {
                buffer.push(data.getUint8(i));
            }
            this.onBuffer(buffer);
        };

        this.#device_.onclose = () => {
            if (!this.isOpened()) {
                return;
            }
            super.close();
            this.#stringTemp_ = '';
            this.onClose(1);
        }
    }

    async open(baud) {
        return new Promise((resolve, reject) => {
            const portsName = Serial.getCurrentPortsName();
            const currentPortName = this.getPortName();
            if (!portsName.includes(currentPortName)) {
                reject('no device available');
                return;
            }
            if (this.isOpened()) {
                resolve();
                return;
            }
            baud = baud ?? this.getBaudRate();
            this.#device_ = WebHID.getPort(currentPortName);
            this.#device_.open()
                .then(() => {
                    super.open(baud);
                    super.setBaudRate(baud);
                    this.onOpen();
                    this.#addEventsListener_();
                    resolve();
                })
                .catch(reject);
        });
    }

    async close() {
        if (!this.isOpened()) {
            return;
        }
        super.close();
        await this.#device_.close();
        this.#stringTemp_ = '';
        this.#device_.oninputreport = null;
        this.#device_.onclose = null;
        this.onClose(1);
    }

    async setBaudRate(baud) {
        return Promise.resolve();
    }

    async sendString(str) {
        const buffer = this.encode(str);
        return this.sendBuffer(buffer);
    }

    async sendBuffer(buffer) {
        if (buffer.constructor.name !== 'Uint8Array') {
            buffer = new Uint8Array(buffer);
        }
        const len = Math.ceil(buffer.length / this.#dataLength_);
        for (let i = 0; i < len; i++) {
            const start = i * this.#dataLength_;
            const end = Math.min((i + 1) * this.#dataLength_, buffer.length);
            const writeBuffer = buffer.slice(start, end);
            let temp = new Uint8Array(end - start + 1);
            temp[0] = writeBuffer.length;
            temp.set(writeBuffer, 1);
            await this.#device_.sendReport(0, temp);
            await this.sleep(10);
        }
    }

    async setDTRAndRTS(dtr, rts) {
        return Promise.resolve();
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

Web.HID = WebHID;

});