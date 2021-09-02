class EventFactoryValidatingFields {

    buildEvent(options) {
        return new Promise((resolve, reject)=> {
            if (! isNotEmpty(options.label)) { reject ({ message:'Label can not be empty' }); }
            else if (! isValidDatetime(options.start)) { reject ({ message:'Invalid date. Expected format is yyyy-mm-dd' }); }
            else if (! isValidDatetime(options.end)) { reject ({ message:'Invalid date. Expected format is yyyy-mm-dd' }); }
            else if (! this.isValidResources(options.resources)) { reject ({ message:'Select at least one resource' }); }
            else resolve(new Event(options));
        })
    }

    isValidResources(resources) {
        if (!resources) return false;
        if (resources.length == 0) return false;

        return true;
    }
};