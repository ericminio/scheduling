class YopCache {
    constructor() {
        this.map = {};
    }

    put(key, value) {
        this.map[key] = value;
    }
    get(key) {
        return this.map[key];
    }
    delete(key) {
        delete this.map[key];
    }
};

module.exports = YopCache;