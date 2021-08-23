class EventFactoryValidatingFields {

    buildEvent(options) {
        return new Promise((resolve, reject)=> {
            if (! isValidLabel(options.label)) { reject ({ message:'Label can not be empty' }); }
            else if (! isValidDatetime(options.start)) { reject ({ message:'Invalid date. Expected format is yyyy-mm-dd' }); }
            else if (! isValidDatetime(options.end)) { reject ({ message:'Invalid date. Expected format is yyyy-mm-dd' }); }
            else resolve(new Event(options));
        })
    }
};