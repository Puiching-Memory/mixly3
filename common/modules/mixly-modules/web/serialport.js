goog.loadJs('web', () => {

goog.require('Mixly.Serial');
goog.require('Mixly.Debug');
goog.require('Mixly.Config');
goog.require('Mixly.Web');
goog.provide('Mixly.Web.SerialPort');

const {
    Serial,
    Debug,
    Config,
    Web
} = Mixly;

const { SELECTED_BOARD } = Config;

class WebSerialPort extends Serial {
    static {
        this.type = 'serialport';

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
            let options = SELECTED_BOARD?.web?.devices?.serial;
            if (options && typeof(options) !== 'object') {
                options = {
                    filters: []
                };
            }
            const serialport = await navigator.serial.requestPort(options);
            this.addPort(serialport);
            this.refreshPorts();
        }

        this.getPort = function (name) {
            return Serial.nameToPortRegistry.getItem(name);
        }

        this.addPort = function (serialport) {
            if (this.portToNameRegistry.hasKey(serialport)) {
                return;
            }
            let name = '';
            for (let i = 1; i <= 20; i++) {
                name = `serial${i}`;
                if (Serial.nameToPortRegistry.hasKey(name)) {
                    continue;
                }
                break;
            }
            Serial.portToNameRegistry.register(serialport, name);
            Serial.nameToPortRegistry.register(name, serialport);
        }

        this.removePort = function (serialport) {
            if (!Serial.portToNameRegistry.hasKey(serialport)) {
                return;
            }
            const name = Serial.portToNameRegistry.getItem(serialport);
            if (!name) {
                return;
            }
            Serial.portToNameRegistry.unregister(serialport);
            Serial.nameToPortRegistry.unregister(name);
        }

        this.addEventsListener = function () {
            navigator?.serial?.addEventListener('connect', (event) => {
                this.addPort(event.target);
                this.refreshPorts();
            });

            navigator?.serial?.addEventListener('disconnect', (event) => {
                this.removePort(event.target);
                this.refreshPorts();
            });
        }

        this.init = function () {
            navigator?.serial?.getPorts().then((serialports) => {
                for (let serialport of serialports) {
                    this.addPort(serialport);
                }
            });
            this.addEventsListener();
        }
    }

    #serialport_ = null;
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

    async #addReadEventListener_() {
        const { readable } = this.#serialport_;
        while (readable && this.#keepReading_) {
            this.#reader_ = readable.getReader();
            try {
                while (true) {
                    const { value, done } = await this.#reader_.read();
                    value && this.onBuffer(value);
                    if (done) {
                        break;
                    }
                }
            } catch (error) {
                this.#keepReading_ = false;
                Debug.error(error);
            } finally {
                this.#reader_ && this.#reader_.releaseLock();
                await this.close();
            }
        }
    }

    async open(baud) {
        const portsName = Serial.getCurrentPortsName();
        const currentPortName = this.getPortName();
        if (!portsName.includes(currentPortName)) {
            throw Error('no device available');
            return;
        }
        if (this.isOpened()) {
            return;
        }
        baud = baud ?? this.getBaudRate();
        this.#serialport_ = WebSerialPort.getPort(currentPortName);
        await this.#serialport_.open({ baudRate: baud });
        super.open(baud);
        super.setBaudRate(baud);
        this.#keepReading_ = true;
        this.onOpen();
        this.#addEventsListener_();
    }

    async #waitForUnlock_(timeout) {
        while (
            (this.#serialport_.readable && this.#serialport_.readable.locked) ||
            (this.#serialport_.writable && this.#serialport_.writable.locked)
        ) {
            await this.sleep(timeout);
        }
    }

    async close() {
        if (!this.isOpened()) {
            return;
        }
        super.close();
        if (this.#serialport_.readable?.locked) {
            this.#keepReading_ = false;
            await this.#reader_?.cancel();
        }
        await this.#waitForUnlock_(400);
        this.#reader_ = undefined;
        await this.#serialport_.close();
        this.#stringTemp_ = '';
        this.onClose(1);
    }

    async setBaudRate(baud) {
        if (!this.isOpened()
            || this.getBaudRate() === baud
            || !this.baudRateIsLegal(baud)) {
            return;
        }
        await this.close();
        await this.open(baud);
    }

    async sendString(str) {
        const buffer = this.encode(str);
        return this.sendBuffer(buffer);
    }

    async sendBuffer(buffer) {
        const { writable } = this.#serialport_;
        const writer = writable.getWriter();
        if (buffer.constructor.name !== 'Uint8Array') {
            buffer = new Uint8Array(buffer);
        }
        try {
            await writer.write(buffer);
            writer.releaseLock();
        } catch (error) {
            writer.releaseLock();
            throw Error(error);
        }
    }

    async setDTRAndRTS(dtr, rts) {
        if (!this.isOpened()) {
            return;
        }
        await this.#serialport_.setSignals({
            dataTerminalReady: dtr,
            requestToSend: rts
        });
        super.setDTRAndRTS(dtr, rts);
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

Web.SerialPort = WebSerialPort;

});