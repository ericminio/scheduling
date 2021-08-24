class EventFactoryValidatingNeighbours {
    constructor() {
        this.eventFactoryValidatingFields = new EventFactoryValidatingFields();
    }
    
    async buildEvent(options) {
        return this.eventFactoryValidatingFields.buildEvent(options)
            .then(async (event)=>{
                let validation = { failed:false };
                for (let i=0; i<options.resources.length; i++) {
                    let resource = options.resources[i];
                    let id = resource.id;
                    if (! await this.resourcesRepository.get(id)) {
                        validation = { failed: true, message:`unknown resource with id "${id}"` };
                        break;
                    }
                }
                if (! validation.failed) {
                    let events = await this.eventsRepository.all();
                    if (isAnOverbooking(event, events)) {
                        validation = { failed: true, message:'Overbooking forbidden' };
                    }
                }
                return new Promise((resolve, reject)=>{
                    if (validation.failed) reject({ message:validation.message })
                    else resolve(event);
                });
            });
    }
};
