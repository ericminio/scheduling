const { expect } = require('chai');
const ResourcesService = require('./resources-service');
const YopCache = require('../../backend/yop/yop-cache');

describe('Resources service', ()=> {

    describe('Write operations', ()=> {
        
        describe('save', ()=> {
            it('saves to store', async ()=>{
                let written;
                let service = new ResourcesService({}, new YopCache());
                service.store.save = async (resource)=> { written = resource; };
                await service.save('anything');
                expect(written).to.equal('anything');
            })
        });
        describe('delete', ()=> {
            it('deletes to store', async ()=>{
                let written;
                let service = new ResourcesService({}, new YopCache());
                service.store.delete = async (id)=> { written = id; };
                await service.delete(42);
                expect(written).to.equal(42);
            })
        });
    });

    describe('Getting one resource', ()=> {
        
        it('goes to store at first call', async ()=>{
            let reading;
            let service = new ResourcesService({}, new YopCache());
            service.store.get = async (id)=> { reading = id; return 15; };
            let answer = await service.get(42);
            expect(reading).to.equal(42);
            expect(answer).to.equal(15);
        });

        it('returns cache content after first call', async ()=>{
            let service = new ResourcesService({}, new YopCache());
            service.store.get = async ()=> { return 15; };
            await service.get(42);
            service.store.get = async ()=> { return 66; };
            let answer = await service.get(42);
            expect(answer).to.equal(15);
        });

        it('resets cache after save', async ()=>{
            let service = new ResourcesService({}, new YopCache());
            service.store.save = async ()=> {};
            service.store.get = async ()=> { return 15; };
            await service.get(42);
            await service.save({ id:42 });
            service.store.get = async ()=> { return 66; };
            let answer = await service.get(42);
            expect(answer).to.equal(66);
        });

        it('resets cache after delete', async ()=>{
            let service = new ResourcesService({}, new YopCache());
            service.store.delete = async ()=> {};
            service.store.get = async ()=> { return 15; };
            await service.get(42);
            await service.delete(42);
            service.store.get = async ()=> { return 66; };
            let answer = await service.get(42);
            expect(answer).to.equal(66);
        });
    });

    describe('Getting all resources', ()=> {
        
        it('goes to store at first call', async ()=>{
            let reading;
            let service = new ResourcesService({}, new YopCache());
            service.store.all = async ()=> { reading = 'I see you'; return 15; };
            let answer = await service.all();
            expect(reading).to.equal('I see you');
            expect(answer).to.equal(15);
        });

        it('returns cache content after first call', async ()=>{
            let service = new ResourcesService({}, new YopCache());
            service.store.all = async ()=> { return 15; };
            await service.all();
            service.store.all = async ()=> { return 66; };
            let answer = await service.all();
            expect(answer).to.equal(15);
        });

        it('resets cache after save', async ()=>{
            let service = new ResourcesService({}, new YopCache());
            service.store.save = async ()=> {};
            service.store.all = async ()=> { return 15; };
            await service.all();
            await service.save('any');
            service.store.all = async ()=> { return 66; };
            let answer = await service.all();
            expect(answer).to.equal(66);
        });

        it('resets cache after delete', async ()=>{
            let service = new ResourcesService({}, new YopCache());
            service.store.delete = async ()=> {};
            service.store.all = async ()=> { return 15; };
            await service.all();
            await service.delete(42);
            service.store.all = async ()=> { return 66; };
            let answer = await service.all();
            expect(answer).to.equal(66);
        });
    });

});