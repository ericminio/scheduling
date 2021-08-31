const { expect } = require('chai');
const YopCache = require('./yop-cache');

describe.only('yop cache', ()=> {

    let cache;
    beforeEach(()=> {
        cache = new YopCache();
    });

    it('starts empty', ()=> {
        expect(cache.get('this-key')).to.equal(undefined);
    });

    it('keeps stored value', ()=> {
        cache.put('this-key', 'this-value');
        expect(cache.get('this-key')).to.equal('this-value');
    });

    it('overwrites existing key with new value', ()=> {
        cache.put('this-key', 'old-value');
        cache.put('this-key', 'new-value');
        expect(cache.get('this-key')).to.equal('new-value');
    });

    it('can erase a key-value pair', ()=> {
        cache.put('this-key', 'this-value');
        cache.delete('this-key')
        expect(cache.get('this-key')).to.equal(undefined);
    });
});