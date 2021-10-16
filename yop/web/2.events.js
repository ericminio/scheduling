class Events {
    constructor() {
        this.listeners = {}
    }
    notify(id, value) {
        var listeners = this.listeners[id]
        if (listeners !== undefined) {
            for (var i=0; i<listeners.length; i++) {
                var listener = listeners[i];
                if (typeof listener == 'object') {
                    listener.update(value, id);
                }
                if (typeof listener == 'function') {
                    listener(value, id);
                }
            }
        }
    }
    register(listener, id) {
        var listeners = this.listeners[id]
        if (listeners === undefined) {
            this.listeners[id] = []
        }
        this.listeners[id].push(listener)
    }
}
var events = new Events();
