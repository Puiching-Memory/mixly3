const common = require('../../../webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    module: {
        rules: [
            {
                test: /\.(txt|c|cpp|h|hpp)$/,
                type: 'asset/source'
            }
        ]
    }
});