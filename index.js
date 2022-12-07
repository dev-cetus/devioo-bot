/*
    Create a bot with discord.js@13.0.0
    Author: github.com/dev-cetus
    For : DEVIOO server
 */
const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 66055, partials: ['MESSAGE', 'CHANNEL'] });
const Logger = require('./Utils/Logger');
const config = require('./config.json');
const mongoose = require('mongoose');

['commands', 'buttons', 'selects', 'badwords'].forEach(x => client[x] = new Collection());
['CommandUtil', 'EventUtil', 'ButtonUtil', 'SelectUtil', 'BadwordsUtil'].forEach(handler => { require(`./Utils/Handlers/${handler}`)(client) });

process.on('exit', code => { Logger.client(`Exiting with code ${code}`) });
process.on('uncaughtException', async (err, origin) => {
    Logger.error(`\tUNCAUGHT_EXCEPTION: ${err}`)
    await console.log(origin)
});
process.on('unhandledRejection', async (reason, promise) => {
    Logger.warn(`\tUNHANDLED_REJECTION: ${reason}`)
    await console.log(promise)
});
process.on('warning', (...args) => { Logger.warn(...args) });

// Connect to MongoDB
mongoose.connect(config.database.uri, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}).then(() => {
    Logger.client(`\tConnected to MongoDB`)
}).catch(e => {
    Logger.error(`Failed to connect to MongoDB: ${e}`)
    process.exit(1)
});

// Log bot to Discord
client.login(config.token).then(() => {
    Logger.client(`\tLogged in as ${client.user.tag}`);
}).catch(e => {
    console.error(`\tFailed to login: ${e}`);
});

module.exports = client;
