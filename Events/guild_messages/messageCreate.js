const prodGuild = require('../../config.json').guilds.prodGuildID;
const { updateUserXp } = require("../../Utils/Level")

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        updateUserXp(message.member.id, message).then();

        if (message.guild.id !== prodGuild) {
            return;
        }

        // if (message.member.permissions.has('MANAGE_MESSAGES')) return;
        if (message.member) {
            // if (message.member.permissions.has('MANAGE_MESSAGES'));
        }
    },
};
