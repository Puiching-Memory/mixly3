import * as Blockly from 'blockly/core';
import CITYS_DATA from '../templates/json/cities.json';

const ETHERNET_HUE = 0;
const WEATHER_HUE = '#27b6ac';


/**
 * @name 模块名 Http GET请求
 * @support 支持板卡 {ESP8266, ESP32, ESP32C3, ESP32S2, ESP32S3}
 */
export const http_get = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_ETHERNET_CLINET_GET_REQUEST);
        this.appendValueInput("api")
            .setCheck(null)
            .appendField(Blockly.Msg.blynk_SERVER_ADD);
        this.appendStatementInput("success")
            .setCheck(null)
            .appendField(Blockly.Msg.MIXLY_SUCCESS);
        this.appendStatementInput("failure")
            .setCheck(null)
            .appendField(Blockly.Msg.MIXLY_FAILED);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(ETHERNET_HUE);
        this.setTooltip("");
    }
};

/**
 * @name 模块名 Http PATCH|POST|PUT请求
 * @support 支持板卡 {ESP8266, ESP32, ESP32C3, ESP32S2, ESP32S3}
 */
export const http_post = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["POST", "POST"],
                ["PATCH", "PATCH"],
                ["PUT", "PUT"]
            ]), "TYPE")
            .appendField(Blockly.Msg.blockpy_REQUESTS);
        this.appendValueInput("api")
            .setCheck(null)
            .appendField(Blockly.Msg.blynk_SERVER_ADD);
        this.appendValueInput("data")
            .setCheck(null)
            .appendField(Blockly.Msg.MIXLY_SD_DATA);
        this.appendStatementInput("success")
            .setCheck(null)
            .appendField(Blockly.Msg.MIXLY_SUCCESS);
        this.appendStatementInput("failure")
            .setCheck(null)
            .appendField(Blockly.Msg.MIXLY_FAILED);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(ETHERNET_HUE);
        this.setTooltip("");
    }
};

var PROVINCES = [], key;
for (key in CITYS_DATA)
    PROVINCES.push([key, key]);


function getCitysByProvince(a) {
    var b = [], c;
    for (c in CITYS_DATA[a])
        b.push([c, c]);
    return b;
}

var citysByProvince = {};
for (key of PROVINCES) {
    citysByProvince[key[0]] = getCitysByProvince(key[0]);
}

export const china_city = {
    init: function () {
        const defaultOptions = [["-", "-"]];
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(PROVINCES), "province")
            .appendField(new Blockly.FieldDependentDropdown("province", citysByProvince, defaultOptions), "city");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(WEATHER_HUE);
        this.setHelpUrl("");
        this.preProvince = null;
    }
};

export const weather_private_key = {
    init: function () {
        this.setColour(WEATHER_HUE);
        this.appendDummyInput("")
            .appendField(new Blockly.FieldDropdown([['S9l2sb_ZK-UsWaynG', 'S9l2sb_ZK-UsWaynG'], ['SpRpSYb7QOMT0M8Tz', 'SpRpSYb7QOMT0M8Tz'], ['SboqGMxP4tYNXUN8f', 'SboqGMxP4tYNXUN8f'], ['SJiRrYGYFkGnfi081', 'SJiRrYGYFkGnfi081'], ['SMhSshUxuTL0GLVLS', 'SMhSshUxuTL0GLVLS']]), 'key');
        this.setOutput(true, null);
    }
};

export const weather_seniverse_city_weather = {
    init: function () {
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MSG.catweather)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.MIXLY_LIVE_WEATHER, "weather/now"], [Blockly.Msg.MIXLY_3_DAY_WEATHER_FORECAST, "weather/daily"], [Blockly.Msg.MIXLY_6_LIFE_INDEXES, "life/suggestion"]]), "api")
            .appendField(Blockly.Msg.MIXLY_INFORMATION_CONFIGURATION);
        this.appendValueInput("location")
            .setCheck(null)
            .appendField(Blockly.Msg.MIXLY_GEOGRAPHIC_LOCATION);
        this.appendValueInput("private_key")
            .setCheck(null)
            .appendField(Blockly.Msg.MIXLY_API_PRIVATE_KEY);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_LANGUAGE)
            .appendField(new Blockly.FieldDropdown([
                ["简体中文", "zh-Hans"],
                ["繁體中文", "zh-Hant"],
                ["English", "en"]
            ]), "language");
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_TEMPERATURE_UNIT)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.MIXLY_CELSIUS + "(℃)", "c"], [Blockly.Msg.MIXLY_FAHRENHEIT + "(℉)", "f"]]), "unit");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(WEATHER_HUE);
        this.setTooltip("这里的API私钥免费体验有次数限制\n访问频率限制20次/分钟");
        this.setHelpUrl("");
    }
};


