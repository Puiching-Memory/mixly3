export const pins_digital = function (_, generator) {
    const code = this.getFieldValue('PIN');
    return [code, generator.ORDER_ATOMIC];
};

export const pins_button = pins_digital;
export const pins_buttonB = pins_digital;
export const pins_digital_pin = pins_digital;
export const pins_input_pin = pins_digital;
export const pins_output_pin = pins_digital;
export const pins_pwm_input = pins_digital;
export const espnow_channel = pins_digital;
export const haskylens_model = pins_digital;
export const analog_input = pins_digital;
export const pwm_output = pins_digital;
export const analog_output = pins_digital;
export const i2c_A_pin = pins_digital;
export const i2c_B_pin = pins_digital;
export const spi_A_pin = pins_digital;
export const spi_B_pin = pins_digital;
export const spi_C_pin = pins_digital;
export const spi_D_pin = pins_digital;
export const pins_analog_pin = pins_digital;
export const pins_analog = pins_digital;
export const pins_pwm_pin = pins_digital;
export const pins_pwm = pins_digital;
export const pins_dac_pin = pins_digital;
export const pins_dac = pins_digital;
export const pins_touch_pin = pins_digital;
export const pins_touch = pins_digital;
export const pins_interrupt = pins_digital;
export const pins_serial = pins_digital;
export const pins_builtinimg_extern = pins_digital;
export const pins_imglist = pins_digital;
export const pins_playlist = pins_digital;
export const pins_playlist_extern = pins_digital;
export const pins_axis = pins_digital;
export const pins_exlcdh = pins_digital;
export const pins_exlcdv = pins_digital;
export const pins_brightness = pins_digital;
export const pins_tts_voice = pins_digital;
export const pins_tts_builtin_music = pins_digital;
export const pins_tts_bgmusic = pins_digital;
export const pins_tone_notes = pins_digital;
export const pins_radio_power = pins_digital;
export const pins_radio_datarate = pins_digital;
export const pins_one_more = pins_digital;
export const pins_digital_dot = pins_digital;

export const pins_builtinimg = function (_, generator) {
    const PIN_VALUE = this.getFieldValue('PIN');
    const data = PIN_VALUE.split('.');
    if (data.length !== 2) {
        throw Error('pin value error');
    }
    generator.definitions_[`import_${data[0]}_${data[1]}`] = `from ${data[0]} import ${data[1]}`;
    return [data[1], generator.ORDER_ATOMIC];
};