goog.loadJs('web', () => {

goog.require('path');
goog.require('BoardId');
goog.require('FSWrapper');
goog.require('DAPWrapper');
goog.require('PartialFlashing');
goog.require('esptooljs');
goog.require('CryptoJS');
goog.require('Mixly.Env');
goog.require('Mixly.LayerExt');
goog.require('Mixly.Config');
goog.require('Mixly.MFile');
goog.require('Mixly.Boards');
goog.require('Mixly.Msg');
goog.require('Mixly.Workspace');
goog.require('Mixly.Debug');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.MString');
goog.require('Mixly.LayerFirmware');
goog.require('Mixly.LayerProgress');
goog.require('Mixly.Web.Serial');
goog.require('Mixly.Web.Ampy');
goog.provide('Mixly.Web.BU');

const {
    Env,
    Web,
    LayerExt,
    Config,
    MFile,
    Boards,
    Msg,
    Workspace,
    Debug,
    HTMLTemplate,
    MString,
    LayerFirmware,
    LayerProgress
} = Mixly;

const {
    Serial,
    BU,
    Ampy
} = Web;

const { BOARD, SELECTED_BOARD } = Config;
const { ESPLoader, Transport } = esptooljs;

BU.uploading = false;
BU.burning = false;
BU.firmwareLayer = new LayerFirmware({
    width: 400,
    title: Msg.Lang['nav.btn.burn'],
    cancelValue: false,
    skin: 'layui-anim layui-anim-scale',
    cancel: false,
    cancelDisplay: false
});
BU.firmwareLayer.bind('burn', (info) => {
    const boardKey = Boards.getSelectedBoardKey();
    const { web } = SELECTED_BOARD;
    if (boardKey.indexOf('micropython:esp32s2') !== -1) {
        BU.burnWithAdafruitEsptool(info, web.burn.erase);
    } else {
        BU.burnWithEsptool(info, web.burn.erase);
    }
});
BU.progressLayer = new LayerProgress({
    width: 200,
    cancelValue: false,
    skin: 'layui-anim layui-anim-scale',
    cancel: false,
    cancelDisplay: false
});

const BAUD = 460800;

if (['BBC micro:bit', 'Mithon CC'].includes(BOARD.boardType)) {
    FSWrapper.setupFilesystem(path.join(Env.boardDirPath, 'build'));
}

BU.requestPort = async () => {
    await Serial.requestPort();
}

const readBinFile = (path, offset) => {
    return new Promise((resolve, reject) => {
        fetch(path)
        .then((response) => {
            return response.blob();
        })
        .then((blob) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                resolve({
                    address: parseInt(offset),
                    data: event.target.result
                });
            };
            reader.onerror = function (error) {
                throw(error);
            }
            reader.readAsBinaryString(blob);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const readBinFileAsArrayBuffer = (path, offset) => {
    return new Promise((resolve, reject) => {
        fetch(path)
        .then((response) => {
            return response.blob();
        })
        .then((blob) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                resolve({
                    address: parseInt(offset),
                    data: event.target.result
                });
            };
            reader.onerror = function (error) {
                throw(error);
            }
            reader.readAsArrayBuffer(blob);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

BU.initBurn = async () => {
    if (['BBC micro:bit', 'Mithon CC'].includes(BOARD.boardType)) {
        await BU.burnByUSB();
    } else {
        const { web } = SELECTED_BOARD;
        const boardKey = Boards.getSelectedBoardKey();
        if (!web?.burn?.binFile) {
            return;
        }
        if (typeof web.burn.binFile !== 'object') {
            return;
        }
        if (web.burn.special && web.burn.special instanceof Array) {
            BU.burnWithSpecialBin();
        } else {
            await BU.burnWithEsptool(web.burn.binFile, web.burn.erase);
        }
    }
}

BU.burnByUSB = async () => {
    const { mainStatusBarTabs } = Mixly;
    let portName = Serial.getSelectedPortName();
    if (!portName) {
        try {
            await BU.requestPort();
            portName = Serial.getSelectedPortName();
            if (!portName) {
                return;
            }
        } catch (error) {
            Debug.error(error);
            return;
        }
    }
    const statusBarSerial = mainStatusBarTabs.getStatusBarById(portName);
    if (statusBarSerial) {
        await statusBarSerial.close();
    }

    const { web } = SELECTED_BOARD;
    const { burn } = web;
    const hexStr = goog.readFileSync(path.join(Env.boardDirPath, burn.filePath));
    const hex2Blob = new Blob([ hexStr ], { type: 'text/plain' });
    const buffer = await hex2Blob.arrayBuffer();
    if (!buffer) {
        layer.msg(Msg.Lang['shell.bin.readFailed'], { time: 1000 });
        return;
    }
    BU.burning = true;
    BU.uploading = false;
    const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
    statusBarTerminal.setValue(`${Msg.Lang['shell.burning']}...\n`);
    mainStatusBarTabs.show();
    mainStatusBarTabs.changeTo('output');
    const port = Serial.getPort(portName);
    const webUSB = new DAPjs.WebUSB(port);
    const dapLink = new DAPjs.DAPLink(webUSB);
    try {
        await dapLink.connect();
        await dapLink.setSerialBaudrate(115200);
    } catch (error) {
        Debug.error(error);
        return;
    }
    let prevPercent = 0;
    dapLink.on(DAPjs.DAPLink.EVENT_PROGRESS, progress => {
        const nowPercent = Math.floor(progress * 100);
        if (nowPercent > prevPercent) {
            prevPercent = nowPercent;
        } else {
            return;
        }
        const nowProgressLen = Math.floor(nowPercent / 2);
        const leftStr = new Array(nowProgressLen).fill('=').join('');
        const rightStr = (new Array(50 - nowProgressLen).fill('-')).join('');
        statusBarTerminal.addValue(`[${leftStr}${rightStr}] ${nowPercent}%\n`);
    });
    BU.progressLayer.title(`${Msg.Lang['shell.burning']}...`);
    BU.progressLayer.show();
    try {
        await dapLink.flash(buffer);
        BU.progressLayer.hide();
        layer.msg(Msg.Lang['shell.burnSucc'], { time: 1000 });
        statusBarTerminal.addValue(`==${Msg.Lang['shell.burnSucc']}==\n`);
    } catch (error) {
        Debug.error(error);
        BU.progressLayer.hide();
        statusBarTerminal.addValue(`==${Msg.Lang['shell.burnFailed']}==\n`);
    } finally {
        dapLink.removeAllListeners(DAPjs.DAPLink.EVENT_PROGRESS);
        await dapLink.disconnect();
        await webUSB.close();
        await port.close();
    }
}

BU.burnWithEsptool = async (binFile, erase) => {
    const { mainStatusBarTabs } = Mixly;
    let portName = Serial.getSelectedPortName();
    if (!portName) {
        try {
            await BU.requestPort();
            portName = Serial.getSelectedPortName();
            if (!portName) {
                return;
            }
        } catch (error) {
            Debug.error(error);
            return;
        }
    }
    const port = Serial.getPort(portName);
    if (['HIDDevice', 'USBDevice'].includes(port.constructor.name)) {
        layer.msg(Msg.Lang['burn.notSupport'], { time: 1000 });
        return;
    }
    const statusBarSerial = mainStatusBarTabs.getStatusBarById(portName);
    if (statusBarSerial) {
        await statusBarSerial.close();
    }
    const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
    statusBarTerminal.setValue(Msg.Lang['shell.burning'] + '...\n');
    mainStatusBarTabs.show();
    mainStatusBarTabs.changeTo('output');
    BU.progressLayer.title(`${Msg.Lang['shell.burning']}...`);
    BU.progressLayer.show();
    let esploader = null;
    let transport = null;
    try {
        transport = new Transport(port, false);
        esploader = new ESPLoader({
            transport,
            baudrate: BAUD,
            terminal: {
                clean() {
                    statusBarTerminal.setValue('');
                },
                writeLine(data) {
                    statusBarTerminal.addValue(data + '\n');
                },
                write(data) {
                    statusBarTerminal.addValue(data);
                }
            }
        });
        let chip = await esploader.main();
    } catch (error) {
        Debug.error(error);
        statusBarTerminal.addValue(`\n${error.toString()}\n`);
        await transport.disconnect();
        BU.progressLayer.hide();
        return;
    }

    statusBarTerminal.addValue(Msg.Lang['shell.bin.reading'] + "...");
    let firmwarePromise = [];
    statusBarTerminal.addValue("\n");
    for (let i of binFile) {
        if (i.path && i.offset) {
            let absolutePath = path.join(Env.boardDirPath, i.path);
            // statusBarTerminal.addValue(`${Msg.Lang['读取固件'] + ' '
            //     + Msg.Lang['路径']}:${absolutePath}, ${Msg.Lang['偏移']}:${i.offset}\n`);
            firmwarePromise.push(readBinFile(absolutePath, i.offset));
        }
    }
    let data = null;
    try {
        data = await Promise.all(firmwarePromise);
    } catch (error) {
        statusBarTerminal.addValue("Failed!\n" + Msg.Lang['shell.bin.readFailed'] + "！\n");
        statusBarTerminal.addValue("\n" + e + "\n", true);
        await transport.disconnect();
        BU.progressLayer.hide();
        return;
    }
    statusBarTerminal.addValue("Done!\n");
    BU.burning = true;
    BU.uploading = false;
    const flashOptions = {
        fileArray: data,
        flashSize: 'keep',
        eraseAll: erase,
        compress: true,
        calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image))
    };
    try {
        await esploader.writeFlash(flashOptions);
        await transport.setDTR(false);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await transport.setDTR(true);
        BU.progressLayer.hide();
        layer.msg(Msg.Lang['shell.burnSucc'], { time: 1000 });
        statusBarTerminal.addValue(`==${Msg.Lang['shell.burnSucc']}==\n`);
    } catch (error) {
        Debug.error(error);
        BU.progressLayer.hide();
        statusBarTerminal.addValue(`==${Msg.Lang['shell.burnFailed']}==\n`);
    } finally {
        await transport.disconnect();
    }
}

BU.getImportModulesName = (code) => {
    // 正则表达式: 匹配 import 或 from 导入语句
    const importRegex = /(?:import\s+([a-zA-Z0-9_]+)|from\s+([a-zA-Z0-9_]+)\s+import)/g;

    let imports = [];
    let match;
    while ((match = importRegex.exec(code)) !== null) {
        if (match[1]) {
            imports.push(match[1]); // 'import module'
        }
        if (match[2]) {
            imports.push(match[2]); // 'from module import ...'
        }
    }
    return imports;
}

BU.getImportModules = (code) => {
    let importsMap = {};
    const libPath = SELECTED_BOARD.upload.libPath;
    for (let i = libPath.length - 1; i >= 0; i--) {
        const dirname = MString.tpl(libPath[i], { indexPath: Env.boardDirPath });
        const map = goog.readJsonSync(path.join(dirname, 'map.json'));
        if (!(map && map instanceof Object)) {
            continue;
        }
        for (let key in map) {
            importsMap[key] = structuredClone(map[key]);
            importsMap[key]['__path__'] = path.join(dirname, map[key]['__name__']);
        }
    }

    let usedMap = {};
    let currentImports = BU.getImportModulesName(code);
    while (currentImports.length) {
        let temp = [];
        for (let moduleName of currentImports) {
            let moduleInfo = importsMap[moduleName];
            if (!moduleInfo) {
                continue;
            }
            usedMap[moduleName] = moduleInfo;
            const moduleImports = moduleInfo['__require__'];
            if (!moduleImports) {
                continue;
            }
            for (let name of moduleImports) {
                if (usedMap[name] || !importsMap[name] || temp.includes(name)) {
                    continue;
                }
                temp.push(name);
            }
        }
        currentImports = temp;
    }
    return usedMap;
}

BU.initUpload = async () => {
    let portName = Serial.getSelectedPortName();
    if (!portName) {
        try {
            await BU.requestPort();
            portName = Serial.getSelectedPortName();
            if (!portName) {
                return;
            }
        } catch (error) {
            Debug.error(error);
            return;
        }
    }
    if (['BBC micro:bit', 'Mithon CC'].includes(BOARD.boardType)) {
        await BU.uploadByUSB(portName);
    } else {
        await BU.uploadWithAmpy(portName);
    }
}

BU.uploadByUSB = async (portName) => {
    const { mainStatusBarTabs } = Mixly;
    if (!portName) {
        try {
            await BU.requestPort();
            portName = Serial.getSelectedPortName();
            if (!portName) {
                return;
            }
        } catch (error) {
            Debug.error(error);
            return;
        }
    }
    let statusBarSerial = mainStatusBarTabs.getStatusBarById(portName);
    if (statusBarSerial) {
        await statusBarSerial.close();
    }

    const port = Serial.getPort(portName);
    const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
    const dapWrapper = new DAPWrapper(port, {
        event: () => {},
        log: () => {}
    });
    const partialFlashing = new PartialFlashing(dapWrapper, {
        event: () => {}
    });

    let boardId = 0x9901;
    const boardKey = Boards.getSelectedBoardKey();
    if (boardKey === 'micropython:nrf51822:v2') {
        boardId = 0x9903;
    }

    BU.burning = false;
    BU.uploading = true;
    statusBarTerminal.setValue(Msg.Lang['shell.uploading'] + '...\n');
    mainStatusBarTabs.show();
    mainStatusBarTabs.changeTo('output');
    const mainWorkspace = Workspace.getMain();
    const editor = mainWorkspace.getEditorsManager().getActive();
    const code = editor.getCode();
    FSWrapper.writeFile('main.py', code);
    const importsMap = BU.getImportModules(code);
    for (let key in importsMap) {
        const filename = importsMap[key]['__name__'];
        const data = goog.readFileSync(importsMap[key]['__path__']);
        FSWrapper.writeFile(filename, data);
    }
    BU.progressLayer.title(`${Msg.Lang['shell.uploading']}...`);
    BU.progressLayer.show();
    try {
        let prevPercent = 0;
        await partialFlashing.flashAsync(new BoardId(0x9900), FSWrapper, progress => {
            const nowPercent = Math.floor(progress * 100);
            if (nowPercent > prevPercent) {
                prevPercent = nowPercent;
            } else {
                return;
            }
            const nowProgressLen = Math.floor(nowPercent / 2);
            const leftStr = new Array(nowProgressLen).fill('=').join('');
            const rightStr = (new Array(50 - nowProgressLen).fill('-')).join('');
            statusBarTerminal.addValue(`[${leftStr}${rightStr}] ${nowPercent}%\n`);
        });
        BU.progressLayer.hide();
        layer.msg(Msg.Lang['shell.uploadSucc'], { time: 1000 });
        statusBarTerminal.addValue(`==${Msg.Lang['shell.uploadSucc']}==\n`);
        if (!statusBarSerial) {
            mainStatusBarTabs.add('serial', portName);
            statusBarSerial = mainStatusBarTabs.getStatusBarById(portName);
        }
        statusBarSerial.setValue('');
        mainStatusBarTabs.changeTo(portName);
        await statusBarSerial.open();
    } catch (error) {
        await dapWrapper.disconnectAsync();
        Debug.error(error);
        BU.progressLayer.hide();
        statusBarTerminal.addValue(`${error}\n`);
        statusBarTerminal.addValue(`==${Msg.Lang['shell.uploadFailed']}==\n`);
    }
}

BU.uploadWithAmpy = async (portName) => {
    const { mainStatusBarTabs } = Mixly;
    const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
    let statusBarSerial = mainStatusBarTabs.getStatusBarById(portName);
    BU.burning = false;
    BU.uploading = true;
    statusBarTerminal.setValue(Msg.Lang['shell.uploading'] + '...\n');
    mainStatusBarTabs.show();
    mainStatusBarTabs.changeTo('output');
    const mainWorkspace = Workspace.getMain();
    const editor = mainWorkspace.getEditorsManager().getActive();
    const port = Serial.getPort(portName);
    BU.progressLayer.title(`${Msg.Lang['shell.uploading']}...`);
    BU.progressLayer.show();
    const serial = new Serial(portName);
    const ampy = new Ampy(serial);
    const code = editor.getCode();
    let closePromise = Promise.resolve();
    if (statusBarSerial) {
        closePromise = statusBarSerial.close();
    }
    try {
        /*const importsMap = BU.getImportModules(code);
        let libraries = {};
        for (let key in importsMap) {
            const filename = importsMap[key]['__name__'];
            const data = goog.readFileSync(importsMap[key]['__path__']);
            libraries[filename] = {
                data,
                size: importsMap[key]['__size__']
            };
        }*/
        await closePromise;
        await ampy.enter();
        statusBarTerminal.addValue('Writing main.py ');
        await ampy.put('main.py', code);
        statusBarTerminal.addValue('Done!\n');
        /*const cwd = await ampy.cwd();
        const rootInfo = await ampy.ls(cwd);
        let rootMap = {};
        for (let item of rootInfo) {
            rootMap[item[0]] = item[1];
        }
        if (cwd === '/') {
            cwd = '';
        }
        if (libraries && libraries instanceof Object) {
            for (let key in libraries) {
                if (rootMap[`${cwd}/${key}`] !== undefined && rootMap[`${cwd}/${key}`] === libraries[key].size) {
                    statusBarTerminal.addValue(`Skip ${key}\n`);
                    continue;
                }
                statusBarTerminal.addValue(`Writing ${key} `);
                await ampy.put(key, libraries[key].data);
                statusBarTerminal.addValue('Done!\n');
            }
        }*/
        await ampy.exit();
        await ampy.dispose();
        BU.progressLayer.hide();
        layer.msg(Msg.Lang['shell.uploadSucc'], { time: 1000 });
        statusBarTerminal.addValue(`==${Msg.Lang['shell.uploadSucc']}==\n`);
        if (!statusBarSerial) {
            mainStatusBarTabs.add('serial', portName);
            statusBarSerial = mainStatusBarTabs.getStatusBarById(portName);
        }
        statusBarSerial.setValue('');
        mainStatusBarTabs.changeTo(portName);
        await statusBarSerial.open();
    } catch (error) {
        ampy.dispose();
        BU.progressLayer.hide();
        Debug.error(error);
        statusBarTerminal.addValue(`${error}\n`);
        statusBarTerminal.addValue(`==${Msg.Lang['shell.uploadFailed']}==\n`);
    }
}

/**
 * @function 特殊固件的烧录
 * @return {void}
 **/
BU.burnWithSpecialBin = () => {
    const { mainStatusBarTabs } = Mixly;
    const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
    const firmwares = SELECTED_BOARD.web.burn.special;
    let menu = [];
    let firmwareMap = {};
    for (let firmware of firmwares) {
        if (!firmware?.name && !firmware?.binFile) continue;
        menu.push({
            id: firmware.name,
            text: firmware.name
        });
        firmwareMap[firmware.name] = firmware.binFile;
    }
    BU.firmwareLayer.setMap(firmwareMap);
    BU.firmwareLayer.setMenu(menu);
    BU.firmwareLayer.show();
}

});