export const weather_get_seniverse_weather_info = {
    init: function () {
        this.appendDummyInput("")
            //.appendField("心知天气")
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_LIVE_WEATHER, "weather/now"],
                [Blockly.Msg.MIXLY_3_DAY_WEATHER_FORECAST, "weather/daily"],
                [Blockly.Msg.MIXLY_6_LIFE_INDEXES, "life/suggestion"]
            ]), "api")
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_AVAILABLE, "update"],
                [Blockly.Msg.MIXLY_GET_DATA_UPDATE_TIME, "getLastUpdate"],
                [Blockly.Msg.MIXLY_GET_SERVER_RESPONSE_STATUS_CODE, "getServerCode"]
            ]), "type");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(WEATHER_HUE);
        this.setTooltip("");
        this.setHelpUrl("");
    }

};

export const weather_get_seniverse_weather_info1 = {
    init: function () {
        this.appendDummyInput("")
            //.appendField("心知天气")
            .appendField(Blockly.Msg.MIXLY_LIVE_WEATHER)
            .appendField(Blockly.Msg.MIXLY_GET)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.MIXLY_WEATHER_PHENOMENON, "getWeatherText"], [Blockly.Msg.MIXLY_WEATHER_PHENOMENON_CODE, "getWeatherCode"], [Blockly.Msg.MIXLY_TEMPERATURE, "getDegree"]]), "type");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(WEATHER_HUE);
        this.setTooltip("");
        this.setHelpUrl("");
    }

};

export const weather_get_seniverse_weather_info2 = {
    init: function () {
        this.appendDummyInput("")
            //.appendField("心知天气")
            .appendField(Blockly.Msg.MIXLY_3_DAY_WEATHER_FORECAST)
            .appendField(Blockly.Msg.MIXLY_GET)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.MIXLY_TODAY, "0"], [Blockly.Msg.MIXLY_TOMORROW, "1"], [Blockly.Msg.MIXLY_DAY_AFTER_TOMORROW, "2"]]), "date")
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.ForecastHigh, "getHigh"],
                [Blockly.Msg.ForecastLow, "getLow"],
                [Blockly.Msg.MIXLY_DAYTIME_WEATHER_PHENOMENON, "getDayText"],
                [Blockly.Msg.MIXLY_DAYTIME_WEATHER_PHENOMENON_CODE, "getDayCode"],
                [Blockly.Msg.MIXLY_EVENING_WEATHER_PHENOMENON, "getNightText"],
                [Blockly.Msg.MIXLY_EVENING_WEATHER_PHENOMENON_CODE, "getNightCode"],
                [Blockly.Msg.MIXLY_PROBABILITY_OF_PRECIPITATION, "getRain"],
                [Blockly.Msg.ForecastFx, "getWindDirection"],
                [Blockly.Msg.MIXLY_WIND_SPEED, "getWindSpeed"],
                [Blockly.Msg.MIXLY_WIND_RATING, "getWindScale"],
                [Blockly.Msg.MIXLY_Humidity, "getHumidity"]
            ]), "type");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(WEATHER_HUE);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

export const weather_get_seniverse_weather_info3 = {
    init: function () {
        this.appendDummyInput("")
            //.appendField("心知天气")
            .appendField(Blockly.Msg.MIXLY_6_LIFE_INDEXES)
            .appendField(Blockly.Msg.MIXLY_GET)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_CAR_WASH_INDEX, "getCarWash"],
                [Blockly.Msg.MIXLY_DRESSING_INDEX, "getDressing"],
                [Blockly.Msg.MIXLY_COLD_INDEX, "getFactorFlu"],
                [Blockly.Msg.MIXLY_MOVEMENT_INDEX, "getExercise"],
                [Blockly.Msg.MIXLY_TOURISM_INDEX, "getTravel"],
                [Blockly.Msg.MIXLY_UV_INDEX, "getUV"]]
            ), "type");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(WEATHER_HUE);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};