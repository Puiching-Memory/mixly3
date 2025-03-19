goog.loadJs('common', () => {

goog.require('Mixly');
goog.provide('Mixly.CssLoader');


const { CssLoader } = Mixly;

/**
 * 加载 link 文件
 * @param href
 */
CssLoader.loadCss = function (href) {
    let addSign = true;
    let links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        if (links[i] && links[i].href && links[i].href.indexOf(href) !== -1) {
            addSign = false;
        }
    }
    if (addSign) {
        let $link = document.createElement('link');
        $link.setAttribute('rel', 'stylesheet');
        $link.setAttribute('type', 'text/css');
        $link.setAttribute('href', href);
        document.getElementsByTagName('head').item(0).appendChild($link);
    }
}

/**
 * 删除 link 文件
 * @param href
 */
CssLoader.removeCss = function (href) {
    let links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        let _href = links[i].href;
        if (links[i] && links[i].href && links[i].href.indexOf(href) !== -1) {
            links[i].parentNode.removeChild(links[i]);
        }
    }
}

});