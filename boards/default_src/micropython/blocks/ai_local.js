import * as Blockly from 'blockly/core';
const AI_LOCAL_VOICE_HUE = '#2FAD7A'; 
const AI_LOCAL_GRAPH_HUE = '#90A244'; 

//voice part
export const VOICE_RECOGNITION_CONTROL = {
    init: function () {
        this.setColour(AI_LOCAL_VOICE_HUE);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_AipSpeech_asr)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_ON,"1"],
                [Blockly.Msg.MIXLY_OFF,"0"]
            ]),"control")
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
}

export const CI130X_IDENTIFY_AND_SAVE_SANT = {
    init: function () {
        this.setColour(AI_LOCAL_VOICE_HUE);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_AipSpeech_asr + Blockly.Msg.MIXLY_IDENTIFY_ONCE_AND_SAVE)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
};

export const CI130X_GET_WHETHER_IDENTIFY_SANT = {
    init: function () {
        this.setColour(AI_LOCAL_VOICE_HUE);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_AipSpeech_asr + Blockly.Msg.MIXLY_GET)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_HELLO_XIAOZHI, "1"],
                [Blockly.Msg.MIXLY_XIAOZHIXIAOZHI, "2"],
                [Blockly.Msg.MIXLY_THE_FIRST, "3"],
                [Blockly.Msg.MIXLY_THE_SECOND, "4"],
                [Blockly.Msg.MIXLY_THE_THIRD, "5"],
                [Blockly.Msg.MIXLY_THE_FOURTH, "6"],
                [Blockly.Msg.MIXLY_THE_FIFTH, "7"],
                [Blockly.Msg.MIXLY_THE_SIXTH, "8"],
                [Blockly.Msg.MIXLY_THE_SEVENTH, "9"],
                [Blockly.Msg.MIXLY_THE_EIGHTH, "10"],
                [Blockly.Msg.MIXLY_THE_NINTH, "11"],
                [Blockly.Msg.MIXLY_THE_TENTH, "12"],
                [Blockly.Msg.MIXLY_THE_ELEVENTH, "13"],
                [Blockly.Msg.MIXLY_THE_TWELFTH, "14"],
                [Blockly.Msg.MIXLY_THE_13TH, "15"],
                [Blockly.Msg.MIXLY_THE_14TH, "16"],
                [Blockly.Msg.MIXLY_THE_15TH, "17"],
                [Blockly.Msg.MIXLY_THE_16TH, "18"],
                [Blockly.Msg.MIXLY_THE_17TH, "19"],
                [Blockly.Msg.MIXLY_THE_18TH, "20"],
                [Blockly.Msg.MIXLY_THE_19TH, "21"],
                [Blockly.Msg.MIXLY_THE_20TH, "22"],
                [Blockly.Msg.MIXLY_Turn_on_the_lights, "23"],
                [Blockly.Msg.MIXLY_Turn_off_the_lights, "24"],
                [Blockly.Msg.MIXLY_Turn_up_the_brightness, "25"],
                [Blockly.Msg.MIXLY_Turn_down_the_brightness, "26"],
                [Blockly.Msg.MIXLY_Set_it_to_red, "27"],
                [Blockly.Msg.MIXLY_Set_it_to_orange, "28"],
                [Blockly.Msg.MIXLY_Set_it_to_yellow, "29"],
                [Blockly.Msg.MIXLY_Set_it_to_green, "30"],
                [Blockly.Msg.MIXLY_Set_it_to_cyan, "31"],
                [Blockly.Msg.MIXLY_Set_it_to_blue, "32"],
                [Blockly.Msg.MIXLY_Set_it_to_purple, "33"],
                [Blockly.Msg.MIXLY_Set_it_to_white, "34"],
                [Blockly.Msg.MIXLY_Turn_on_the_fan, "35"],
                [Blockly.Msg.MIXLY_Turn_off_the_fan, "36"],
                [Blockly.Msg.MIXLY_First_gear, "37"],
                [Blockly.Msg.MIXLY_Wind_speed_second, "38"],
                [Blockly.Msg.MIXLY_Third_gear, "39"],
                [Blockly.Msg.MIXLY_Previous, "40"],
                [Blockly.Msg.MIXLY_Next_page, "41"],
                [Blockly.Msg.MIXLY_Show_smiley_face, "42"],
                [Blockly.Msg.MIXLY_Show_crying_face, "43"],
                [Blockly.Msg.MIXLY_Show_love, "44"],
                [Blockly.Msg.MIXLY_Close_display, "45"],
                [Blockly.Msg.MIXLY_Start_execution, "46"],
                [Blockly.Msg.MIXLY_FORWARD, "47"],
                [Blockly.Msg.MIXLY_BACKWARD, "48"],
                [Blockly.Msg.MIXLY_TURNLEFT, "49"],
                [Blockly.Msg.MIXLY_TURNRIGHT, "50"],
                [Blockly.Msg.MIXLY_STOP, "51"],
                [Blockly.Msg.MIXLY_Accelerate, "52"],
                [Blockly.Msg.MIXLY_retard, "53"],
                [Blockly.Msg.ROTATION_FORWARD, "54"],
                [Blockly.Msg.ROTATION_BACKWARD, "55"],
                [Blockly.Msg.MIXLY_Query_temperature, "56"],
                [Blockly.Msg.MIXLY_Query_humidity, "57"],
                [Blockly.Msg.MIXLY_Query_brightness, "58"],
                [Blockly.Msg.MIXLY_Query_sound, "59"],
                [Blockly.Msg.MIXLY_Query_time, "60"],
                [Blockly.Msg.MIXLY_Query_distance, "61"],
                [Blockly.Msg.MIXLY_Query_pressure, "62"],
                [Blockly.Msg.MIXLY_Query_key, "63"],
                [Blockly.Msg.MIXLY_Query_touch, "64"],
                [Blockly.Msg.MIXLY_Query_color, "65"]
            ]), "cmd")
            .appendField(Blockly.Msg.MIXLY_WHETHER + Blockly.Msg.MIXLY_BE_IDENTIFIED);
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const CI130X_GET_THE_RECOGNIZED_CMD_SANT = {
    init: function () {
        this.setColour(AI_LOCAL_VOICE_HUE);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_AipSpeech_asr + Blockly.Msg.MIXLY_GET)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_RECOGNIZED_STATE, "status1"],
                [Blockly.Msg.MIXLY_WHETHER_BROADCAST, "status2"],
                [Blockly.Msg.MIXLY_THE_RECOGNIZED_CMD, "result"]
            ]), "key")
        this.setOutput(true);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MIXLY_CI130X_GET_THE_RECOGNIZED_STATE_TOOLTIP);
    }
};

