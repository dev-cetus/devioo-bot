const {MessageEmbed} = require("discord.js");
module.exports = {
    name: 'channelCreate',
    once: false,
    execute(client, channel) {
        let prodGuild = require('../../config.json').guilds.prodGuildID;
        if (channel.guildId !== prodGuild) return;

        let logChannel = require('../../config.json').channels.logsID;
        client.guilds.cache.get(channel.guildId).channels.cache.get(logChannel).send({embeds: [
            new MessageEmbed()
                .setColor('#61d261')
                .setTitle('Un salon a été créé')
                .addFields(
                    {name: '🎈 Nom du salon', value: `<#${channel.id}>`, inline: true},
                    {name: '🏷️ ID du salon', value: `\`${channel.id}\``, inline: true},
                    {name: '🌲 Type du salon', value: `\`${channel.type}\``, inline: true},
                    {name: '🗓️ Créé le', value: `<t:${parseInt(channel.createdAt/1000)}:f>`, inline: true},
                )
                .setTimestamp()
                .setThumbnail(channel.guild.iconURL({dynamic: true}))
                .setFooter({
                    text: `ID: ${channel.guild.id}`,
                    iconURL: channel.guild.iconURL({dynamic: true})
                })
            ]})
    }
}