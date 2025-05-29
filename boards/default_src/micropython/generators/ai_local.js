import { Boards } from 'mixly';

//voice part
export const VOICE_RECOGNITION_CONTROL = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    generator.definitions_['import_' + version + '_onboard_bot'] = 'from ' + version + ' import onboard_bot';
    var control = this.getFieldValue('control');
    var code = 'onboard_bot.asr_en('+ control +')\n';
    return code;
}

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





//graph part
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
    var con = this.getFieldValue('control');
    var code = 'cam.'+ con +'()\n';
    return code;
}

export const AI_CAMERA_INIT = function (_, generator) {
    generator.definitions_['import_ai_camera'] = 'import ai_camera';
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var cmd = this.getFieldValue('kind');
    var code = sub +' = ai_camera.AI(ai_camera.' + cmd + ')\n';
    return code;
}

export const GET_QR_CODE_RECOGNITION_DATA = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var code = sub + '.code_recognition()';
    return [code, generator.ORDER_ATOMIC];
}

export const GET_COLOR_DETECTION_NUM = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var color = this.getFieldValue('color');
    var code = sub + '.color_detection('+ color +",'len')";
    return [code, generator.ORDER_ATOMIC];
}

export const GET_COLOR_DETECTION_LOCATION = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var num = generator.valueToCode(this, 'NO', generator.ORDER_ATOMIC);
    var color = this.getFieldValue('color');
    var code = sub + '.color_detection('+ color +",'pos',"+ num +')';
    return [code, generator.ORDER_ATOMIC];
}

export const GET_CAT_FACE_DETECTION_NUM = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var code = sub + ".cat_detection('len')";
    return [code, generator.ORDER_ATOMIC];
}

export const GET_CAT_FACE_DETECTION_LOCATION = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var num = generator.valueToCode(this, 'NO', generator.ORDER_ATOMIC);
    var code = sub + ".cat_detection('pos',"+ num +')';
    return [code, generator.ORDER_ATOMIC];
}

export const GET_FACE_DETECTION_NUM = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var code = sub + ".face_detection('len')";
    return [code, generator.ORDER_ATOMIC];
}

export const GET_FACE_DETECTION_LOCATION = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var num = generator.valueToCode(this, 'NO', generator.ORDER_ATOMIC);
    var code = sub + ".face_detection('pos',"+ num +')';
    return [code, generator.ORDER_ATOMIC];
}

export const GET_FACE_DETECTION_KEYPOINT_LOCATION = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var num = generator.valueToCode(this, 'NO', generator.ORDER_ATOMIC);
    var kp = this.getFieldValue('kp');
    var code = sub + ".face_detection('keypoint',"+ num +','+ kp +')';
    return [code, generator.ORDER_ATOMIC];
}

export const GET_FACE_RECOGNITION_ID = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var code = sub + ".face_recognition('len')";
    return [code, generator.ORDER_ATOMIC];
}

export const GET_FACE_RECOGNITION_ID_LOCATION = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var num = generator.valueToCode(this, 'NO', generator.ORDER_ATOMIC);
    var code = sub + ".face_recognition('pos',"+ num +')';
    return [code, generator.ORDER_ATOMIC];
}

export const GET_FACE_RECOGNITION_ID_KEYPOINT_LOCATION = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var num = generator.valueToCode(this, 'NO', generator.ORDER_ATOMIC);
    var kp = this.getFieldValue('kp');
    var code = sub + ".face_recognition('keypoint',"+ num +','+ kp +')';
    return [code, generator.ORDER_ATOMIC];
}

export const PEOPLE_FACE_ENROLL = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var code = sub + '.face_enroll()';
    return [code, generator.ORDER_ATOMIC];
}

export const DELETE_PEOPLE_FACE_ID = function (_, generator) {
    var sub = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    var id = generator.valueToCode(this, 'ID', generator.ORDER_ATOMIC);
    var code = sub + '.face_delete('+ id +')\n';
    return code;
}