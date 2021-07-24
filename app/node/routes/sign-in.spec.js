const { expect } = require('chai');
const { User } = require('../../domain');
const { Server } = require('../server');
const AlwaysSameId = require('../support/always-same-id');
const port = 8007;
const RepositoryUsingMap = require('../support/repository-using-map');
const { post } = require('../support/request');
const SignInRoute = require('./sign-in');

describe('Sign-In route', ()=>{
    let signInRoute;
    let server;
    let signin;
    let credentials;
    let payload;
    let users;
    let user;
    beforeEach((done)=>{
        signInRoute = new SignInRoute();
        users = new RepositoryUsingMap();
        credentials = {
            username: 'this-username',
            password: 'this-password'
        };
        payload = { encoded: window.btoa(JSON.stringify(credentials)) };
        signin = {
            hostname: 'localhost',
            port: port,
            path: '/sign-in',
            method: 'POST'
        };
        
        server = new Server(port);
        server.services = {
            'resources': new RepositoryUsingMap(),
            'events': new RepositoryUsingMap(),
            'users': users
        };
        server.routes = [signInRoute];
        server.start(async () => {
            done();
        });
        
        user = new User(credentials);
        users.getUserByCredentials = async (credentials)=> user;
        users.saveKey = async (user)=> users.save(user);
    });
    afterEach((done)=> {
        server.stop(done);
    });
    
    it('delegates decision to users service', async ()=>{
        let spy = {};
        users.getUserByCredentials = async (credentials)=> { spy=credentials; return user; }
        await post(signin, payload);
        
        expect(spy).to.deep.equal(credentials);
    });
    
    it('accepts valid credentials', async ()=>{        
        signInRoute.keyGenerator = new AlwaysSameId('15');
        let response = await post(signin, payload);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({
            username: 'this-username',
            key: '15'
        })
    });
    
    it('resists invalid credentials', async ()=>{
        users.getUserByCredentials = async ()=> { return undefined; }
        let response = await post(signin, payload);
        
        expect(response.statusCode).to.equal(401);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({
            username: 'this-username',
            message: 'invalid credentials'
        })
    });
    
    it('stores key on valid credentials', async ()=>{
        signInRoute.keyGenerator = new AlwaysSameId('15');
        await post(signin, payload);
        let stored = await users.get(user.id);
        
        expect(stored.getKey()).to.equal('15')
    });
})