const { Resource, Event } = require('../domain');

class Factory {
    async createResource(incoming) {
        if (incoming.id === undefined) {
            incoming.id = this.idGenerator.next();
        }
        return new Resource(incoming);
    }

    async buildEvent(incoming, resourcesRepository) {
        let validation = { failed:false };
        if (incoming.id === undefined) {
            incoming.id = this.idGenerator.next();
        }
        for (let i=0; i<incoming.resources.length; i++) {
            let resource = incoming.resources[i];
            let id = resource.id;
            if (! await resourcesRepository.get(id)) {
                validation = { failed: true, message:`unknown resource with id "${id}"` };
                break;
            }
        }
        return new Promise((resolve, reject)=>{
            if (validation.failed) reject({ message:validation.message })
            else resolve(new Event(incoming));
        });
    }
};

module.exports = Factory;
