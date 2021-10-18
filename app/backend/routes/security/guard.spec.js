const { expect } = require('chai');
const Guard = require('./guard')
const RepositoryUsingMap = require('../../support/repository-using-map');
const { Server } = require('../../../../yop/node/server');
const { User } = require('../../../domain');

describe('Guard', ()=>{

    let guard;
    let server;
    let users;
    beforeEach(()=>{
        guard = new Guard();
        server = new Server(8001);
        users = new RepositoryUsingMap();
        server.services = {};
        server.services['users'] = users;
    });

    it('allows any sign-in request', async ()=>{
        let request = {
            method: 'POST',
            url: '/sign-in'
        };
        let authorized = await guard.isAuthorized(request);
        expect(authorized).to.equal(true);
    });

    it('fetches user by key', async ()=>{
        let spy;
        users.getUserByKey = async (key)=> { spy = key; return undefined; }
        let request = {
            method: 'GET',
            url: '/data/any',
            headers: {
                'x-user-key': 'value'
            }
        };
        await guard.isAuthorized(request, server);

        expect(spy).to.equal('value');
    });

    it('resists missing header', async ()=>{
        let spy;
        users.getUserByKey = async (key)=> { spy = key; return undefined; }
        let request = {
            method: 'GET',
            url: '/data/any'
        };
        let authorized = await guard.isAuthorized(request, server);

        expect(authorized).to.equal(false);
    });

    it('blocks unknown key', async ()=>{
        users.getUserByKey = async ()=> { return undefined; }
        let request = {
            method: 'GET',
            url: '/data/any',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(false);
    });

    it('blocks read-only user trying to create data', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'read' }); }
        let request = {
            method: 'POST',
            url: '/data/any',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(false);
    });

    it('allows read-only user trying to read data', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'read' }); }
        let request = {
            method: 'GET',
            url: '/data/any',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(true);
    });

    it('allows non data-related queries', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'read' }); }
        let request = {
            method: 'GET',
            url: '/anything'
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(true);
    });

    it('blocks blocked user', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'' }); }
        let request = {
            method: 'GET',
            url: '/data/any',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(false);
    });

    it('allows elevated user trying to create data', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'read write' }); }
        let request = {
            method: 'POST',
            url: '/data/any',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(true);
    });

    it('blocks semi-elevated user trying to read data', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'write' }); }
        let request = {
            method: 'GET',
            url: '/data/any',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(false);
    });

    it('additionnal privileges are ignored', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'read, write, configure' }); }
        let request = {
            method: 'POST',
            url: '/data/any',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(true);
    });

    it('allows any configuration read request', async ()=>{
        let request = {
            method: 'GET',
            url: '/data/configuration'
        };
        let authorized = await guard.isAuthorized(request);
        expect(authorized).to.equal(true);
    });

    it('blocks user without configure privilege trying to save configuration', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'read, write' }); }
        let request = {
            method: 'POST',
            url: '/data/configuration',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(false);
    });

    it('allows user with configure privilege trying to save configuration', async ()=>{
        users.getUserByKey = async ()=> { return new User({ privileges:'write configure' }); }
        let request = {
            method: 'POST',
            url: '/data/configuration',
            headers: {
                'x-user-key': 'any'
            }
        };
        let authorized = await guard.isAuthorized(request, server);
        
        expect(authorized).to.equal(true);
    });
});