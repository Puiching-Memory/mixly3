goog.loadJs('common', () => {

goog.require('path');
goog.require('Mixly.Msg');
goog.require('Mixly.Env');

const { Msg, Env } = Mixly;

if (['zh-hans', 'zh-hant'].includes(Msg.nowLang)) {
    const i18nFilePath = path.join(Env.templatePath, `json/monaco.i18n.${Msg.nowLang}.json`);
    window.monacoI18N = goog.readJsonSync(i18nFilePath);
} else {
    window.monacoI18N = {};
}

});