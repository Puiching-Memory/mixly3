(() => {

goog.require('Mixly.MJson');
goog.require('Mixly.Config');
goog.provide('Mixly.Msg');

const { Msg, MJson, Config } = Mixly;

const { USER } = Config;

Msg.LANG_PATH = {
	"zh-hans": "./mixly-sw/msg/zh-hans.json",
	"zh-hant": "./mixly-sw/msg/zh-hant.json",
	"en": "./mixly-sw/msg/en.json"
}

Msg.LANG = {
	"zh-hans": MJson.get(Msg.LANG_PATH["zh-hans"]),
	"zh-hant": MJson.get(Msg.LANG_PATH["zh-hant"]),
	"en": MJson.get(Msg.LANG_PATH["en"])
}

Msg.nowLang = USER.language ?? 'zh-hans';

Msg.getLang = (str) => {
	return Msg.LANG[Msg.nowLang][str];
}

console.log('Msg.LANG', Msg.LANG);

})();