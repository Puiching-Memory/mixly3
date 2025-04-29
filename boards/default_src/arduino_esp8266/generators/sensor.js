export const DS1307_init = function (_, generator) {
    const SDA = generator.valueToCode(this, 'SDA', generator.ORDER_ATOMIC);
    const SCL = generator.valueToCode(this, 'SCL', generator.ORDER_ATOMIC);
    const RTC_TYPE = this.getFieldValue('RTCType');
    generator.definitions_[`include_${RTC_TYPE}`] = `#include <${RTC_TYPE}.h>`;
    generator.definitions_['include_Wire'] = '#include <Wire.h>';
    generator.definitions_[`var_declare_${RTC_TYPE}`] = RTC_TYPE + '<TwoWire> Rtc(Wire);';
    generator.setups_['setup_wire_begin'] = `Wire.begin(${SDA}, ${SCL});`;
    generator.setups_['setup_rtc_begin'] = `Rtc.Begin();\n${generator.INDENT}Rtc.SetIsRunning(true);`;
    return '';
}