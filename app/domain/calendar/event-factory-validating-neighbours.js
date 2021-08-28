class EventFactoryValidatingNeighbours {
    constructor(adapters) {
        this.eventFactoryValidatingFields = new EventFactoryValidatingFields();
        this.searchEvents = adapters.searchEvents;
        this.resourceExists = adapters.resourceExists;
    }
    
    async buildEvent(options) {
        return this.eventFactoryValidatingFields.buildEvent(options)
            .then((event)=>{
                return this.failIfOneResourceDoesNotExist(event);
            })
            .then((event)=> {
                return this.failIfOverbooking(event);
            });
    }

    async failIfOneResourceDoesNotExist(event) {
        let resourcePromises = []
        for (let i=0; i<event.getResources().length; i++) {
            let id = event.getResources()[i].id;
            resourcePromises.push(this.resourceExists.withId(id));
        }
        return Promise.all(resourcePromises)
                .then(()=> event)
                .catch((id)=> { throw { message:`unknown resource with id "${id}"` }; });
    }
    async failIfOverbooking(event) {
        return this.searchEvents.inRange(event.getStart(), event.getEnd())
            .then((events)=>{
                if (isAnOverbooking(event, events)) {
                    throw { message:'Overbooking forbidden' };
                }
            })
            .then(()=> event);     
    }
};
