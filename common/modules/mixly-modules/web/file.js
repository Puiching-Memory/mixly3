goog.loadJs('web', () => {

goog.require('path');
goog.require('Blockly');
goog.require('Mixly.MFile');
goog.require('Mixly.Title');
goog.require('Mixly.LayerExt');
goog.require('Mixly.Msg');
goog.require('Mixly.Workspace');
goog.provide('Mixly.Web.File');

const {
    MFile,
    Web,
    LayerExt,
    Msg,
    Title,
    Workspace
} = Mixly;

const { MSG } = Blockly.Msg;

const { File } = Web;

const platform = goog.platform();

File.obj = null;



File.getFileTypes = (filters) => {
    let fileTypes = [];
    if (platform === 'mobile') {
        fileTypes.push({
            description: 'Mixly File',
            accept: {
                'application/octet-stream': filters
            }
        });
    } else {
        fileTypes.push({
            description: 'Mixly File',
            accept: {
                'application/xml': filters
            }
        });
    }
    return fileTypes;
}

File.open = async () => {
    if (window.location.protocol === 'https:') {
        let filters = [];
        MFile.openFilters.map((data) => {
            filters.push(`.${data}`);
        });
        const fileConfig = {
            multiple: false,
            types: File.getFileTypes(filters),
            excludeAcceptAllOption: true,
            multiple: false,
        };
        try {
            const [ obj ] = await window.showOpenFilePicker(fileConfig);
            if (!obj) {
                return;
            }
            File.obj = obj;
            const extname = path.extname(obj.name);
            const fileInfo = await File.obj.getFile();
            if (!fileInfo) {
                return;
            }
            File.parseData(extname, await fileInfo.text());
            Title.updateTitle(`${obj.name} - ${Title.title}`);
        } catch (error) {
            console.log(error);
        }
    } else {
        const filters = '.' + MFile.openFilters.join(',.');
        MFile.openFile(filters, 'text', (fileObj) => {
            let { data, filename } = fileObj;
            const extname = path.extname(filename);
            File.parseData(extname, data);
            Title.updateTitle(`${filename} - ${Title.title}`);
        });
    }
}

File.parseData = (extname, text) => {
    const index = extname.indexOf(' ');
    if (index !== -1) {
        extname = extname.substring(0, index);
    }
    if (['.bin', '.hex'].includes(extname)) {
        MFile.loadHex(text);
    } else if (['.mix', '.xml', '.ino', '.py'].includes(extname)) {
        const mainWorkspace = Workspace.getMain();
        const editor = mainWorkspace.getEditorsManager().getActive();
        editor.setValue(text, extname);
    } else {
        layer.msg(Msg.Lang['file.type.error'], { time: 1000 });
        File.obj = null;
    }
}

File.save = async () => {
    window.userEvents && window.userEvents.addRecord({
        operation: 'save'
    });
    if (!File.obj) {
        File.saveAs();
        return;
    }
    const mainWorkspace = Workspace.getMain();
    const editor = mainWorkspace.getEditorsManager().getActive();
    let text = '';
    let extname = path.extname(File.obj.name);
    const index = extname.indexOf(' ');
    if (index !== -1) {
        extname = extname.substring(0, index);
    }
    if (['.mix', '.xml'].includes(extname)) {
        text = editor.getValue();
    } else if (['.ino', '.py'].includes(extname)) {
        text = editor.getCode();
    } else {
        return;
    }
    try {
        let currentLayero = null;
        const loadIndex = layer.msg(Msg.Lang['file.saving'], {
            icon: 16,
            shade: 0,
            time: 0,
            success: function(layero) {
                currentLayero = layero;
            }
        });
        const writer = await File.obj.createWritable({
            keepExistingData: true
        });
        await writer.write(text);
        await writer.close();
        let $content = currentLayero.children('.layui-layer-content');
        $content.html(`<i class="layui-layer-face layui-icon layui-icon-success"></i>${Msg.Lang['file.saveSucc']}`);
        currentLayero = null;
        $content = null;
        setTimeout(() => {
            layer.close(loadIndex);
        }, 500);
    } catch (error) {
        console.log(error);
    }
}

File.saveAs = async () => {
    let filters = [];
    MFile.saveFilters.map((data) => {
        filters.push(`.${data.extensions[0]}`);
    });
    const fileConfig = {
        types: File.getFileTypes(filters),
        suggestedName: 'mixly.mix'
    };
    try {
        const obj = await window.showSaveFilePicker(fileConfig);
        if (!obj) {
            return;
        }
        File.obj = obj;
        File.save();
        Title.updateTitle(`${obj.name} - ${Title.title}`);
    } catch (error) {
        console.log(error);
    }
}

File.new = async () => {
    const mainWorkspace = Workspace.getMain();
    const editor = mainWorkspace.getEditorsManager().getActive();
    const blockEditor = editor.getPage('block').getEditor();
    const codeEditor = editor.getPage('code').getEditor();
    const generator = Blockly.generator;
    const blocksList = blockEditor.getAllBlocks();
    if (editor.getPageType() === 'code') {
        const code = codeEditor.getValue(),
        workspaceToCode = generator.workspaceToCode(blockEditor) || '';
        if (!blocksList.length && workspaceToCode === code) {
            layer.msg(Msg.Lang['editor.codeEditorEmpty'], { time: 1000 });
            Title.updateTitle(Title.title);
            File.obj = null;
            return;
        }
    } else {
        if (!blocksList.length) {
            layer.msg(Msg.Lang['editor.blockEditorEmpty'], { time: 1000 });
            Title.updateTitle(Title.title);
            File.obj = null;
            return;
        }
    }
    layer.confirm(MSG['confirm_newfile'], {
        title: false,
        shade: LayerExt.SHADE_ALL,
        resize: false,
        success: (layero) => {
            const { classList } = layero[0].childNodes[1].childNodes[0];
            classList.remove('layui-layer-close2');
            classList.add('layui-layer-close1');
        },
        btn: [Msg.Lang['nav.btn.ok'], Msg.Lang['nav.btn.cancel']],
        btn2: (index, layero) => {
            layer.close(index);
        }
    }, (index, layero) => {
        layer.close(index);
        blockEditor.clear();
        blockEditor.scrollCenter();
        Blockly.hideChaff();
        codeEditor.setValue(generator.workspaceToCode(blockEditor) || '', -1);
        Title.updateTitle(Title.title);
        File.obj = null;
    });
}

});