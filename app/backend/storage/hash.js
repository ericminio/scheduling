var crypto = require('crypto');

class Hash {
    constructor() {}

    encrypt(secret) {
        let hash = crypto.createHash('sha256');
        hash.update(secret);
        return hash.digest('hex');
    }
}

module.exports = Hash
