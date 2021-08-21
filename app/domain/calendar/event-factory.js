class EventFactory {

    createEvent(options) {
        return new Promise((resolve, reject)=> {
            if (! isValidLabel(options.label)) { reject ('Label can not be empty'); }
            else if (! isValidDatetime(options.start)) { reject ('Invalid date. Expected format is yyyy-mm-dd'); }
            else if (! isValidDatetime(options.end)) { reject ('Invalid date. Expected format is yyyy-mm-dd'); }
            else resolve(new Event(options));
        })
    }
}