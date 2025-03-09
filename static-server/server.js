const fs = require('fs')
const StaticServer = require('./static-server.js');
const SSLStaticServer = require('./static-sslserver.js');


function deleteFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return;
        }
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            fs.unlinkSync(filePath);
            console.log('File deleted successfully.');
        }
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}

const init = () => {
    StaticServer.run('7000');
    SSLStaticServer.run('8000');
}

if (!module.parent) {
    deleteFile('./nw_cache/Default/Preferences');
    init();
        
} else {
    module.exports = init;
}
