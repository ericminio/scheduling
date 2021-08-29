class DeleteEvent {

    use(adapters) {
        this.deleteEvent = adapters.deleteEvent;
    }

    please(event) {
        return this.deleteEvent.please(event);
    }
};