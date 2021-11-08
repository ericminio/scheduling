const { expect } = require('chai');
const { code } = require('../utils/files');
const EventBus = code('../yop/web/2.event-bus.js', 'EventBus');

describe('events bus', ()=> {

    let eventBus;
    beforeEach(()=> {
        eventBus = new EventBus();
    });

    it('will update registered component', ()=> {
        let received;
        let component = {
            update: (value)=> { received = value; }
        };
        eventBus.register(component, 'this event');
        eventBus.notify('this event', 42);

        expect(received).to.equal(42);
    });

    it('will not update registered component for a different event', ()=> {
        let received;
        let component = {
            update: (value)=> { received = value; }
        };
        eventBus.register(component, 'this event');
        eventBus.notify('that event', 42);

        expect(received).to.equal(undefined);
    });

    it('will update all components registered with this event', ()=> {
        let first;
        let second;
        eventBus.register({ update: (value)=> { first = value; }}, 'event');
        eventBus.register({ update: (value)=> { second = value; }}, 'event');
        eventBus.notify('event', 42);

        expect(first).to.equal(42);
        expect(second).to.equal(42);
    });

    it('will call registered callback', ()=> {
        let received;
        let callback = (value)=> { received = value; }
        eventBus.register(callback, 'that event');
        eventBus.notify('that event', 42);

        expect(received).to.equal(42);
    });

    it('needs binding to call registered callback in context', ()=> {
        let received;
        class Foo {
            constructor() {
                this.value = 39;
                eventBus.register(this.listen.bind(this), 'event');
            }
            listen(value) {
                received = this.value + value;
            }
        }
        new Foo();
        eventBus.notify('event', 3);

        expect(received).to.equal(42);
    });

    it('offers registration listening', ()=> {
        let newListener = false;
        eventBus.registerForNewListener(()=> newListener = true, 'any event');
        eventBus.register(()=> {}, 'any event');

        expect(newListener).to.equal(true);
    });

    it('offers registration listening for specific event', ()=> {
        let newListener = false;
        eventBus.registerForNewListener(()=> newListener = true, 'this event');        
        eventBus.register(()=> {}, 'other event');

        expect(newListener).to.equal(false);
    });

    it('will notify all callbacks listening to registration', ()=> {
        let first = false;
        let second = false;
        eventBus.registerForNewListener(()=> first = true, 'any event');
        eventBus.registerForNewListener(()=> second = true, 'any event');
        eventBus.register(()=> {}, 'any event');

        expect(first).to.equal(true);
        expect(second).to.equal(true);
    });
});