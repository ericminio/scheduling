class Configuration {
    constructor(options) {
        this.title = options.title || 'Yop';
        this['opening-hours'] = options['opening-hours'] || '0-24'
    }

    getTitle() { return this.title; }
    getOpeningHours() { return this['opening-hours']; }
}

module.exports = Configuration;