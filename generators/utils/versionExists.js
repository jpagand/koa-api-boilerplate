/**
 * versionExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const versionsDir = fs.readdirSync('src/modules');

function versionExists(version) {
    return versionsDir.indexOf(version) >= 0;
}

module.exports = versionExists;
