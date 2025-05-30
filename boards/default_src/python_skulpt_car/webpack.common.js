const path = require('path');
const common = require('../../../webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    resolve: {
        alias: {
            '@mixly/python': path.resolve(__dirname, '../python'),
            '@mixly/python-skulpt': path.resolve(__dirname, '../python_skulpt')
        }
    },
    externals: {
        'sk': 'Sk'
    },
    module: {
        rules: [
            {
                test: /\.py$/,
                type: 'asset/source',
            }, {
                test: /\.js$/,
                resourceQuery: /url/,
                type: 'asset/resource',
                generator: {
                    filename: "[name]_[contenthash:8][ext]",
                }
            }
        ]
    }
});