export const CI130X_BROADCAST_SANT = {
    init: function () {
        this.setColour(AI_LOCAL_VOICE_HUE);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_AipSpeech_asr + Blockly.Msg.MIXLY_MP3_PLAY)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_MICROBIT_JS_INOUT_PULL_NONE, "None"],
                [Blockly.Msg.MIXLY_WIND_SPEED, "154"],
                [Blockly.Msg.MIXLY_HYETAL, "155"],
                [Blockly.Msg.MIXLY_TEMPERATURE, "156"],
                [Blockly.Msg.MIXLY_Humidity, "157"],
                [Blockly.Msg.MIXLY_Altitude, "158"],
                [Blockly.Msg.MIXLY_SOUND, "159"],
                [Blockly.Msg.MIXLY_BRIGHTNESS, "160"],
                [Blockly.Msg.ME_GO_HALL_SENSOR_DISTANCE, "161"],
                [Blockly.Msg.MIXLY_SERVO, "162"],
                [Blockly.Msg.MIXLY_MICROBIT_JS_BY_ANGLE, "163"],
                [Blockly.Msg.MIXLY_BUTTON2, "164"],
                [Blockly.Msg.MIXLY_ESP32_TOUCH, "165"],
                [Blockly.Msg.MIXLY_PAY, "166"],
                [Blockly.Msg.MIXLY_CARSH_CHANGE, "167"],
                [Blockly.Msg.MIXLY_COUNTDOWN, "168"],
                [Blockly.Msg.MIXLY_TIMING, "169"],
                [Blockly.Msg.MIXLY_AT_THE_MOMENT, "170"],
                [Blockly.Msg.MIXLY_MICROBIT_JS_CURRENT_GESTURE, "171"],
                [Blockly.Msg.MIXLY_FORWARD, "172"],
                [Blockly.Msg.MIXLY_BACKWARD, "173"],
                [Blockly.Msg.MIXLY_TURNLEFT, "174"],
                [Blockly.Msg.MIXLY_TURNRIGHT, "175"],
                [Blockly.Msg.MIXLY_STOP, "176"],
                [Blockly.Msg.MIXLY_Accelerate, "177"],
                [Blockly.Msg.MIXLY_retard, "178"],
                [Blockly.Msg.ROTATION_FORWARD, "179"],
                [Blockly.Msg.ROTATION_BACKWARD, "180"],
                [Blockly.Msg.TUPLE_JOIN, "181"],
                [Blockly.Msg.MIXLY_SHOW, "182"],
                [Blockly.Msg.MIXLY_LAMPLIGHT, "183"],
                [Blockly.Msg.MIXLY_ACCELERATION, "184"]
            ]), "star");
        this.appendValueInput('NUM')
            .appendField(Blockly.Msg.MIXLY_NUMBER);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_UNIT)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_MICROBIT_JS_INOUT_PULL_NONE, "None"],
                [Blockly.Msg.MIXLY_YEAR, "117"],
                [Blockly.Msg.MIXLY_MONTH, "118"],
                [Blockly.Msg.MIXLY_DAY, "119"],
                [Blockly.Msg.MIXLY_HOUR, "120"],
                [Blockly.Msg.MIXLY_MINUTE, "121"],
                [Blockly.Msg.MIXLY_SECOND, "122"],
                [Blockly.Msg.MIXLY_WEEK2, "123"],
                [Blockly.Msg.MIXLY_RMB_UNIT, "124"],
                [Blockly.Msg.blockpy_setheading_degree, "125"],
                [Blockly.Msg.MIXLY_GEAR, "126"],
                [Blockly.Msg.MIXLY_LAYER, "127"],
                [Blockly.Msg.MIXLY_GRAM, "128"],
                [Blockly.Msg.MIXLY_METER, "129"],
                [Blockly.Msg.MIXLY_CENTIMETER, "130"],
                [Blockly.Msg.MIXLY_MILLIMETER, "131"],
                [Blockly.Msg.MIXLY_LUMEN, "132"],
                [Blockly.Msg.MIXLY_DECIBEL, "133"],
                [Blockly.Msg.MIXLY_hectopascal, "134"],
                [Blockly.Msg.MIXLY_PERCENT, "135"],
                [Blockly.Msg.MIXLY_CELSIUS, "136"],
                [Blockly.Msg.MIXLY_METER_PER_SEC, "137"],
                [Blockly.Msg.MIXLY_MICROBIT_Turn_on_display, "138"],
                [Blockly.Msg.MIXLY_MICROBIT_Turn_off_display, "139"],
                [Blockly.Msg.MIXLY_SUCCESS, "140"],
                [Blockly.Msg.MIXLY_FAILED, "141"],
                [Blockly.Msg.MIXLY_WRONG, "142"],
                [Blockly.Msg.MIXLY_GOOD, "143"],
                [Blockly.Msg.MIXLY_blockpy_set_add, "144"],
                [Blockly.Msg.MIXLY_DECREASE, "145"],
                [Blockly.Msg.COLOUR_RGB_RED, "146"],
                [Blockly.Msg.COLOUR_RGB_ORANGE, "147"],
                [Blockly.Msg.COLOUR_YELLOW, "148"],
                [Blockly.Msg.COLOUR_RGB_GREEN, "149"],
                [Blockly.Msg.COLOUR_CYAN, "150"],
                [Blockly.Msg.COLOUR_RGB_BLUE, "151"],
                [Blockly.Msg.COLOUR_RGB_PURPLE, "152"],
                [Blockly.Msg.COLOUR_RGB_WHITE, "153"]
            ]), "end");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
}

