class SearchEvents {

    use(adapters) {
        this.searchEvents = adapters.searchEvents;
    }

    async inRange(start, end) {
        return this.searchEvents.inRange(start, end);
    }
};
