/*
    Select menus handler utility
    discord.js@13.6.0
 */
const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
const Logger = require('../Logger');

module.exports = async client => {
    (await pGlob(`${process.cwd()}/SelectMenus/*/*.js`)).map(async selFile => {
        const sel = require(selFile);
        if (!sel.name) return Logger.warn(`\tSelect menu no-name is not valid.\n\t\t\t\t\tFile: ${selFile}`);
        await client.selects.set(sel.name, sel);
        Logger.select(`\tSelect menu ${sel.name} loaded.`);
    });
}