const { expect } = require('chai');
const UsersService = require('./users-service');
const { User } = require('../../domain');

describe('User service', ()=> {

    let service;
    let written;
    let reading;
    beforeEach(()=> {
        written = undefined;
        reading = undefined;
        service = new UsersService({
            save: async (user)=> { written = user; },
            saveKey: async (user)=> { written = user; },
            getUserByKey: async (key)=> { reading = key; }
        });
    });

    it('saves to repository', async ()=>{
        let user = new User({ username:'this-username', password:'this-password' });
        await service.save(user);
        expect(written).to.deep.equal(user);
    })
    it('saves key to repository', async ()=>{
        let user = new User({ username:'this-username', password:'this-password', key:'this-key' });
        await service.saveKey(user);
        expect(written).to.deep.equal(user);
    })
    it('caches user when saving key', async ()=>{
        await service.saveKey(new User({ id:'this-id', username:'this-username', privileges:'any', key:'this-key' }));
        let user = await service.getUserByKey('this-key');
        expect(reading).to.equal(undefined);
        expect(user).to.deep.equal(new User({ id:'this-id', username:'this-username', privileges:'any', key:'this-key' }))
    })
})