export const CI130X_SET_SYSTEM_CMD_SANT = {
    init: function () {
        this.setColour(AI_LOCAL_VOICE_HUE);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_AipSpeech_asr + Blockly.Msg.LISTS_SET_INDEX_SET + Blockly.Msg.MIXLY_SYSTEM + Blockly.Msg.MIXLY_CMD)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MILXY_ENTER_WAKE_UP, "1"],
                [Blockly.Msg.MIXLY_INCREASE_VOLUME, "202"],
                [Blockly.Msg.MIXLY_REDUCE_VOLUME, "203"],
                [Blockly.Msg.MIXLY_MAX_VOLUME, "204"],
                [Blockly.Msg.MIXLY_MINIMUM, "205"],
                [Blockly.Msg.MIXLY_OPEN_RESPONSE, "206"],
                [Blockly.Msg.MIXLY_CLOSE_RESPONSE, "207"],
                [Blockly.Msg.MIXLY_QUIT_WAKE_UP, "208"]
            ]), "cmd")
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
};




//graph part
export const CREATE_CAMERA = {
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_SETUP + Blockly.Msg.MIXLY_SMARTCAMERA)
            .appendField(Blockly.Msg.LISTS_SET_INDEX_SET + Blockly.Msg.MIXLY_SHOOTING_SIZE)
            .appendField(new Blockly.FieldDropdown([
                ['LCD : 240px*240px', "LCD"],
                ['VGA : 640px*480px', "VGA"],
                ['QVGA : 320px*240px', "QVGA"],
                ['QQVGA : 160px*120px', "QQVGA"]
            ]), "cmd")
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
};

