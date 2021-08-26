class CreateEvent {
    constructor() {
        this.eventFactory = new EventFactoryValidatingNeighbours();
    }

    use(adapters) {
        this.eventFactory.use(adapters)
        this.eventsRepository = adapters['events'];
    }

    async please(incoming) {
        return this.eventFactory.buildEvent(incoming)
                .then(async (event)=> {
                    await this.eventsRepository.save(event);
                    return event;
                });
    }
};
