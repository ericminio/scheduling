class ResourceExistsUsingPostgresql {
    constructor(database) {
        this.database = database;
    }

    async withId(id) {
        return new Promise(async (resolve, reject)=>{
            try {
                let rows = await this.database.executeSync('select id from resources where id=$1', [id]);
                if (rows.length == 0) reject(id); else resolve();
            }
            catch (error) {
                reject({ message:error.message });
            }
        });
    }
};

module.exports = ResourceExistsUsingPostgresql;