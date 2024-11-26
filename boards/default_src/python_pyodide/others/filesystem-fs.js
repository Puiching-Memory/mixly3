import { FS } from 'mixly';


export default class FileSystemFS extends FS {
    static {
        this.pool = window.workerpool.pool('../common/modules/mixly-modules/workers/web/file-system-access.js', {
            workerOpts: {
                name: 'pyodideFileSystemAccess'
            },
            workerType: 'web'
        });
    }

    constructor() {
        super();
    }

    async showDirectoryPicker() {
        const directoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
        if (permissionStatus !== 'granted') {
            throw new Error('readwrite access to directory not granted');
        }
        await FileSystemFS.pool.exec('addFileSystemHandler', [directoryHandle]);
        return directoryHandle;
    }

    async createFile(filePath) {
        return this.writeFile(filePath, '');
    }

    async readFile(path) {
        return FileSystemFS.pool.exec('readFile', [path, 'utf8']);
    }

    async writeFile(path, data) {
        return FileSystemFS.pool.exec('writeFile', [path, data, 'utf8']);
    }

    async isFile(path) {
        const [error, stats] = await FileSystemFS.pool.exec('stat', [path]);
        if (stats && stats.mode === 33188) {
            return [error, true];
        }
        return [error, false];
    }

    async renameFile(oldFilePath, newFilePath) {
        return await FileSystemFS.pool.exec('rename', [oldFilePath, newFilePath]);
    }

    async moveFile(oldFilePath, newFilePath) {
        return this.renameFile(oldFilePath, newFilePath);
    }

    async deleteFile(filePath) {
        return FileSystemFS.pool.exec('unlink', [filePath]);
    }

    async createDirectory(folderPath) {
        return FileSystemFS.pool.exec('mkdir', [folderPath, 0o777]);
    }

    async readDirectory(path) {
        const result = await FileSystemFS.pool.exec('readdir', [path]);
        if (result[0]) {
            return [result[0], null];
        }
        return result;
    }

    async isDirectory(path) {
        const [error, stats] = await FileSystemFS.pool.exec('stat', [path]);
        if (stats && stats.mode === 33188) {
            return [error, false];
        }
        return [error, true];
    }

    async isDirectoryEmpty(path) {
        const [error, result = []] = await this.readDirectory(path);
        return [error, !result?.length];
    }

    async renameDirectory(oldFolderPath, newFolderPath) {
        return await FileSystemFS.pool.exec('rename', [oldFolderPath, newFolderPath]);
    }

    async moveDirectory(oldFolderPath, newFolderPath) {
        return FileSystemFS.pool.exec('rename', [oldFolderPath, newFolderPath]);
    }

    async deleteDirectory(folderPath) {
        return FileSystemFS.pool.exec('rmdir', [folderPath]);
    }
}