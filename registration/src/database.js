const mariadb = require('mariadb');

class database {

    pool = undefined;

    init() {
        pool = mariadb.createPool({
            host: 'database',
            user: 'admin',
            password: 'wasd',
            connectionLimit: 5
        });
    }

    getPool() {
        if (pool) {
            return pool
        }
        this.init()
        return this.pool;
    }

    async addCode(state, code) {
        let conn;
        try {
            conn = await this.getPool().getConnection();
            await conn.query("UPDATE code_requests SET code = ? WHERE request_state = ?", [state, code]);
        } catch(err) {
            throw err
        } finally {
            if (conn) return conn.end();
        }
    }


}

module.exports = database