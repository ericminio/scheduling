class EventBus {
    constructor() {
        this.listeners = {}
        this.registrationListeners = {}
    }
    notify(key, value) {
        let listeners = this.listeners[key]
        if (listeners !== undefined) {
            for (var i=0; i<listeners.length; i++) {
                var listener = listeners[i];
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
        this.safePush(listener, key, this.listeners);
        
        let registrationListeners = this.registrationListeners[key];
        if (registrationListeners !== undefined) {
            for (var i=0; i<registrationListeners.length; i++) {
                registrationListeners[i]();
            }
        }
    }
    registerForNewListener(listener, key) {
        this.safePush(listener, key, this.registrationListeners);
    }
    safePush(listener, key, map) {
        if (map[key] === undefined) {
            map[key] = [];
        }
        map[key].push(listener);
    }
}
var eventBus = new EventBus();
