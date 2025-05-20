goog.loadJs('common', () => {

goog.require('path');
goog.require('Mixly.MJson');
goog.require('Mixly.Config');
goog.require('Mixly.Env');
goog.require('Blockly');
goog.require('Blockly.Lang.ZhHans');
goog.require('Blockly.Lang.ZhHant');
goog.require('Blockly.Lang.En');
goog.provide('Mixly.Msg');

const {
    Msg,
    MJson,
    Config,
    Env
} = Mixly;

const { USER } = Config;

const {
    ZhHans,
    ZhHant,
    En
} = Blockly.Lang;


Msg.LANG_TYPE = ['zh-hans', 'zh-hant', 'en'];
Msg.LANG = {
    'zh-hans': MJson.get(path.join(Env.msgPath, 'mixly/zh-hans.json')),
    'zh-hant': MJson.get(path.join(Env.msgPath, 'mixly/zh-hant.json')),
    'en': MJson.get(path.join(Env.msgPath, 'mixly/en.json'))
};
Msg.BLOCKLY_LANG = {
    'zh-hans': ZhHans,
    'zh-hant': ZhHant,
    'en': En
};
Msg.BLOCKLY_LANG_DEFAULT = {
    'zh-hans': MJson.get(path.join(Env.msgPath, 'blockly/default/zh-hans.json')),
    'zh-hant': MJson.get(path.join(Env.msgPath, 'blockly/default/zh-hant.json')),
    'en': MJson.get(path.join(Env.msgPath, 'blockly/default/en.json'))
};
Msg.nowLang = USER.language ?? 'zh-hans';
Msg.blocklyDefault = Blockly.Msg;

Msg.getLang = (str) => {
    return Msg.LANG[Msg.nowLang][str] ?? '';
}

Msg.changeTo = (lang) => {
    lang = Msg.LANG_TYPE.includes(lang) ? lang : 'zh-hans';
    Msg.nowLang = lang;
    Msg.Lang = Msg.LANG[lang];
    Blockly.Msg = Msg.BLOCKLY_LANG[lang];
    Object.assign(Msg.blocklyDefault, Msg.BLOCKLY_LANG_DEFAULT[lang]);
}

Msg.renderToolbox = (addToolboxitemid = false) => {
    let $categories = $('#toolbox').find('category');
    for (let i = 0; i < $categories.length; i++) {
        let { id } = $categories[i];
        if (!Blockly.Msg.MSG[id]) {
            continue;
        }
        let $category = $($categories[i]);
        $category.attr('name', Blockly.Msg.MSG[id]);
        if (addToolboxitemid) {
            if ($category.attr('toolboxitemid')) {
                continue;
            }
            $category.attr({
                'toolboxitemid': id,
                'name': Blockly.Msg.MSG[id]
            });
        } else {
            $(`span[id="${id}.label"]`).html(Blockly.Msg.MSG[id]);
        }
    }
}

Msg.changeTo(Msg.nowLang);

});