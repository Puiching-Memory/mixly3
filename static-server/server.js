const fs = require('fs').promises
const StaticServer = require('./static-server.js');
const SSLStaticServer = require('./static-sslserver.js');

async function deleteDirectory(dirPath) {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
        console.log('Directory deleted successfully.');
    } catch (err) {
        console.error('Error deleting directory:', err);
    }
}

deleteDirectory('./nw_cache');

const init = () => {
    StaticServer.run('7000');
    SSLStaticServer.run('8000');
}

if (!module.parent) {
    init();
} else {
    module.exports = init;
}
