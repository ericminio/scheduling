class Configuration {
    constructor(options) {
        this.title = options.title || 'Yop';
        this['opening-hours'] = options['opening-hours'] || '0-24';

        let hours = this['opening-hours'].split('-');
        this.openingHoursStart = parseInt(hours[0]);
        this.openingHoursEnd = parseInt(hours[1]);
    }

    getTitle() { return this.title; }
    getOpeningHours() { return this['opening-hours']; }

    getOpeningHoursStart() { return this.openingHoursStart; }
    getOpeningHoursEnd() { return this.openingHoursEnd; }
};
