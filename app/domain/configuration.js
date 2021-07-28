class Configuration {
    constructor(options) {
        this.title = options.title || 'Yop';
    }

    getTitle() { return this.title; }
}

module.exports = Configuration;