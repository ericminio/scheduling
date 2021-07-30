const { expect } = require('chai');
const UsersService = require('./users-service');
const { User } = require('../../domain');

describe('User service', ()=> {

    describe('Write operations', ()=> {
        
        describe('saveAssumingPasswordAlreadyEncrypted', ()=> {
            it('saves to store', async ()=>{
                let written;
                let service = new UsersService({});
                service.store.saveAssumingPasswordAlreadyEncrypted = async (user)=> { written = user; };
                let user = new User({ username:'username', password:'password', privileges:'any' });
                await service.saveAssumingPasswordAlreadyEncrypted(user);
                expect(written).to.deep.equal(user);
            })
        });
        describe('savePasswordAssumingAlreadyEncrypted', ()=> {
            it('saves to store', async ()=>{
                let written;
                let service = new UsersService({});
                service.store.savePasswordAssumingAlreadyEncrypted = async (user)=> { written = user; };
                let user = new User({ username:'username', password:'password', privileges:'any' });
                await service.savePasswordAssumingAlreadyEncrypted(user);
                expect(written).to.deep.equal(user);
            })
        });
        describe('saveKey', ()=> {
            it('saves to store', async ()=>{
                let written;
                let service = new UsersService({});
                service.store.saveKey = async (user)=> { written = user; };
                let user = new User({ username:'username', key:'key' });
                await service.saveKey(user);
                expect(written).to.deep.equal(user);
            })
        });
        describe('save', ()=> {
            it('saves to store', async ()=>{
                let written;
                let service = new UsersService({});
                service.store.save = async (user)=> { written = user; };
                let user = new User({ username:'username', privileges:'any' });
                await service.save(user);
                expect(written).to.deep.equal(user);
            })
        });
    });

    describe('Pass-through Read operations', ()=> {
        
        describe('getUserByUsername', ()=> {
            it('reads from the store', async ()=>{
                let reading;
                let service = new UsersService({});
                service.store.getUserByUsername = async (username)=> { reading = username; return 'any'; };
                let answer = await service.getUserByUsername('please');
                expect(reading).to.equal('please');
                expect(answer).to.equal('any');
            });
        });
        describe('getUserByCredentials', ()=> {
            it('reads from the store', async ()=>{
                let reading;
                let service = new UsersService({});
                service.store.getUserByCredentials = async (username)=> { reading = username; return 'any'; };
                let answer = await service.getUserByCredentials('please');
                expect(reading).to.equal('please');
                expect(answer).to.equal('any');
            });
        });
    });

    describe('Caching', ()=> {
        it('kicks in with key access', async ()=> {
            let reading;
            let service = new UsersService({});
            service.store.getUserByKey = async (key)=> { reading = key; return 'cached'; };
            let answer = await service.getUserByKey('please');
            expect(reading).to.equal('please');
            expect(answer).to.equal('cached');

            expect(service.cacheByKey['please']).to.equal('cached');
        });
        it('is leveraged by next call', async ()=> {
            let reading;
            let service = new UsersService({});
            service.store.getUserByKey = async (key)=> { reading = key; return 'cached'; };
            await service.getUserByKey('please');
            reading = undefined;
            let answer = await service.getUserByKey('please');
            expect(reading).to.equal(undefined);
            expect(answer).to.equal('cached');
        });
        it('is reset by saving a new key', async ()=> {
            let service = new UsersService({});
            service.store.getUserByKey = async (key)=> { return 'cached'; };
            await service.getUserByKey('please');
            
            service.store.saveKey = async ()=> {};
            await service.saveKey({ key:'please' });
            expect(service.cacheByKey['please']).to.equal(undefined);
        });
    })
});