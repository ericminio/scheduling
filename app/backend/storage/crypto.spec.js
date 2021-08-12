var expect = require('chai').expect;
var crypto = require('crypto');
var Hash = require('./hash');

describe('crypto', function() {

	it('knows sha256 hash algo', ()=> {
		expect(crypto.createHash('sha256')).not.to.equal(undefined);
	});	
});

describe('Hash', function() {

    let hash;
    beforeEach(()=> {
        hash = new Hash();
    });

    it('can encrypt my favorite local admin password', ()=> {
        expect(hash.encrypt('admin')).to.equal('8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
    })

    it('encrypts', ()=> {
        var secret = 'my secret, can be long or short ; as you wish';
        expect(hash.encrypt(secret)).not.to.equal(secret);
    });

    it('encrypts consistently', ()=> {
        var secret = 'my secret, can be long or short ; as you wish';
        expect(hash.encrypt(secret)).to.equal(hash.encrypt(secret));
    });

    it('encrypts uniquely', ()=> {
        expect(hash.encrypt('one secret')).not.to.equal(hash.encrypt('another secret'));
    });

    it('encrypts into 64 digits', ()=> {
        expect(hash.encrypt('anything').length).to.equal(64);
    });
});