const { expect } = require('chai');
const { Database, drop, migrate, UsersRepository } = require('.');
const { User } = require('../domain');
const Hash = require('./hash');

describe('Users storage', ()=> {
    
    let database;
    let repository;
    beforeEach(async ()=>{
        database = new Database();
        repository = new UsersRepository(database);
        await drop(database);
        await migrate(database);
    });

    it('is ready', async ()=>{
        var rows = await database.executeSync('select id from users')

        expect(rows.length).to.equal(0);
    });

    it('can save', async ()=> {
        let user = new User({ 
            username:'this-username', password:'this-password',
            privileges:'read, write', key:'this-key' });
        await repository.save(user);
        var rows = await database.executeSync('select id from users')

        expect(rows.length).to.equal(1);
    });

    it('updates key when saving the key', async ()=> {
        let user = new User({ 
            username:'this-username', password:'this-password',
            privileges:'read, write' });
        await repository.save(user);
        user.setKey('this-other-key');
        await repository.saveKey(user);
        var rows = await database.executeSync('select key from users')

        expect(rows.length).to.equal(1);
        expect(rows[0].key).to.equal('this-other-key');
    });

    it('can fetch by key', async ()=> {
        let user = new User({ 
            id:'this-id',
            username:'this-username', password:'this-password',
            privileges:'read, write', key:'this-key' });
        await repository.save(user);
        let fetched = await repository.getUserByKey('this-key');

        expect(fetched).to.deep.equal(new User({ 
            id:'this-id', key:'this-key', username:'this-username', privileges:'read, write' }));
    });

    it('returns undefined when key is unknown', async ()=> {
        let user = new User({ 
            username:'this-username', password:'this-password',
            privileges:'read, write', key:'this-key' });
        await repository.save(user);
        let fetched = await repository.getUserByKey('unknown');

        expect(fetched).to.equal(undefined);
    });

    it('can fetch by credentials', async ()=> {
        let user = new User({ 
            id:'this-id',
            username:'this-username', password:'this-password',
            privileges:'read, write', key:'this-key' });
        await repository.save(user);
        let fetched = await repository.getUserByCredentials({ 
            username:'this-username', password:'this-password' });

        expect(fetched).to.deep.equal(new User({ id:'this-id', username:'this-username' }));
    });

    it('returns undefined when credentials dont match', async ()=> {
        let user = new User({ 
            username:'this-username', password:'this-password',
            privileges:'read, write', key:'this-key' });
        await repository.save(user);
        let fetched = await repository.getUserByCredentials({ 
            username:'this-username', password:'guess' });

        expect(fetched).to.equal(undefined);
    });

    it('can take an already encrypted password', async ()=> {
        let user = new User({ 
            id:'this-id',
            username:'this-username', password:new Hash().encrypt('this-password'),
            privileges:'read, write' });
        await repository.saveAssumingPasswordAlreadyEncrypted(user);
        let fetched = await repository.getUserByCredentials({ 
            username:'this-username', password:'this-password' });

        expect(fetched).to.deep.equal(new User({ id:'this-id', username:'this-username' }));
    });
});