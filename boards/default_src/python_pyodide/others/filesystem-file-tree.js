import * as path from 'path';
import { FileTree } from 'mixly';
import FileSystemFS from './filesystem-fs';


export default class FileSystemFileTree extends FileTree {
    constructor() {
        super(new FileSystemFS());
    }

    async readFolder(inPath) {
        const fs = this.getFS();
        const [, status] = await fs.isDirectory(inPath);
        let output = [];
        if (!status) {
            return output;
        }
        const result = await fs.readDirectory(inPath);
        let children = [];
        if (result.length == 2) {
            children = result[1];
        }
        for (let data of children) {
            const dataPath = path.join(inPath, data);
            const [, isDirectory] = await fs.isDirectory(dataPath);
            if (isDirectory) {
                const [, isDirEmpty] = await fs.isDirectoryEmpty(dataPath);
                output.push({
                    type: 'folder',
                    id: dataPath,
                    children: !isDirEmpty,
                    title: `/${this.getRootFolderName()}${dataPath}`
                });
            } else {
                output.push({
                    type: 'file',
                    id: dataPath,
                    children: false,
                    title: `/${this.getRootFolderName()}${dataPath}`
                });
            }
        }
        return output;
    }
}