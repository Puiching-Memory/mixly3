import * as Blockly from 'blockly/core';
import * as Mixly from 'mixly';
import CITYS_DATA from '../templates/json/cities.json';


/**
 * @name 模块名 Http GET请求
 * @support 支持板卡 {ESP8266, ESP32, ESP32C3, ESP32S2, ESP32S3}
 */
export const http_get = function () {
    const BOARD_TYPE = Mixly.Boards.getType();
    const API = Blockly.Arduino.valueToCode(this, 'api', Blockly.Arduino.ORDER_ATOMIC);
    let branch = Blockly.Arduino.statementToCode(this, 'success') || '';
    branch = branch.replace(/(^\s*)|(\s*$)/g, "");
    let branch1 = Blockly.Arduino.statementToCode(this, 'failure') || '';
    branch1 = branch1.replace(/(^\s*)|(\s*$)/g, "");
    let code = '';
    if (BOARD_TYPE == 'arduino_esp8266') {
        Blockly.Arduino.definitions_['include_ESP8266WiFi'] = '#include <ESP8266WiFi.h>';
        Blockly.Arduino.definitions_['include_ESP8266HTTPClient'] = '#include <ESP8266HTTPClient.h>';
        code
            = 'if (WiFi.status() == WL_CONNECTED) {\n'
            + '  WiFiClient client;\n'
            + '  HTTPClient http;\n'
            + '  http.begin(client, ' + API + ');\n'
            + '  int httpCode = http.GET();\n'
            + '  if (httpCode > 0) {\n'
            + '    String Request_result = http.getString();\n'
            + '    ' + branch + '\n'
            + '  } else {\n'
            + '    ' + branch1 + '\n'
            + '  }\n'
            + '  http.end();\n'
            + '}\n';
    } else {
        Blockly.Arduino.definitions_['include_WiFi'] = '#include <WiFi.h>';
        Blockly.Arduino.definitions_['include_HTTPClient'] = '#include <HTTPClient.h>';
        code
            = 'if (WiFi.status() == WL_CONNECTED) {\n'
            + '  HTTPClient http;\n'
            + '  http.begin(' + API + ');\n'
            + '  int httpCode = http.GET();\n'
            + '  if (httpCode > 0) {\n'
            + '    String Request_result = http.getString();\n'
            + '    ' + branch + '\n'
            + '  }\n'
            + '  else {\n'
            + '    ' + branch1 + '\n'
            + '  }\n'
            + '  http.end();\n'
            + '}\n';
    }
    return code;
};

/**
 * @name 模块名 Http PATCH|POST|PUT请求
 * @support 支持板卡 {ESP8266, ESP32, ESP32C3, ESP32S2, ESP32S3}
 */
export const http_post = function () {
    const BOARD_TYPE = Mixly.Boards.getType();
    const FIELD_TYPE = this.getFieldValue("TYPE");
    const API = Blockly.Arduino.valueToCode(this, 'api', Blockly.Arduino.ORDER_ATOMIC);
    const DATA = Blockly.Arduino.valueToCode(this, 'data', Blockly.Arduino.ORDER_ATOMIC);
    let branch = Blockly.Arduino.statementToCode(this, 'success') || '';
    branch = branch.replace(/(^\s*)|(\s*$)/g, "");
    let branch1 = Blockly.Arduino.statementToCode(this, 'failure') || '';
    branch1 = branch1.replace(/(^\s*)|(\s*$)/g, "");
    let code = '';
    if (BOARD_TYPE == 'arduino_esp8266') {
        Blockly.Arduino.definitions_['include_ESP8266WiFi'] = '#include <ESP8266WiFi.h>';
        Blockly.Arduino.definitions_['include_ESP8266HTTPClient'] = '#include <ESP8266HTTPClient.h>';
        code
            = 'if (WiFi.status() == WL_CONNECTED) {\n'
            + '  HTTPClient http;\n'
            + '  WiFiClient client;\n'
            + '  http.begin(client, ' + API + ');\n'
            + '  http.addHeader("Content-Type", "application/json");\n'
            + '  int httpCode = http.' + FIELD_TYPE + '(' + DATA + ');\n'
            + '  if (httpCode > 0) {\n'
            + '    String Request_result = http.getString();\n'
            + '    ' + branch + '\n'
            + '  } else {\n'
            + '    ' + branch1 + '\n'
            + '  }\n'
            + '  http.end();\n'
            + '}\n';
    } else {
        Blockly.Arduino.definitions_['include_WiFi'] = '#include <WiFi.h>';
        Blockly.Arduino.definitions_['include_HTTPClient'] = '#include <HTTPClient.h>';
        code
            = 'if (WiFi.status() == WL_CONNECTED) {\n'
            + '  HTTPClient http;\n'
            + '  http.begin(' + API + ');\n'
            + '  http.addHeader("Content-Type", "application/json");\n'
            + '  int httpCode = http.' + FIELD_TYPE + '(' + DATA + ');\n'
            + '  if (httpCode > 0) {\n'
            + '    String Request_result = http.getString();\n'
            + '    ' + branch + '\n'
            + '  }\n'
            + '  else {\n'
            + '    ' + branch1 + '\n'
            + '  }\n'
            + '  http.end();\n'
            + '}\n';
    }
    return code;
};

