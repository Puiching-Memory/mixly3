import * as Blockly from 'blockly/core';

const PINOUT_HUE = '#555555';

export const uno_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/Uno.png'), 515, 372, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const nano_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/Nano.png'), 515, 368, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const mega_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/Mega.png'), 515, 736, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const promini_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/ProMini.png'), 515, 371, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const leonardo_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/Leonardo.png'), 515, 371, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};