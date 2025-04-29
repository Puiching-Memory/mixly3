const path = require('path');
const common = require('../../../webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    resolve: {
        alias: {
            '@mixly/arduino': path.resolve(__dirname, '../arduino'),
            '@mixly/arduino-avr': path.resolve(__dirname, '../arduino_avr'),
            '@mixly/arduino-esp8266': path.resolve(__dirname, '../arduino_esp8266')
        }
    },
    module: {
        rules: [
            {
                test: /\.(txt|c|cpp|h|hpp)$/,
                type: 'asset/source'
            }
        ]
    }
});