const { MessageEmbed } = require("discord.js");
const modChannel = require('../../config.json').channels.moderation;
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'guildBanRemove',
    once: false,
    async execute(client, ban) {
        if (ban.guild.id !== prodGuild) {
            return;
        }

        client.guilds.cache.get(ban.guild.id).channels.cache.get(modChannel).send({
            embeds: [
                new MessageEmbed()
                    .setTitle('Utilisateur débanni')
                    .setColor('#61d261')
                    .setDescription(`**${ban.user.tag}** (\`${ban.user.id}\`) a été débanni du serveur ${ban.guild.name}`)
                    .setTimestamp()
                    .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({
                        text: `ID: ${ban.user.id}`,
                        iconURL: ban.user.displayAvatarURL({ dynamic: true })
                    })
            ]
        });
    }
};
