class EventFactoryValidatingNeighbours {
    constructor() {
        this.eventFactoryValidatingFields = new EventFactoryValidatingFields();
    }
    
    use(adapters) {
        this.eventsRepository = adapters.events;
        this.resourcesRepository = adapters.resources;
    }

    async buildEvent(options) {
        return this.eventFactoryValidatingFields.buildEvent(options)
            .then(async (event)=>{
                return await this.failIfOneResourceDoesNotExist(event)? false : event;
            })
            .then(async (event)=> {
                return await this.failIfOverbooking(event)? false : event;
            });
    }

    async failIfOneResourceDoesNotExist(event) {
        for (let i=0; i<event.getResources().length; i++) {
            let id = event.getResources()[i].id;
            if (! await this.resourcesRepository.get(id)) {
                throw { message:`unknown resource with id "${id}"` };
            }
        }
    }
    async failIfOverbooking(event) {
        let events = await this.eventsRepository.all();
        if (isAnOverbooking(event, events)) {
            throw { message:'Overbooking forbidden' };
        }
    }
};
