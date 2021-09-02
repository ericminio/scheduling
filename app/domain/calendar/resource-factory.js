class ResourceFactory {

    buildResource(options) {
        return new Promise((resolve, reject)=> {
            if (! isNotEmpty(options.type)) { reject ({ message:'Type can not be empty' }); }
            else if (! isNotEmpty(options.name)) { reject ({ message:'Name can not be empty' }); }
            else resolve(new Resource(options));
        })
    }
};
