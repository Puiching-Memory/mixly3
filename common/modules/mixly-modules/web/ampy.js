goog.loadJs('web', () => {

goog.require('path');
goog.require('Mustache');
goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.Ampy');
goog.require('Mixly.Web');
goog.provide('Mixly.Web.Ampy');

const {
    Env,
    Msg,
    Ampy,
    Web
} = Mixly;


class AmpyExt extends Ampy {
    static {
        this.LS = goog.readFileSync(path.join(Env.templatePath, 'python/ls.py'));
        this.LS_RECURSIVE = goog.readFileSync(path.join(Env.templatePath, 'python/ls-recursive.py'));
        this.LS_LONG_FORMAT = goog.readFileSync(path.join(Env.templatePath, 'python/ls-long-format.py'));
        this.MKDIR = goog.readFileSync(path.join(Env.templatePath, 'python/mkdir.py'));
        this.MKFILE = goog.readFileSync(path.join(Env.templatePath, 'python/mkfile.py'));
        this.RENAME = goog.readFileSync(path.join(Env.templatePath, 'python/rename.py'));
        this.RM = goog.readFileSync(path.join(Env.templatePath, 'python/rm.py'));
        this.RMDIR = goog.readFileSync(path.join(Env.templatePath, 'python/rmdir.py'));
        this.GET = goog.readFileSync(path.join(Env.templatePath, 'python/get.py'));
        this.CWD = goog.readFileSync(path.join(Env.templatePath, 'python/cwd.py'));
    }

    #device_ = null;
    #receiveTemp_ = [];
    #writeBuffer_ = true;
    #active_ = false;
    #dataLength_ = 256;
    constructor(device, writeBuffer = true, dataLength = 256) {
        super();
        this.#device_ = device;
        this.#writeBuffer_ = writeBuffer;
        this.#dataLength_ = dataLength;
        this.#addEventsListener_();
    }

    #addEventsListener_() {
        this.#device_.bind('onChar', (char) => {
            if (['\r', '\n'].includes(char)) {
                this.#receiveTemp_.push('');
            } else {
                let line = this.#receiveTemp_.pop() ?? '';
                this.#receiveTemp_.push(line + char);
            }
        });
    }

    isActive() {
        return this.#active_;
    }

    async readUntil(ending, withEnding = true, timeout = 5000) {
        const startTime = Number(new Date());
        let nowTime = startTime;
        let readStr = '';
        while (nowTime - startTime < timeout) {
            const nowTime = Number(new Date());
            let len = this.#receiveTemp_.length;
            for (let i = 0; i < len; i++) {
                const data = this.#receiveTemp_.shift();
                let index = data.toLowerCase().indexOf(ending);
                if (index !== -1) {
                    if (withEnding) {
                        index += ending.length;
                    }
                    this.#receiveTemp_.unshift(data.substring(index));
                    readStr += data.substring(0, index);
                    return readStr;
                } else {
                    readStr += data;
                    if (i !== len - 1) {
                        readStr += '\n';
                    }
                }
            }
            if (nowTime - startTime >= timeout) {
                return '';
            }
            if (!this.isActive()) {
                throw new Error(Msg.Lang['ampy.dataReadInterrupt']);
            }
            await this.#device_.sleep(100);
        }
    }

    async interrupt(timeout = 1000) {
        for (let i = 0; i < 5; i++) {
            // 中断两次
            await this.#device_.sendBuffer([0x0D, 0x03]);
            await this.#device_.sleep(100);
            await this.#device_.sendBuffer([0x03]);
            await this.#device_.sleep(100);
            if (await this.readUntil('>>>', true, timeout)) {
                return true;
            }
        }
        return false;
    }

    async enterRawREPL(timeout = 1000) {
        for (let i = 0; i < 5; i++) {
            await this.#device_.sendBuffer([0x01]);
            await this.#device_.sleep(100);
            if (await this.readUntil('raw repl; ctrl-b to exit', true, timeout)) {
                return true;
            }
        }
        return false;
    }

    async exitRawREPL(timeout = 5000) {
        await this.#device_.sendBuffer([0x02]);
        await this.#device_.sleep(100);
        let succeed = false;
        if (await this.readUntil('>>>', true, timeout)) {
            succeed = true;
        }
        return succeed;
    }

    async exitREPL(timeout = 5000) {
        await this.#device_.sendBuffer([0x04]);
        await this.#device_.sleep(100);
        let succeed = false;
        if (await this.readUntil('soft reboot', false, timeout)) {
            succeed = true;
        }
        return succeed;
    }

    async exec(str, timeout = 5000) {
        if (this.#writeBuffer_) {
            const buffer = this.#device_.encode(str);
            const len = Math.ceil(buffer.length / this.#dataLength_);
            for (let i = 0; i < len; i++) {
                const start = i * this.#dataLength_;
                const end = Math.min((i + 1) * this.#dataLength_, buffer.length);
                const writeBuffer = buffer.slice(start, end);
                await this.#device_.sendBuffer(writeBuffer);
                await this.#device_.sleep(10);
            }
        } else {
            for (let i = 0; i < str.length / this.#dataLength_; i++) {
                const start = i * this.#dataLength_;
                const end = Math.min((i + 1) * this.#dataLength_, str.length);
                let data = str.substring(start, end);
                await this.#device_.sendString(data);
                await this.#device_.sleep(10);
            }
        }
        await this.#device_.sendBuffer([0x04]);
        return await this.follow(timeout);
    }

    async follow(timeout = 1000) {
        let data = await this.readUntil('\x04', true, timeout);
        if (data.length < 1) {
            throw new Error(Msg.Lang['ampy.waitingFirstEOFTimeout']);
        }
        let start = data.toLowerCase().indexOf('>ok');
        if (start === -1){
            start = 0;
        }
        data = data.substring(start + 3, data.length - 1);
        let dataError = await this.readUntil('\x04', true, timeout);
        if (dataError.length < 1) {
            throw new Error(Msg.Lang['ampy.secondEOFTimeout']);
        }
        dataError = dataError.substring(0, dataError.length - 1);
        return { data, dataError };
    }

    async enter() {
        if (this.isActive()) {
            return;
        }
        this.#active_ = true;
        await this.#device_.open(115200);
        await this.#device_.sleep(500);
        await this.#device_.sendBuffer([0x02]);
        if (!await this.interrupt()) {
            throw new Error(Msg.Lang['ampy.interruptFailed']);
        }
        if (!await this.enterRawREPL()) {
            throw new Error(Msg.Lang['ampy.enterRawREPLFailed']);
        }
    }

    async exit() {
        if (!this.isActive()) {
            return;
        }
        if (!await this.exitRawREPL()) {
            throw new Error(Msg.Lang['ampy.exitRawREPLFailed']);
        }
        /*if (!await this.exitREPL()) {
            throw new Error(Msg.Lang['ampy.exitREPLFailed']);
        }*/
        await this.#device_.close();
        this.#active_ = false;
    }

    async get(filename, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        const code = Mustache.render(AmpyExt.GET, {
            path: filename
        });
        const { data, dataError } = await this.exec(code, timeout);
        if (dataError) {
            return '';
        }
        return this.#device_.decode(this.unhexlify(data));
    }

    async put(filename, data, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        await this.exec(`file = open('${filename}', 'wb')`, timeout);
        let buffer = null;
        if (typeof data === 'string') {
            buffer = this.#device_.encode(data);
        } else {
            buffer = data;
        }
        const len = Math.ceil(buffer.length / 64);
        for (let i = 0; i < len; i++) {
            const writeBuffer = buffer.slice(i * 64, Math.min((i + 1) * 64, buffer.length));
            let writeStr = '';
            for (let num of writeBuffer) {
                let numStr = num.toString(16);
                if (numStr.length === 1) {
                    numStr = '0' + numStr;
                }
                writeStr += '\\x' + numStr;
            }
            await this.exec(`file.write(b'${writeStr}')`, timeout);
        }
        await this.exec(`file.close()`, timeout);
    }

    async ls(directory = '/', longFormat = true, recursive = false, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        let code = '';
        if (longFormat) {
            code = Mustache.render(AmpyExt.LS_LONG_FORMAT, {
                path: directory
            });
        } else if (recursive) {
            code = Mustache.render(AmpyExt.LS_RECURSIVE, {
                path: directory
            });
        } else {
            code = Mustache.render(AmpyExt.LS, {
                path: directory
            });
        }
        const { data, dataError } = await this.exec(code, timeout);
        if (dataError) {
            return [];
        }
        return JSON.parse(data.replaceAll('\'', '\"'));
    }

    async mkdir(directory, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        const code = Mustache.render(AmpyExt.MKDIR, {
            path: directory
        });
        const { dataError } = await this.exec(code, timeout);
        return !dataError;
    }

    async mkfile(file, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        const code = Mustache.render(AmpyExt.MKFILE, {
            path: file
        });
        const { dataError } = await this.exec(code, timeout);
        return !dataError;
    }

    async rename(oldname, newname, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        const code = Mustache.render(AmpyExt.RENAME, {
            oldPath: oldname,
            newPath: newname
        });
        const { dataError } = await this.exec(code, timeout);
        return !dataError;
    }

    async rm(filename, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        const code = Mustache.render(AmpyExt.RM, {
            path: filename
        });
        await this.exec(code);
        const { dataError } = await this.exec(code, timeout);
        return !dataError;
    }

    async rmdir(directory, timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        const code = Mustache.render(AmpyExt.RMDIR, {
            path: directory
        });
        const { dataError } = await this.exec(code, timeout);
        return !dataError;
    }

    async cwd(timeout = 5000) {
        if (!this.isActive()) {
            throw new Error(Msg.Lang['ampy.portIsNotOpen']);
        }
        const code = Mustache.render(AmpyExt.CWD, {});
        const { data, dataError } = await this.exec(code, timeout);
        if (dataError) {
            return '/';
        }
        return data;
    }

    getDevice() {
        return this.#device_;
    }

    async dispose() {
        this.#active_ = false;
        await this.#device_.dispose();
        this.#device_ = null;
    }
}

Web.Ampy = AmpyExt;

});