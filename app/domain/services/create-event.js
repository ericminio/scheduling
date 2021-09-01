class CreateEvent {
    constructor(eventFactory) {
        this.eventFactory = eventFactory;
    }

    use(adapters) {
        this.storeEvent = adapters.storeEvent;
    }

    async please(incoming) {
        return this.eventFactory.buildEvent(incoming)
                .then((event)=> {
                    return this.storeEvent.please(event);
                });
    }
};
