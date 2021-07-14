class AlwaysSameId {
    constructor(value) {
        this.value = value;
    }
    next() {
        return this.value;
    }
}

module.exports = AlwaysSameId;