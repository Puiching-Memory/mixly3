import * as Blockly from 'blockly/core';

const PINOUT_HUE = '#555555';

export const esp32_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/ESP32.png'), 525, 265, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const handbit_A = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/HandbitA.jpg'), 525, 260, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const handbit_B = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/HandbitB.jpg'), 460, 260, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const handbit_pin_A = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/HandbitPinA.jpg'), 270, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const handbit_pin_B = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/HandbitPinB.jpg'), 270, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const mixgo_pin_A = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/MixGoPinA.png'), 525, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const mixgo_pin_B = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/MixGoPinB.png'), 525, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const PocketCard_A = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/PocketCardA.jpg'), 525, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const PocketCard_B = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/PocketCardB.jpg'), 525, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const esp32_cam_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/ESP32Cam.png'), 525, 270, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const esp32_pico_kit_1_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/ESP32PicoKit.png'), 525, 230, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const nodemcu_32s_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/NodeMCU32S.png'), 380, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const esp32c3_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/ESP32C3.jpg'), 525, 365, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const core_esp32c3_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/CoreESP32C3.png'), 500, 376, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const esp32s3_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/ESP32S3.jpg'), 500, 350, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};

export const esp32s2_pin = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(require('../media/boards/ESP32S2.jpg'), 500, 350, '*'));
        this.setColour(PINOUT_HUE);
        this.setTooltip();
        this.setHelpUrl();
    }
};