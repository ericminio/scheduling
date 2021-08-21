const { expect } = require('chai');
const { isAnOverbooking, Event } = require('..');

describe('Overbooking', ()=> {

    let events = [
        new Event({ start: '2021-08-01 10:00', end: '2021-08-01 20:00', resources: [ {id:1} ]}),
        new Event({ start: '2021-08-01 22:00', end: '2021-08-01 23:00', resources: [ {id:2}, {id:3} ]})
    ];

    it('is forbidden', ()=> {
        let candidate = new Event({
            start: '2021-08-01 10:00',
            end: '2021-08-01 20:00',
            resources: [ {id:1} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(true);
    });
    it('is only for same resource', ()=> {
        let candidate = new Event({
            start: '2021-08-01 10:00',
            end: '2021-08-01 20:00',
            resources: [ {id:2} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(false);
    });
    it('only needs one resource to match', ()=> {
        let candidate = new Event({
            start: '2021-08-01 22:00',
            end: '2021-08-01 23:00',
            resources: [ {id:1}, {id:3} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(true);
    });
    it('forbids overlapping the start', ()=> {
        let candidate = new Event({
            start: '2021-08-01 08:00',
            end: '2021-08-01 11:00',
            resources: [ {id:1} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(true);
    });
    it('forbids overlapping the end', ()=> {
        let candidate = new Event({
            start: '2021-08-01 19:00',
            end: '2021-08-01 21:00',
            resources: [ {id:1} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(true);
    });
    it('forbids smaller event inside', ()=> {
        let candidate = new Event({
            start: '2021-08-01 12:00',
            end: '2021-08-01 15:00',
            resources: [ {id:1} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(true);
    });
    it('forbids bigger event around', ()=> {
        let candidate = new Event({
            start: '2021-08-01 08:00',
            end: '2021-08-01 22:00',
            resources: [ {id:1} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(true);
    });
    it('allows touching start', ()=> {
        let candidate = new Event({
            start: '2021-08-01 08:00',
            end: '2021-08-01 10:00',
            resources: [ {id:1} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(false);
    });
    it('allows touching end', ()=> {
        let candidate = new Event({
            start: '2021-08-01 20:00',
            end: '2021-08-01 22:00',
            resources: [ {id:1} ]
        });
        expect(isAnOverbooking(candidate, events)).to.equal(false);
    });
});