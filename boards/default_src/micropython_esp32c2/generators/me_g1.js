import { Boards } from 'mixly';

export const me_g1_aht11 = function (_, generator) {
    var key = this.getFieldValue('key');
    generator.definitions_['import_me_g1'] = 'import me_g1';
    var code = 'me_g1.ext_ahtx0.' + key + '()';
    return [code, generator.ORDER_ATOMIC];
}

export const me_g1_hp203 = function (_, generator) {
    var key = this.getFieldValue('key');
    generator.definitions_['import_me_g1'] = 'import me_g1';
    var code = 'me_g1.ext_hp203x.' + key;
    return [code, generator.ORDER_ATOMIC];
}

export const me_g1_varistor = function (_, generator) {
    generator.definitions_['import_me_g1'] = 'import me_g1';
    var code = 'me_g1.varistor()';
    return [code, generator.ORDER_ATOMIC];
}

export const me_g1_rfid_readid = function (_, generator) {
    generator.definitions_['import_me_g1'] = 'import me_g1';
    var code = 'me_g1.ext_rc522.read_card(0, x="id")';
    return [code, generator.ORDER_ATOMIC];
}

export const me_g1_rfid_readcontent = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    var sector = generator.valueToCode(this, 'SECTOR', generator.ORDER_ATOMIC);
    if (version == "mixgo_mini") {
        generator.definitions_['import_mini_g2_ext_rfid'] = 'from mini_g2 import ext_rfid';
        var code = 'ext_rfid.read_card(' + sector + ')';
    } else {
        generator.definitions_['import_me_g1'] = 'import me_g1';
        var code = 'me_g1.ext_rc522.read_card(' + sector + ')';
    }
    return [code, generator.ORDER_ATOMIC];
}

export const me_g1_rfid_write = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    var sector = generator.valueToCode(this, 'SECTOR', generator.ORDER_ATOMIC);
    var cnt = generator.valueToCode(this, 'CONTENT', generator.ORDER_ATOMIC);
    if (version == "mixgo_mini") {
        generator.definitions_['import_mini_g2_ext_rfid'] = 'from mini_g2 import ext_rfid';
        var code = 'ext_rfid.write_card(' + cnt + ',' + sector + ')\n';
    } else {
        generator.definitions_['import_me_g1'] = 'import me_g1';
        var code = 'me_g1.ext_rc522.write_card(' + cnt + ',' + sector + ')\n';
    }
    return code;
}

export const me_g1_rfid_write_outcome = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    var sector = generator.valueToCode(this, 'SECTOR', generator.ORDER_ATOMIC);
    var cnt = generator.valueToCode(this, 'CONTENT', generator.ORDER_ATOMIC);
    if (version == "mixgo_mini") {
        generator.definitions_['import_mini_g2_ext_rfid'] = 'from mini_g2 import ext_rfid';
        var code = 'ext_rfid.write_card(' + cnt + ',' + sector + ')';
    } else {
        generator.definitions_['import_me_g1'] = 'import me_g1';
        var code = 'me_g1.ext_rc522.write_card(' + cnt + ',' + sector + ')';
    }
    return [code, generator.ORDER_ATOMIC];
}

export const me_g1_rfid_status = function (_, generator) {
    var version = Boards.getSelectedBoardKey().split(':')[2];
    var key = this.getFieldValue('key');
    if (version == "mixgo_mini") {
        generator.definitions_['import_mini_g2_ext_rfid'] = 'from mini_g2 import ext_rfid';
        var code = 'ext_rfid.scan_card()==' + key;
    } else{
        generator.definitions_['import_me_g1'] = 'import me_g1';
        var code = 'me_g1.ext_rc522.scan_card()==' + key;
    }
    return [code, generator.ORDER_ATOMIC];
}