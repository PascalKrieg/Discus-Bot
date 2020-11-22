CREATE TABLE IF NOT EXISTS playback_enq.discord_users (
    id int NOT NULL,
    tag varchar(80),
    access_token varchar(255),
    refresh_token varchar(255),
    token_expiration DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS playback_enq.party_channels (
    id int NOT NULL,
    owner_id int NOT NULL,
    autodelete_date DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_channel_owner FOREIGN KEY (owner_id) REFERENCES discord_users(id)
);

CREATE TABLE IF NOT EXISTS playback_enq.code_requests (
    request_id int NOT NULL AUTO_INCREMENT,
    discord_user int NOT NULL,
    request_state varchar(255) NOT NULL,
    code varchar(255),
    PRIMARY KEY (request_id),
    FOREIGN KEY (discord_user) REFERENCES discord_users(id)
);