//网络天气
export const china_city = function () {
    var a = this.getFieldValue("province");
    var b = this.getFieldValue("city");
    var code = "";
    try {
        code = '"' + CITYS_DATA[a][b].pinyin + '"';
    } catch (e) {
        console.log(e);
    }
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

export const weather_private_key = function () {
    var a = this.getFieldValue("key");
    var code = '"' + a + '"';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

export const weather_seniverse_city_weather = function () {
    var api = this.getFieldValue("api");
    var location = Blockly.Arduino.valueToCode(this, "location", Blockly.Arduino.ORDER_ATOMIC);
    var private_key = Blockly.Arduino.valueToCode(this, "private_key", Blockly.Arduino.ORDER_ATOMIC);
    //private_key = private_key.replace(/\"/g, "")
    var language = this.getFieldValue("language");
    var unit = this.getFieldValue("unit");

    Blockly.Arduino.definitions_['include_ESP8266_Seniverse'] = '#include <ESP8266_Seniverse.h>';

    Blockly.Arduino.setups_['setup_serial_Serial'] = 'Serial.begin(9600);';

    switch (api) {
        case 'weather/now':
            Blockly.Arduino.definitions_['var_declare_weatherNow'] = 'WeatherNow weatherNow;';
            Blockly.Arduino.setups_['setup_seniverse_weatherNow'] = 'weatherNow.config(' + private_key + ', ' + location + ', "' + unit + '", "' + language + '");';
            break;
        case 'weather/daily':
            Blockly.Arduino.definitions_['var_declare_forecast'] = 'Forecast forecast;';
            Blockly.Arduino.setups_['setup_seniverse_forecast'] = 'forecast.config(' + private_key + ', ' + location + ', "' + unit + '", "' + language + '");';
            break;
        case 'life/suggestion':
        default:
            Blockly.Arduino.definitions_['var_declare_lifeInfo'] = 'LifeInfo lifeInfo;';
            Blockly.Arduino.setups_['setup_seniverse_lifeInfo'] = 'lifeInfo.config(' + private_key + ', ' + location + ', "' + unit + '", "' + language + '");';
    }
    var code = '';

    return code;
};

export const weather_get_seniverse_weather_info = function () {
    var api = this.getFieldValue("api");
    var type = this.getFieldValue("type");
    var code = '';
    switch (api) {
        case 'weather/now':
            code = 'weatherNow.' + type + '()';
            break;
        case 'weather/daily':
            code = 'forecast.' + type + '()';
            break;
        case 'life/suggestion':
        default:
            code = 'lifeInfo.' + type + '()';
    }

    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

export const weather_get_seniverse_weather_info1 = function () {
    var type = this.getFieldValue("type");
    var code = 'weatherNow.' + type + '()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

export const weather_get_seniverse_weather_info2 = function () {
    var date = this.getFieldValue("date");
    var type = this.getFieldValue("type");
    var code = 'forecast.' + type + '(' + date + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

export const weather_get_seniverse_weather_info3 = function () {
    var type = this.getFieldValue("type");
    var code = 'lifeInfo.' + type + '()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};