class CreateEvent {
    constructor() {
        this.eventFactory = new EventFactoryValidatingNeighbours();
    }

    use(adapters) {
        this.eventFactory.use(adapters)
        this.storeEvent = adapters.storeEvent;
    }

    async please(incoming) {
        return this.eventFactory.buildEvent(incoming)
                .then((event)=> {
                    return this.storeEvent.please(event);
                });
    }
};
