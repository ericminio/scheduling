const User = require('../domain/user');
const NextUuid = require('../domain/next-uuid');
const Hash = require('./hash');

class UsersRepository {
    constructor(database) {
        this.database = database;
        this.idGenerator = new NextUuid();
        this.hash = new Hash();
    }
    async saveAssumingPasswordAlreadyEncrypted(user) {
        if (! user.getId()) {
            user.setId(this.idGenerator.next());
        }
        if (! await this.exists(user.getId())) {
            await this.database.executeSync(`
                insert into users(id, username, password, privileges, key) values($1, $2, $3, $4, $5)`, [
                user.getId(), user.getUsername(), user.getPassword(),
                user.getPrivileges(), user.getKey()]);
        }
    }
    async savePasswordAssumingAlreadyEncrypted(user) {
        await this.database.executeSync('update users set password=$2 where id=$1', [
            user.getId(), user.getPassword()]);
    }
    async saveKey(user) {
        await this.database.executeSync('update users set key=$2 where id=$1', [
            user.getId(), user.getKey()]);
    }
    async save(user) {
        user.password = this.hash.encrypt(user.getPassword());
        await this.saveAssumingPasswordAlreadyEncrypted(user);
    }
    async exists(id) {
        let rows = await this.database.executeSync('select id from users where id=$1', [id]);
        return rows.length > 0;
    }

    async getUserByUsername(username) {
        let rows = await this.database.executeSync('select id, username, privileges from users where username=$1', [username]);
        if (rows.length == 0) { return undefined; }
        let record = rows[0];
        return this.userFrom(record);
    }
    async getUserByCredentials(credentials) {
        let rows = await this.database.executeSync(
            'select id, username, privileges from users where username=$1 and password=$2', 
            [credentials.username, this.hash.encrypt(credentials.password)]);
        if (rows.length == 0) { return undefined; }
        let record = rows[0];
        return this.userFrom(record);
    }

    async getUserByKey(key) {
        let rows = await this.database.executeSync('select id, username, privileges from users where key=$1', [key]);
        if (rows.length == 0) { return undefined; }
        let record = rows[0];
        return this.userFrom(record);
    }
    
    userFrom(record) {
        return new User({
            id: record.id,
            username: record.username,
            privileges: record.privileges
        });
    }
}

module.exports = UsersRepository;