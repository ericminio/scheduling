const crypto = require('crypto');

class NextUuid {

    next() {
        return crypto.randomBytes(16).toString('hex');
    }
}

module.exports = NextUuid;