import { User, Channel, Snowflake } from "discord.js";
import * as mariadb from "mariadb"
import { TokenPair } from "./tokenPair";
import { AuthenticatedUser } from "./authenticatedUser";
import { Repository } from "./repository";
import { injectable } from "inversify";

import * as Logging from "../../logging"
let logger = Logging.buildLogger("repository");

@injectable()
export class RepositoryImpl implements Repository {

    pool : undefined | mariadb.Pool = undefined;

    private getPool() : mariadb.Pool {
        if (this.pool == undefined) {
            this.pool = mariadb.createPool({
                host: 'database',
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                connectionLimit: 5,
                database: process.env.MYSQL_DATABASE,
                bigNumberStrings : true
            })
            return this.pool;
        } else {
            return this.pool;
        }
    }
    
    async addUser(user: User, tokenPair?: TokenPair) {
        logger.debug(`Attempting to add user ${user.tag} with id ${user.id}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            if (tokenPair) {
                await conn.query("INSERT INTO discord_users VALUES (?, ?, ?, ?, ?)", 
                    [user.id, user.tag, tokenPair.accessToken, tokenPair.refreshToken, tokenPair.expirationTime]);
            } else {
                await conn.query("INSERT INTO discord_users VALUES (?, ?, NULL, NULL, NULL)", [user.id, user.tag]);
            }
            logger.debug(`Successfully added user ${user.tag} with id ${user.id}`)
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) return conn.end();
        }
    }

    async addPartyChannel(channel: Channel, owner: User, autoDelete?: Date) {
        logger.debug(`Attempting to add party channel ${channel.id} by ${owner.tag}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();

            if (autoDelete) {
                await conn.query("INSERT INTO party_channels VALUES (?, ?, ?)", [channel.id, owner.id, autoDelete]);
            } else {
                await conn.query("INSERT INTO party_channels VALUES (?, ?, NULL)", [channel.id, owner.id]);
            }
            logger.debug(`Successfully added party channel ${channel.id} by ${owner.tag}`)
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) return conn.end();
        }
    }
    async getPartyChannelIds(): Promise<Snowflake[]> {
        logger.debug(`Getting party channel ids`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT id FROM party_channels");
            rows = rows.slice(0, rows.length - 1);
            rows = rows.map(obj => obj.id);
            return rows;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async getPartyChannelOwner(channelId: Snowflake): Promise<AuthenticatedUser> {
        logger.debug(`Getting party channel owner of channel ${channelId}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT * FROM discord_users WHERE id IN (SELECT owner_id FROM party_channels WHERE id = ?)", [channelId]);
            if (rows.length === 0) {
                throw new Error("Channel not found");
            }
            let userObj = rows[0];
            return new AuthenticatedUser(userObj.id, userObj.tag, new TokenPair(userObj.access_token, userObj.refresh_token, userObj.token_expiration));
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async getTokenPairByUserId(userId: Snowflake): Promise<AuthenticatedUser> {
        logger.debug(`Getting token pair by user id ${userId}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT * FROM discord_users WHERE id = ?", [userId]);
            if (rows.length === 0) {
                throw new Error("User not found");
            }
            let userObj = rows[0];
            return new AuthenticatedUser(userObj.id, userObj.tag, new TokenPair(userObj.access_token, userObj.refresh_token, userObj.token_expiration));
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async isUserRegistered(userId: Snowflake): Promise<boolean> {
        logger.debug(`Getting if user ${userId} is registered`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT * FROM discord_users WHERE id = ?", [userId]);
            if (rows.length === 0) {
                return false;
            }
            let userObj = rows[0];
            if (userObj.access_token != undefined && userObj.refresh_token != undefined) {
                return false;
            }
            return true;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async isChannelPartyChannel(channelId: Snowflake): Promise<boolean> {
        logger.debug(`Getting if channel ${channelId} is party channel`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT * FROM party_channels WHERE id = ?", [channelId]);
            if (rows.length === 0) {
                return false;
            }
            return true;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async updateUserToken(userId: Snowflake, tokenPair: TokenPair) {
        logger.debug(`Updating user token for user ${userId}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            await conn.query("UPDATE discord_users SET access_token = ?, refresh_token = ?, token_expiration = ? WHERE id = ?", 
                [tokenPair.accessToken, tokenPair.refreshToken, tokenPair.expirationTime, userId]);
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async replaceTokens(oldToken: TokenPair, newToken: TokenPair) {
        logger.debug(`Replacing tokens`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let result = await conn.query("UPDATE discord_users " + 
                "SET access_token = ?, refresh_token = ?, token_expiration = ? " + 
                "WHERE access_token=? AND refresh_token=?", 
                [oldToken.accessToken, oldToken.refreshToken, oldToken.expirationTime, newToken.accessToken, newToken.refreshToken]);
            if (result.affectedRows === 0) {
                // nothing changed, what to do?
            }
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async deleteChannel(channelId: Snowflake) {
        throw new Error("Method not implemented. deleteChannel");
    }
    async deleteUserToken(userId: Snowflake) {
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let result = await conn.query("UPDATE discord_users" + 
                "SET access_token = NULL, refresh_token = NULL, token_expiration = NULL WHERE id = ?", [userId]);
            if (result.affectedRows === 0) {
                // nothing changed, what to do?
            }
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async addCodeRequest(userId: Snowflake, state: string): Promise<string> {
        logger.debug(`Adding code request for user ${userId}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let result = await conn.query("INSERT INTO code_requests (discord_user, request_state) VALUES (?, ?)", [userId, state]);
            return result.insertId;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async getRequestCodeById(id: string): Promise<string> {
        logger.debug(`Getting code request with id ${id}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT code FROM code_requests WHERE request_id= ? ", [id]);
            if (rows.length === 0) {
                throw new Error("Request not found!");
            }
            return rows[0].code;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }

    async getCodeIfPresent(userId : Snowflake) : Promise<string|undefined>{
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT code FROM code_requests WHERE discord_user=? AND code IS NOT NULL", [userId]);
            if (rows.length == 0) {
                return undefined;
            }
            return rows[0].code;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }

    async getRequestCodeByState(state: string): Promise<string> {
        logger.debug(`Getting code request with state ${state}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT code FROM code_requests WHERE state=", [state]);
            if (rows.length == 0) {
                throw new Error("Request not found!");
            }
            return rows[0].code;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
    async deleteCodeRequest(id: string) {
        logger.debug(`Deleting code request with id ${id}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let result = await conn.query("DELETE FROM code_requests WHERE request_id = ", [id]);
            if (result.affectedRows === 0) {
                // nothing changed, what to do?
            }
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }

    async addUserAndCodeRequest(user : User, state : string) : Promise<string>{
        logger.debug(`Adding code request and user for user ${user.tag}`);
        let conn;
        try {
            conn = await this.getPool().getConnection();
            conn.beginTransaction();
            await conn.query("INSERT INTO discord_users VALUES (?, ?, NULL, NULL, NULL)", [user.id, user.tag]);
            let result = await conn.query("INSERT INTO code_requests (discord_user, request_state) VALUES (?, ?)", [user.id, state]);
            conn.commit();
            return result.insertId;
        } catch(err) {
            conn?.rollback()
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }

    async isUserPresent(userId : string) {
        logger.debug(`Getting if user ${userId} is known`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            let rows : any[] = await conn.query("SELECT * FROM discord_users WHERE id = ?", [userId]);
            if (rows.length === 0) {
                return false;
            }
            return true;
        } catch(err) {
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }

    async finishCodeRequest(state: string, newToken: TokenPair) {
        logger.debug(`Finishing code request with state ${state}`)
        let conn;
        try {
            conn = await this.getPool().getConnection();
            await conn.beginTransaction();
            let idResult = await conn.query("SELECT discord_user FROM code_requests WHERE request_state = ?", [state]);
            let userId = idResult[0].discord_user;
            if (userId.length == 0) {
                throw new Error("Not Found");
            }
            logger.debug(`Code request with state ${state} belongs to user with user id ${userId}`);

            let res = await conn.query("UPDATE discord_users SET access_token = ?, refresh_token = ?, token_expiration = ? WHERE id = ?", [newToken.accessToken, newToken.refreshToken, newToken.expirationTime, userId]);
            if (res.affectedRows === 0) {
                logger.error("Update of token pair affected 0 rows!");
            }

            await conn.query("DELETE FROM code_requests WHERE request_state = ?", [state]);
            logger.debug(`Successfully finished code request with state ${state} and deleted it.`)
            await conn.commit();
        } catch(err) {
            conn?.rollback();
            logger.error(err)
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
}