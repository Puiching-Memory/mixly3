import * as Blockly from 'blockly/core';
import { Profile } from 'mixly';

import {
    ArduinoEthernetBlocks,
    ArduinoProceduresBlocks,
    ArduinoTextBlocks,
    ArduinoVariablesBlocks,
    ArduinoEthernetGenerators,
    ArduinoProceduresGenerators,
    ArduinoTextGenerators,
    ArduinoVariablesGenerators,
    Procedures,
    Variables,
    Arduino
} from '@mixly/arduino';

import {
    ArduinoAVRActuatorBlocks,
    ArduinoAVRBlynkBlocks,
    ArduinoAVRCommunicateBlocks,
    ArduinoAVRControlBlocks,
    ArduinoAVRDisplayBlocks,
    ArduinoAVREthernetBlocks,
    ArduinoAVRFactoryBlocks,
    ArduinoAVRInoutBlocks,
    ArduinoAVRListsBlocks,
    ArduinoAVRLogicBlocks,
    ArduinoAVRMathBlocks,
    ArduinoAVRPinsBlocks,
    ArduinoAVRSensorBlocks,
    ArduinoAVRSerialBlocks,
    ArduinoAVRStorageBlocks,
    ArduinoAVRTextBlocks,
    ArduinoAVRToolsBlocks,
    ArduinoAVRActuatorGenerators,
    ArduinoAVRBlynkGenerators,
    ArduinoAVRCommunicateGenerators,
    ArduinoAVRControlGenerators,
    ArduinoAVRDisplayGenerators,
    ArduinoAVREthernetGenerators,
    ArduinoAVRFactoryGenerators,
    ArduinoAVRInoutGenerators,
    ArduinoAVRListsGenerators,
    ArduinoAVRLogicGenerators,
    ArduinoAVRMathGenerators,
    ArduinoAVRPinsGenerators,
    ArduinoAVRSensorGenerators,
    ArduinoAVRSerialGenerators,
    ArduinoAVRStorageGenerators,
    ArduinoAVRTextGenerators,
    ArduinoAVRToolsGenerators
} from '@mixly/arduino-avr';

import {
    ArduinoESP8266Pins,
    ArduinoESP8266EthernetBlocks,
    ArduinoESP8266PinoutBlocks,
    ArduinoESP8266EthernetGenerators,
    ArduinoESP8266PinoutGenerators,
    ArduinoESP8266SensorGenerators,
    ArduinoESP8266ZhHans,
    ArduinoESP8266ZhHant,
    ArduinoESP8266En
} from './';

import addBoardFSItem from './mixly-modules/loader';

import './css/color.css';

Blockly.Arduino = Arduino;
Blockly.generator = Arduino;

Object.assign(Blockly.Variables, Variables);
Object.assign(Blockly.Procedures, Procedures);

Profile.default = {};
Object.assign(Profile, ArduinoESP8266Pins);
Object.assign(Profile.default, ArduinoESP8266Pins.arduino_esp8266);

Object.assign(Blockly.Lang.ZhHans, ArduinoESP8266ZhHans);
Object.assign(Blockly.Lang.ZhHant,  ArduinoESP8266ZhHant);
Object.assign(Blockly.Lang.En,  ArduinoESP8266En);

addBoardFSItem();

Object.assign(
    Blockly.Blocks,
    ArduinoEthernetBlocks,
    ArduinoProceduresBlocks,
    ArduinoTextBlocks,
    ArduinoVariablesBlocks,
    ArduinoAVRActuatorBlocks,
    ArduinoAVRBlynkBlocks,
    ArduinoAVRCommunicateBlocks,
    ArduinoAVRControlBlocks,
    ArduinoAVRDisplayBlocks,
    ArduinoAVREthernetBlocks,
    ArduinoAVRFactoryBlocks,
    ArduinoAVRInoutBlocks,
    ArduinoAVRListsBlocks,
    ArduinoAVRLogicBlocks,
    ArduinoAVRMathBlocks,
    ArduinoAVRPinsBlocks,
    ArduinoAVRSensorBlocks,
    ArduinoAVRSerialBlocks,
    ArduinoAVRStorageBlocks,
    ArduinoAVRTextBlocks,
    ArduinoAVRToolsBlocks,
    ArduinoESP8266EthernetBlocks,
    ArduinoESP8266PinoutBlocks
);

Object.assign(
    Blockly.Arduino.forBlock,
    ArduinoEthernetGenerators,
    ArduinoProceduresGenerators,
    ArduinoTextGenerators,
    ArduinoVariablesGenerators,
    ArduinoAVRActuatorGenerators,
    ArduinoAVRBlynkGenerators,
    ArduinoAVRCommunicateGenerators,
    ArduinoAVRControlGenerators,
    ArduinoAVRDisplayGenerators,
    ArduinoAVREthernetGenerators,
    ArduinoAVRFactoryGenerators,
    ArduinoAVRInoutGenerators,
    ArduinoAVRListsGenerators,
    ArduinoAVRLogicGenerators,
    ArduinoAVRMathGenerators,
    ArduinoAVRPinsGenerators,
    ArduinoAVRSensorGenerators,
    ArduinoAVRSerialGenerators,
    ArduinoAVRStorageGenerators,
    ArduinoAVRTextGenerators,
    ArduinoAVRToolsGenerators,
    ArduinoESP8266EthernetGenerators,
    ArduinoESP8266PinoutGenerators,
    ArduinoESP8266SensorGenerators
);