export const SHOOT_AND_SAVE_PICTURE = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('direct')
            .appendField(Blockly.Msg.MIXLY_SHOOT_AND_SAVE_PICTURE)
            .appendField(Blockly.Msg.LISTS_SET_INDEX_SET + Blockly.Msg.MICROPYTHON_HUSKYLENS_SAVE_AS + Blockly.Msg.MIXLY_MICROBIT_PY_STORAGE_THE_PATH);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
};

export const GET_PICTURE_DATA = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_GET_PICTURE_DATA);
        this.setOutput(true);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MIXLY_GET_PICTURE_DATA_TOOLTIP);
    }
};

export const SCREEN_SHOW_CAM_GRAPH_SHOOT = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_MICROBIT_Turn_on_display,"display"],
                [Blockly.Msg.MIXLY_MICROBIT_Turn_off_display,"display_stop"]
            ]),"control")
            .appendField(Blockly.Msg.MIXlY_SCREEN_SHOW_CAM_SHOOT);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
};

export const AI_CAMERA_INIT = {
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .appendField(Blockly.Msg.MIXLY_MICROPYTHON_SOCKET_MAKE)
            .setCheck("var");
        this.appendDummyInput("")
            .appendField(Blockly.Msg.MIXLY_SETUP + Blockly.Msg.LISTS_SET_INDEX_INPUT_TO)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_QR_CODE + Blockly.Msg.MIXLY_RECOGNITION, "CODE_DETECTION"],
                [Blockly.Msg.MIXLY_COLOR_RECOGNTITION, "COLOR_DETECTION"],
                [Blockly.Msg.MIXLY_CAT_FACE + Blockly.Msg.MIXLY_RECOGNITION, "CAT_FACE_DETECTION"],
                [Blockly.Msg.MIXLY_FACE_CLASSIFIER, "FACE_DETECTION"],
                [Blockly.Msg.MIXLY_AipFace, "FACE_RECOGNITION"]
            ]), "kind");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};


export const GET_QR_CODE_RECOGNITION_DATA = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
                this.appendValueInput('SUB')
            .setCheck("var");
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_GET_QR_CODE_RECOGNITION_RESULT);
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const GET_COLOR_DETECTION_NUM = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
                this.appendValueInput('SUB')
            .setCheck("var");
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_RECOGNITION + Blockly.Msg.MIXLY_HOW_MUCH)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.COLOUR_RGB_RED,"0"],
                [Blockly.Msg.COLOUR_RGB_ORANGE,"1"],
                [Blockly.Msg.COLOUR_RGB_YELLOW,"2"],
                [Blockly.Msg.COLOUR_RGB_GREEN,"3"],
                [Blockly.Msg.COLOUR_RGB_CYAN,"4"],
                [Blockly.Msg.COLOUR_RGB_BLUE,"5"],
                [Blockly.Msg.COLOUR_RGB_PURPLE,"6"],
                [Blockly.Msg.COLOUR_RGB_WHITE,"7"],
                [Blockly.Msg.COLOUR_RGB_GREY,"8"],
                [Blockly.Msg.MIXLY_CUSTOM_STUDY,"9"]
            ]),'color');
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_Pixel_block);
        this.setOutput(true);
        this.setInputsInline(true);
        // this.setTooltip(Blockly.Msg.MIXLY_GET_COLOR_DETECTION_RESULT_TOOLTIP);
    }
};

export const GET_COLOR_DETECTION_LOCATION = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendValueInput('NO')
            .appendField(Blockly.Msg.MIXLY_GET + Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER1);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER2)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.COLOUR_RGB_RED,"0"],
                [Blockly.Msg.COLOUR_RGB_ORANGE,"1"],
                [Blockly.Msg.COLOUR_RGB_YELLOW,"2"],
                [Blockly.Msg.COLOUR_RGB_GREEN,"3"],
                [Blockly.Msg.COLOUR_RGB_CYAN,"4"],
                [Blockly.Msg.COLOUR_RGB_BLUE,"5"],
                [Blockly.Msg.COLOUR_RGB_PURPLE,"6"],
                [Blockly.Msg.COLOUR_RGB_WHITE,"7"],
                [Blockly.Msg.COLOUR_RGB_GREY,"8"],
                [Blockly.Msg.MIXLY_CUSTOM_STUDY,"9"]
            ]),'color');
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_Pixel_block + Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_POSITION_XY);
        this.setOutput(true);
        this.setInputsInline(true);
        // this.setTooltip(Blockly.Msg.MIXLY_GET_COLOR_DETECTION_RESULT_TOOLTIP);
    }
};

