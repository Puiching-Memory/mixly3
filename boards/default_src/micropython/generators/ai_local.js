import { Boards } from 'mixly';

//voice part
export const CI130X_IDENTIFY_AND_SAVE_SANT = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    if(version == 'mixgo_sant'){
        generator.definitions_['import_' + version + '_onboard_asr'] = 'from ' + version + ' import onboard_asr';
        var code = 'onboard_asr.cmd_id()\n';
    }
    else if(version == 'mixgo_mini'){
        generator.definitions_['import_mini_gx_ext_asr'] = 'from mini_gx import ext_asr';
        var code = 'ext_asr.cmd_id()\n';
    }
    return code;
}

export const CI130X_GET_WHETHER_IDENTIFY_SANT = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    if(version == 'mixgo_sant'){
        generator.definitions_['import_' + version + '_onboard_asr'] = 'from ' + version + ' import onboard_asr';
        var cmd = this.getFieldValue('cmd');
        var code = 'onboard_asr.result(' + cmd + ')';
    }
    else if(version == 'mixgo_mini'){
        generator.definitions_['import_mini_gx_ext_asr'] = 'from mini_gx import ext_asr';
        var cmd = this.getFieldValue('cmd');
        var code = 'ext_asr.result(' + cmd + ')';
    }
    return [code, generator.ORDER_ATOMIC];
}

export const CI130X_GET_THE_RECOGNIZED_CMD_SANT = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    if(version == 'mixgo_sant'){
        generator.definitions_['import_' + version + '_onboard_asr'] = 'from ' + version + ' import onboard_asr';
        var key = this.getFieldValue('key');
        if (key == 'status1') {
            var code = 'onboard_asr.status()[0]';
        } else if (key == 'status2') {
            var code = 'onboard_asr.status()[1]';
        } else {
            var code = 'onboard_asr.' + key + '()';
        }
    }else if(version == 'mixgo_mini'){
        generator.definitions_['import_mini_gx_ext_asr'] = 'from mini_gx import ext_asr';
        var key = this.getFieldValue('key');
        if (key == 'status1') {
            var code = 'ext_asr.status()[0]';
        } else if (key == 'status2') {
            var code = 'ext_asr.status()[1]';
        } else {
            var code = 'ext_asr.' + key + '()';
        }
    }
    return [code, generator.ORDER_ATOMIC];
}




//graph part
export const CI130X_BROADCAST_SANT = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    if(version == 'mixgo_sant'){
        generator.definitions_['import_' + version + '_onboard_asr'] = 'from ' + version + ' import onboard_asr';
        var num = generator.valueToCode(this, 'NUM', generator.ORDER_ATOMIC);
        var star = this.getFieldValue('star');
        var end = this.getFieldValue('end');
        var code = 'onboard_asr.play(' + star + ', ' + num + ', ' + end + ')\n';
    }else if(version == 'mixgo_mini'){
        generator.definitions_['import_mini_gx_ext_asr'] = 'from mini_gx import ext_asr';
        var num = generator.valueToCode(this, 'NUM', generator.ORDER_ATOMIC);
        var star = this.getFieldValue('star');
        var end = this.getFieldValue('end');
        var code = 'ext_asr.play(' + star + ', ' + num + ', ' + end + ')\n';
    }
    return code;
}

export const CI130X_SET_SYSTEM_CMD_SANT = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    if(version == 'mixgo_sant'){
        generator.definitions_['import_' + version + '_onboard_asr'] = 'from ' + version + ' import onboard_asr';
        var cmd = this.getFieldValue('cmd');
        var code = 'onboard_asr.sys_cmd(' + cmd + ')\n';
    }else if(version == 'mixgo_mini'){
        generator.definitions_['import_mini_gx_ext_asr'] = 'from mini_gx import ext_asr';
        var cmd = this.getFieldValue('cmd');
        var code = 'ext_asr.sys_cmd(' + cmd + ')\n';
    }
    return code;
}

export const CREATE_CAMERA = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    generator.definitions_['import_camera'] = 'import camera';
    var cmd = this.getFieldValue('cmd');
    var code = 'cam = camera.GC032A(camera.' + cmd + ')\n';
    return code;
}

export const SHOOT_AND_SAVE_PICTURE = function (_, generator) {
    var direct = generator.valueToCode(this, 'direct', generator.ORDER_ATOMIC);
    var code = 'cam.snapshot(' + direct + ')\n';
    return code;
}

export const GET_PICTURE_DATA = function (_, generator) {
    var code = 'cam.snapshot()';
    return [code, generator.ORDER_ATOMIC];
}

export const SCREEN_SHOW_CAM_GRAPH_SHOOT = function (_, generator) {
    var code = 'cam.display()\n'+'time.sleep(1)\n';
    return code;
}

export const STOP_SCREEN_DISPLAY = function (_, generator) {
    var code = 'cam.display_stop()\n';
    return code;
}

export const INIT_QR_CODE_RECOGNITION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'qr_code = esp_ai.code_recognition()\n';
    return code;
}

export const START_QR_CODE_RECOGNITION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'qr_code.start()\n';
    return code;
}

export const GET_QR_CODE_RECOGNITION_DATA = function (_, generator) {
    var code = 'qr_code.read()';
    return [code, generator.ORDER_ATOMIC];
}

export const INIT_COLOR_DETECTION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var color = this.getFieldValue('color');
    var code = 'color = esp_ai.color_detection('+ color +')\n';
    return code;
}

export const START_COLOR_DETECTION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'color.start()\n';
    return code;
}

export const GET_COLOR_DETECTION_RESULT = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'color.read()';
    return [code, generator.ORDER_ATOMIC];
}

export const INIT_CAT_FACE_DETECTION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'cat = esp_ai.cat_detection()\n';
    return code;
}

export const START_CAT_FACE_DETECTION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'cat.start()\n';
    return code;
}

export const GET_CAT_FACE_DETECTION_RESULT = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'cat.read()';
    return [code, generator.ORDER_ATOMIC];
}

export const INIT_PEOPLE_FACE_DETECTION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'face = esp_ai.face_detection()\n';
    return code;
}

export const START_PEOPLE_FACE_DETECTION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'face.start()\n';
    return code;
}

export const GET_PEOPLE_FACE_DETECTION_RESULT = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'face.read()';
    return [code, generator.ORDER_ATOMIC];
}

export const INIT_PEOPLE_FACE_RECOGNITION = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'face = esp_ai.face_recognition()\n';
    return code;
}

export const PEOPLE_FACE_ENROLL = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'face.enroll()';
    return [code, generator.ORDER_ATOMIC];
}

export const GET_PEOPLE_FACE_RECOGNITION_RESULT = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var code = 'face.recognize()';
    return [code, generator.ORDER_ATOMIC];
}

export const DELETE_PEOPLE_FACE_ID = function (_, generator) {
    generator.definitions_['import_esp_ai'] = 'import esp_ai';
    var id = generator.valueToCode(this, 'ID', generator.ORDER_ATOMIC);
    var code = 'face.delete('+ id +')\n';
    return code;
}