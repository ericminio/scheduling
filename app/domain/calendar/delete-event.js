class DeleteEvent {

    use(adapters) {
        this.deleteEvent = adapters.deleteEvent;
    }

    please(id) {
        return this.deleteEvent.please(id);
    }
};