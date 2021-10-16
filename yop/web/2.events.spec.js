const { expect } = require('chai');
const { code } = require('../utils/files');
const Events = code('../yop/web/2.events.js', 'Events');

describe('events', ()=> {

    let events;
    beforeEach(()=> {
        events = new Events();
    });

    it('will update registered component', ()=> {
        let received;
        let component = {
            update: (value)=> { received = value; }
        };
        events.register(component, 'event');
        events.notify('event', 42);

        expect(received).to.equal(42);
    });

    it('will call registered callback', ()=> {
        let received;
        let callback = (value)=> { received = value; }
        events.register(callback, 'event');
        events.notify('event', 42);

        expect(received).to.equal(42);
    });

    it('needs binding to call registered callback in context', ()=> {
        let received;
        class Foo {
            constructor() {
                this.value = 39;
                events.register(this.listen.bind(this), 'event');
            }
            listen(value) {
                received = this.value + value;
            }
        }
        let foo = new Foo();
        events.notify('event', 3);

        expect(received).to.equal(42);
    });
});