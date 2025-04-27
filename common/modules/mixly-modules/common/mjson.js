goog.loadJs('common', () => {

goog.require('Mixly.Debug');
goog.provide('Mixly.MJson');

const { Debug, MJson } = Mixly;

MJson.operate = (jsonObj, optFunc) => {
    // 循环所有键
    for (var key in jsonObj) {
        //如果对象类型为object类型且数组长度大于0 或者 是对象 ，继续递归解析
        var element = jsonObj[key];
        if (element.length > 0 && typeof (element) == "object" || typeof (element) == "object") {
            let data = MJson.operate(element, optFunc);
            for (let i in data) {
                jsonObj[key][i] = data[i];
            }
        } else { //不是对象或数组、直接输出
            if (typeof (element) === 'string') {
                try {
                    jsonObj[key] = optFunc(jsonObj[key]);
                } catch (error) {
                    Debug.error(error);
                }
            }
        }
    }
    return jsonObj;
}

MJson.decode = (jsonObj) => {
    // 深度拷贝对象，防止解码或编码时篡改原有对象
    let newJsonObj = structuredClone(jsonObj);
    return MJson.operate(newJsonObj, decodeURIComponent);
}

MJson.encode = (jsonObj) => {
    // 深度拷贝对象，防止解码或编码时篡改原有对象
    let newJsonObj = structuredClone(jsonObj);
    return MJson.operate(newJsonObj, encodeURIComponent);;
}

MJson.parse = (jsonStr) => {
    let jsonObj = null;
    try {
        jsonStr = jsonStr.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
        jsonObj = JSON.parse(jsonStr);
    } catch (error) {
        Debug.error(error);
    }
    return jsonObj;
}

MJson.stringify = (jsonObj) => {
    let jsonStr = '';
    try {
        jsonStr = JSON.stringify(jsonObj);
    } catch (error) {
        Debug.error(error);
    }
    return jsonStr;
}

MJson.get = (inPath) => {
    return goog.readJsonSync(inPath);
}

});