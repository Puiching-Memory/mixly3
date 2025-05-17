/**
 * @typedef {import('@mixly/micropython').MicroPythonActuatorExternGenerators} MicroPythonActuatorExternGenerators
 */


/**
 * @override Override {@link MicroPythonActuatorExternGenerators.actuator_neopixel_init}
 */
export const actuator_neopixel_init = function (_, generator) {
    const v = generator.valueToCode(this, 'SUB', generator.ORDER_ATOMIC);
    const dropdown_rgbpin = generator.valueToCode(this, 'PIN', generator.ORDER_ATOMIC);
    const value_ledcount = generator.valueToCode(this, 'LEDCOUNT', generator.ORDER_ATOMIC);
    generator.definitions_['import_machine'] = 'import machine';
    generator.definitions_['import_ws2812x_NeoPixel'] = 'from ws2812x import NeoPixel';
    const code = `${v} = NeoPixel(machine.Pin(${dropdown_rgbpin}), ${value_ledcount})\n`;
    return code;
}