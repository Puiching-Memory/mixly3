const fs = require('fs')
const StaticServer = require('./static-server.js');
const SSLStaticServer = require('./static-sslserver.js');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function deleteDirectory(dirPath) {
    try {
        fs.unlinkSync(dirPath);
        console.log('Directory deleted successfully.');
    } catch (err) {
        console.error('Error deleting directory:', err);
    }
}



const init = () => {
    StaticServer.run('7000');
    SSLStaticServer.run('8000');
}

if (!module.parent) {
    deleteDirectory('./nw_cache/Default/Preferences');
	sleep(200);
	init();
		
} else {
    module.exports = init;
}
