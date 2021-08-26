class SearchEvents {

    use(search) {
        this.search = search;
    }

    async inRange(start, end) {
        return this.search.inRange(start, end);
    }
};
