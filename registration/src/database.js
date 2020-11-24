const mariadb = require('mariadb');


pool = undefined

function getPool() {
    if (pool == undefined) {
        pool = mariadb.createPool({
            host: 'database',
            user: 'admin',
            password: 'wasd',
            database: 'playback_enq',
            connectionLimit: 5
        });
    }
    return this.pool;
}

async function addCode(state, code) {
    let conn;
    try {
        pool = getPool();
        let conn = await pool.getConnection();
        let ids = await conn.query("SELECT request_id FROM code_requests WHERE request_state = ?", [state]);
        if (ids.length === 0) {
            throw new Error();
        }
        let res = await conn.query("UPDATE code_requests SET code = ? WHERE request_state = ?", [code, state]);
        return ids[0].request_id;
    } catch(err) {
        throw err
    } finally {
        if (conn) return conn.end();
    }
}


module.exports = {
    addCode
}