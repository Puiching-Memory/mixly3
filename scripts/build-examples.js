const fs_extra = require('fs-extra');
const fs_plus = require('fs-plus');
const fs = require('fs');
const path = require('path');

const getExamples = (dirPath) => {
    let examples = {};
    if (!fs_plus.isDirectorySync(dirPath)) {
        return examples;
    }
    const dataList = fs.readdirSync(dirPath);
    for (let data of dataList) {
        let dataPath = path.resolve(dirPath, data);
        if (fs_plus.isDirectorySync(dataPath)) {
            const children = getExamples(dataPath);
            if (!Object.keys(children).length) {
                continue;
            }
            examples[data] = {
                ...children,
                '__file__': false,
                '__name__': data
            };
        } else {
            const extname = path.extname(data);
            if (extname === '.mix') {
                examples[data] = {
                    '__file__': true,
                    '__name__': data
                };
            }
        }
    }
    return examples;
}


const ORIGIN_DIR = process.cwd();
const DEFAULT_SRC_DIR = path.resolve(ORIGIN_DIR, 'boards/default_src');

if (fs_plus.isDirectorySync(DEFAULT_SRC_DIR)) {
    const names = fs.readdirSync(DEFAULT_SRC_DIR);
    for (let name of names) {
        const now = path.resolve(DEFAULT_SRC_DIR, name);
        if (!fs_plus.isDirectorySync(now)) {
            continue;
        }
        const examplesPath = path.resolve(now, 'origin/examples');
        if (!fs_plus.isDirectorySync(examplesPath)) {
            continue;
        }
        let outputPath = path.resolve(examplesPath, 'map.json');
        let output = getExamples(examplesPath);
        fs_extra.outputJsonSync(outputPath, output, {
            spaces: '    '
        });
    }
}