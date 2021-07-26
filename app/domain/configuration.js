class Configuration {
    constructor(options) {
        this.title = options.title;
    }

    getTitle() { return this.title; }
}

module.exports = Configuration;