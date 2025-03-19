goog.loadJs('common', () => {

goog.require('Mixly.Env');
goog.provide('Mixly.ScriptLoader');


const { Env, ScriptLoader } = Mixly;

/**
 * 加载 script 文件
 * @param src
 */
ScriptLoader.loadScript = function (src) {
    let addSign = true;
    let scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(src) !== -1) {
            addSign = false;
        }
    }
    if (addSign) {
        let $script = document.createElement('script');
        $script.setAttribute('type', 'text/javascript');
        $script.setAttribute('src', src);
        //$script.setAttribute('async', '');
        document.getElementsByTagName('head').item(0).appendChild($script);
    }
}

/**
 * 删除 script 文件
 * @param src
 */
ScriptLoader.removeScript = function (src) {
    let scripts = document.getElementsByTagName('script');
    if (src.indexOf('../') !== -1) {
        src = src.substring(src.lastIndexOf('../') + 3, src.length);
    }
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(src) !== -1) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
}

ScriptLoader.loadLangJs = function (oldLang, newLang, doFunc) {
    let scripts = document.querySelectorAll('script');
    let newLangPathArr = [];
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(oldLang + '.js') !== -1) {
            let oldLangPath = scripts[i].src;
            let newLangPath = oldLangPath.replace(oldLang + '.js', newLang + '.js');
            scripts[i].parentNode.removeChild(scripts[i]);
            newLangPathArr.push(newLangPath);
        }
    }
    for (let i = 0; i < Env.thirdPartyJS.length; i++) {
        Env.thirdPartyJS[i] = Env.thirdPartyJS[i].replace(oldLang + '.js', newLang + '.js');
    }
    LazyLoad.js(newLangPathArr, function () {
        doFunc();
    });
}

});