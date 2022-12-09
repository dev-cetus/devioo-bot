const prodGuild = require('../../config.json').guilds.prodGuildID;
const { updateUserXp } = require("../../Utils/Level")

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if (message.guild.id !== prodGuild) {
            return;
        }

        if (message.author.bot) {
            return;
        }

        updateUserXp(message.member.id, message).then();
    },
};
