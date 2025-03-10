import * as Blockly from 'blockly/core';

const PINOUT_HUE = '#555555';

export const esp8266_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/NodeMCU.png'), 510, 346, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const wemos_d1_mini_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/WeMosD1Mini.png'), 510, 264, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};