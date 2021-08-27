const { expect } = require('chai');
const { EventFactoryValidatingNeighboursWithDependencies, Event } = require('..');

describe('EventFactoryValidatingNeighbours', ()=> {

    let factory;
    beforeEach(()=> {
        factory = new EventFactoryValidatingNeighboursWithDependencies();
        factory.use({
            searchEvents: { inRange: async(start, end)=> new Promise((resolve, reject)=>{ resolve([]); }) },
            resourceExists: { withId: async(id)=> new Promise((resolve, reject)=>{ resolve(); }) }
        })
    });

    it('builds expected event', async ()=> {
        let event = await factory.buildEvent({ label:'any', start:'2015-09-21 08:00', end:'2015-09-21 12:00', resources:[{ id:42 }] });

        expect(event.getLabel()).to.equal('any');
    });

    it('rejects overbooking', (done)=>{
        factory.searchEvents.inRange = async(start, end)=> new Promise((resolve, reject)=>{ resolve([new Event({
            id: 'this-event',
            start: '2015-09-21 11:00',
            end: '2015-09-21 15:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'R2'}]
        })]); }) 
        factory.buildEvent({ label:'any', start:'2015-09-21 08:00', end:'2015-09-21 12:00', resources:[{id:'R2'}] })
            .then(()=>{
                done('should fail')
            })
            .catch((error)=>{
                try {
                    expect(error).to.deep.equal({ message:'Overbooking forbidden' });
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            });
    });

    it('rejects event referencing unknown resource', (done)=>{
        factory.resourceExists = { withId: async(id)=> new Promise((resolve, reject)=>{ if (id == 1) resolve(); else reject(id); }) }
        factory.buildEvent({ label:'any', start:'2015-09-21 08:00', end:'2015-09-21 12:00', resources:[{id:1}, {id:2}, {id:3}] })
            .then(()=>{
                done('should fail')
            })
            .catch((error)=>{
                try {
                    expect(error).to.deep.equal({ message:'unknown resource with id "2"' });
                    done();
                }
                catch(raised) {
                    done(raised)
                }
            });
    });

    it('rejects invalid fields, for example empty label', (done)=>{
        factory.buildEvent({ start:'2015-09-21 08:00', end:'2015-09-21 12:00', resources:[{id:'R2'}] })
            .then(()=>{
                done('should fail')
            })
            .catch((error)=>{
                try {
                    expect(error).to.deep.equal({ message:'Label can not be empty' });
                    done();
                }
                catch(raised) {
                    done(raised)
                }
            });
    });
})