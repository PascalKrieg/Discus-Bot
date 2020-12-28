# Discus Bot
## Introduction
This project is still in concept phase, therefore it only provides the most basic of functionality, maybe even less. Most importantly, it has not been tested for security issues, so this bot must not be used larger context than a small circle of friends.
## Prerequisites
To run this bot, you need to have docker and docker-compose installed. The bot is tested on docker version 19.03.13 and docker-compose version 1.27.4. 
## Setup
To start the bot, clone the repository and add the following files in the repository root and fill in the information:
The file format is ``key=value`` with one key-value pair per line.
### Required Files
#### bot-environment.env
Attribute       | Value
--------------- | ---------
SPOTIFY_ID      | The spotify client ID of your application 
SPOTIFY_SECRET  | The spotify secret of your application
DISCORD_TOKEN   | The discord bot token of your discord bot
REDIRECT_URI    | The redirect URI that spotify will use for the OAuth2.0 authorization. This URI must lead to the registration docker container and has to be registered in the spotify settings as redirect URI
(optional) LOGLEVEL | The level of information displayed in the console. Can either be error, warn, info (default), verbose, debug or silly.

#### mariadb-environment.env
Attribute           | Value
---------------     | ---------
MYSQL_ROOT_PASSWORD | The root password for you mariadb instance. Can be used fairly randomly, as it will not be used and the database should not be accessible from outside the network.
MYSQL_DATABASE      | The name for the database used.
MYSQL_USER          | The username of the user the bot uses to access the database defined in MYSQL_DATABASE.
MYSQL_PASSWORD      |The username of the user the bot uses to access the database defined in MYSQL_DATABASE.

### Starting the Bot
To start the bot, execute ```docker-compose up --build``` in the root directory of the repository. This should start all the containers. If nothing goes wrong, the bot will be online and taking requests.

# Plugins
## Base
Contains the core commands and functionality.

Command             | Parameters | Description
---------------     | ---------- | ------------
$ping               | *none*     | Echoes "pong"


## Spotify
Contains commands and events for creating spotify listening parties. Listening parties are text channels associated with the creators spotify account. Members of the channel can post song links which will be added to the hosts playback queue.
Command             | Parameters | Description
---------------     | ---------- | ------------
$registerMe         | *none*     | Sends a registration link to the user typing the command. If clicked on, the user tokens will be added to the database.
$createParty        | Discord mentions (@user list)      | Creates a listening party that controlls the spotify queue of the command issuer.
Songlink            | *none*     | If sent in a party channel, the song will be added to the playback queue of the channel owner. It doesn't matter, if there is other text in the message, as long as the link is clickable. This allows you to use the Spotify share option on mobile.