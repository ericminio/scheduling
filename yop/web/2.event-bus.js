class EventBus {
    constructor() {
        this.listeners = {}
        this.registrationListeners = {}
        this.id = 0;
    }
    isEmpty() {
        return Object.keys(this.listeners).length == 0
                && Object.keys(this.registrationListeners).length == 0;
    }
    notify(key, value) {
        let listeners = this.listeners[key]
        if (listeners !== undefined) {
            for (var i=0; i<listeners.length; i++) {
                var listener = listeners[i].listener;
                if (typeof listener == 'object') {
                    listener.update(value, key);
                }
                if (typeof listener == 'function') {
                    listener(value, key);
                }
            }
        }
    }
    register(listener, key) {
        let id = this.save(listener, key, this.listeners);
        
        let registrationListeners = this.registrationListeners[key];
        if (registrationListeners !== undefined) {
            for (var i=0; i<registrationListeners.length; i++) {
                registrationListeners[i].listener();
            }
        }
        return id;
    }
    registerForNewListener(listener, key) {
        return this.save(listener, key, this.registrationListeners);
    }
    unregister(id) {
        this.remove(id, this.listeners);
    }
    unregisterAll(ids) {
        for (var i=0; i<ids.length; i++) {
            let id = ids[i];
            this.unregister(id);
        }
    }
    unregisterForNewListener(id) {
        this.remove(id, this.registrationListeners);
    }
    save(listener, key, map) {
        if (map[key] === undefined) {
            map[key] = [];
        }
        this.id = this.id + 1;
        map[key].push({ id:this.id, listener:listener });
        return this.id;
    }
    remove(id, map) {
        let keys = Object.keys(map);
        for (let i=0; i<keys.length; i++) {
            let key = keys[i];
            for (let j=0; j<map[key].length; j++) {
                let entry = map[key][j];
                if (entry.id == id) {                    
                    map[key].splice(j, 1);
                }
            }
            if (map[key] == 0) {
                delete map[key];
            }
        }
    }
}
var eventBus = new EventBus();
