const User = require('../domain/user');
const NextUuid = require('../domain/next-uuid')

class UsersRepository {
    constructor(database) {
        this.database = database;
        this.idGenerator = new NextUuid();
    }
    async save(user) {
        if (! user.getId()) {
            user.setId(this.idGenerator.next());
        }
        if (! await this.exists(user.getId())) {
            await this.database.executeSync(`
                insert into users(id, username, password, privileges, key) values($1, $2, $3, $4, $5)`, [
                user.getId(), user.getUsername(), user.getPassword(),
                user.getPrivileges(), user.getKey()]);
        }
        else {
            await this.database.executeSync('update users set key=$2 where id=$1', [
                user.getId(), user.getKey()]);
        }
    }
    async exists(id) {
        let rows = await this.database.executeSync('select id from users where id=$1', [id]);
        return rows.length > 0;
    }
    async getUserByKey(key) {
        let rows = await this.database.executeSync('select id, username, key, privileges from users where key=$1', [key]);
        if (rows.length == 0) { return undefined; }
        let record = rows[0];
        return new User({
            id: record.id,
            username: record.username,
            key: record.key,
            privileges: record.privileges
        });
    }
    async getUserByCredentials(credentials) {
        let rows = await this.database.executeSync(
            'select id, username from users where username=$1 and password=$2', 
            [credentials.username, credentials.password]);
        if (rows.length == 0) { return undefined; }
        let record = rows[0];
        return new User({
            id: record.id,
            username: record.username
        });
    }
}

module.exports = UsersRepository;