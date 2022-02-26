const { expect } = require('chai');
const { code } = require('../utils/files');
const EventBus = code('../yop/web/2.event-bus.js', 'EventBus');

describe('events bus', ()=> {

    let eventBus;
    beforeEach(()=> {
        eventBus = new EventBus();
    });

    it('will update registered component', ()=> {
        let received;
        let component = {
            update: (value)=> { received = value; }
        };
        eventBus.register(component, 'this event');
        eventBus.notify('this event', 42);

        expect(received).to.equal(42);
    });

    it('will not update registered component for a different event', ()=> {
        let received;
        let component = {
            update: (value)=> { received = value; }
        };
        eventBus.register(component, 'this event');
        eventBus.notify('that event', 42);

        expect(received).to.equal(undefined);
    });

    it('will update all components registered with this event', ()=> {
        let first;
        let second;
        eventBus.register({ update: (value)=> { first = value; }}, 'event');
        eventBus.register({ update: (value)=> { second = value; }}, 'event');
        eventBus.notify('event', 42);

        expect(first).to.equal(42);
        expect(second).to.equal(42);
    });

    it('will call registered callback', ()=> {
        let received;
        let callback = (value)=> { received = value; }
        eventBus.register(callback, 'that event');
        eventBus.notify('that event', 42);

        expect(received).to.equal(42);
    });

    it('needs binding to call registered callback in context', ()=> {
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

    describe('unregister', ()=> {
        
        it('is available', ()=> {
            let spy;
            let id = eventBus.register({ update: (value)=> { spy = value; }}, 'event');
            eventBus.unregister(id);
            eventBus.notify('event', 42);
    
            expect(spy).to.equal(undefined);
        });
        it('ignores unknown id', ()=> {
            let spy;
            let id = eventBus.register({ update: (value)=> { spy = value; }}, 'event');
            eventBus.unregister(id+1);
            eventBus.notify('event', 42);
    
            expect(spy).to.equal(42);
        });
        it('is available for a bulk of ids', ()=> {
            let one = eventBus.register({ update: ()=> { }}, 'this event');
            let two = eventBus.register({ update: ()=> { }}, 'that event');
            eventBus.unregisterAll([one, two]);
    
            expect(eventBus.listeners).to.deep.equal({ });
        });
    
    });

    describe('emptyness', ()=> {

        it('is the starting point', ()=> {
            expect(eventBus.isEmpty()).to.equal(true);
        });
        it('becomes history once registration happens', ()=> {
            eventBus.register({ update: ()=> {  }}, 'this event');
            expect(eventBus.isEmpty()).to.equal(false);
        });
        it('can be effective again after unregistration', ()=> {
            let id = eventBus.register({ update: ()=> { }}, 'event');
            eventBus.unregister(id);
            expect(eventBus.isEmpty()).to.equal(true);
        });
    });
});