export const GET_CAT_FACE_DETECTION_NUM = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
                this.appendValueInput('SUB')
            .setCheck("var");
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_RECOGNITION + Blockly.Msg.MIXLY_HOW_MUCH +Blockly.Msg.MIXLY_CAT_FACE)
        this.setOutput(true);
        this.setInputsInline(true);
        // this.setTooltip(Blockly.Msg.MIXLY_GET_COLOR_DETECTION_RESULT_TOOLTIP);
    }
};

export const GET_CAT_FACE_DETECTION_LOCATION = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendValueInput('NO')
            .appendField(Blockly.Msg.MIXLY_GET + Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER1);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER2 + Blockly.Msg.MIXLY_CAT_FACE + Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_POSITION_XY);
        this.setOutput(true);
        this.setInputsInline(true);
        // this.setTooltip(Blockly.Msg.MIXLY_GET_COLOR_DETECTION_RESULT_TOOLTIP);
    }
};

export const GET_FACE_DETECTION_NUM = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
                this.appendValueInput('SUB')
            .setCheck("var");
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_RECOGNITION + Blockly.Msg.MIXLY_HOW_MUCH +Blockly.Msg.MIXLY_FACE)
        this.setOutput(true);
        this.setInputsInline(true);
        // this.setTooltip(Blockly.Msg.MIXLY_GET_COLOR_DETECTION_RESULT_TOOLTIP);
    }
};

export const GET_FACE_DETECTION_LOCATION = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendValueInput('NO')
            .appendField(Blockly.Msg.MIXLY_GET + Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER1);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER2 + Blockly.Msg.MIXLY_FACE + Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_POSITION_XY);
        this.setOutput(true);
        this.setInputsInline(true);
        // this.setTooltip(Blockly.Msg.MIXLY_GET_COLOR_DETECTION_RESULT_TOOLTIP);
    }
};

export const GET_FACE_DETECTION_KEYPOINT_LOCATION = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendValueInput('NO')
            .appendField(Blockly.Msg.MIXLY_GET + Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER1);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_4DIGITDISPLAY_NOMBER2 + Blockly.Msg.MIXLY_FACE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_KEYPOINT)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_LEFT_EYE,"0"],
                [Blockly.Msg.MIXLY_RIGHT_EYE,"1"],
                [Blockly.Msg.MIXLY_NOSE,"2"],
                [Blockly.Msg.MIXLY_LEFT_MOUSE_CORNER,"3"],
                [Blockly.Msg.MIXLY_RIGHT_MOUSE_CORNER,"4"]
            ]),'kp')
            .appendField(Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_POSITION_XY);
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const GET_FACE_RECOGNITION_ID = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
                this.appendValueInput('SUB')
            .setCheck("var");
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_RECOGNITION_RECGNITION + Blockly.Msg.MIXLY_FACE + 'ID');
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const GET_FACE_RECOGNITION_ID_LOCATION = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendValueInput('NO')
            .appendField(Blockly.Msg.MIXLY_GET +'ID'+ Blockly.Msg.MIXLY_AS);
        this.appendDummyInput()
            .appendField(Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_FACE + Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_POSITION_XY);
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const GET_FACE_RECOGNITION_ID_KEYPOINT_LOCATION = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendValueInput('NO')
            .appendField(Blockly.Msg.MIXLY_GET + 'ID'+ Blockly.Msg.MIXLY_AS);
        this.appendDummyInput()
            .appendField(Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_FACE);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MIXLY_KEYPOINT)
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Msg.MIXLY_LEFT_EYE,"0"],
                [Blockly.Msg.MIXLY_RIGHT_EYE,"1"],
                [Blockly.Msg.MIXLY_NOSE,"2"],
                [Blockly.Msg.MIXLY_LEFT_MOUSE_CORNER,"3"],
                [Blockly.Msg.MIXLY_RIGHT_MOUSE_CORNER,"4"]
            ]),'kp')
            .appendField(Blockly.Msg.blockpy_set_of + Blockly.Msg.MIXLY_POSITION_XY);
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const PEOPLE_FACE_ENROLL = { 
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendDummyInput()
            .appendField(Blockly.Msg.FACE_ENROLL);
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

export const DELETE_PEOPLE_FACE_ID= {
    init: function () {
        this.setColour(AI_LOCAL_GRAPH_HUE);
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendValueInput("ID")
            .appendField(Blockly.Msg.MIXLY_DELETE_PEOPLE_FACE_ID);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
};