/*
    Buttons handler utility
    discord.js@13.6.0
 */
const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
const Logger = require('../Logger');

module.exports = async client => {
    (await pGlob(`${process.cwd()}/Buttons/*/*.js`)).map(async btnFile => {
        const btn = require(btnFile);
        if (!btn.name) return Logger.warn(`\tButton no-name is not valid.\n\t\t\t\t\tFile: ${btnFile}`);
        await client.buttons.set(btn.name, btn);
        Logger.button(`\tButton ${btn.name} loaded.`);
    });
}