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
    ArduinoAVRPins,
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
    ArduinoAVRPinoutBlocks,
    ArduinoAVRPinsBlocks,
    ArduinoAVRScoopBlocks,
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
    ArduinoAVRPinoutGenerators,
    ArduinoAVRPinsGenerators,
    ArduinoAVRScoopGenerators,
    ArduinoAVRSensorGenerators,
    ArduinoAVRSerialGenerators,
    ArduinoAVRStorageGenerators,
    ArduinoAVRTextGenerators,
    ArduinoAVRToolsGenerators
} from './';

import './css/color.css';

Blockly.Arduino = Arduino;
Blockly.generator = Arduino;

Object.assign(Blockly.Variables, Variables);
Object.assign(Blockly.Procedures, Procedures);

Profile.default = {};
Object.assign(Profile, ArduinoAVRPins);
Object.assign(Profile.default, ArduinoAVRPins.arduino_standard);

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
    ArduinoAVRPinoutBlocks,
    ArduinoAVRPinsBlocks,
    ArduinoAVRScoopBlocks,
    ArduinoAVRSensorBlocks,
    ArduinoAVRSerialBlocks,
    ArduinoAVRStorageBlocks,
    ArduinoAVRTextBlocks,
    ArduinoAVRToolsBlocks
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
    ArduinoAVRPinoutGenerators,
    ArduinoAVRPinsGenerators,
    ArduinoAVRScoopGenerators,
    ArduinoAVRSensorGenerators,
    ArduinoAVRSerialGenerators,
    ArduinoAVRStorageGenerators,
    ArduinoAVRTextGenerators,
    ArduinoAVRToolsGenerators
);