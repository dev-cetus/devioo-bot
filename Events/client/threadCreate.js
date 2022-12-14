const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'threadCreate',
    once: false,
    execute(client, thread) {
        let prodGuild = require('../../config.json').guilds.prodGuildID;

        if (thread.guildId !== prodGuild) return;

        let logChannel = require('../../config.json').channels.logsID;

        client.guilds.cache.get(thread.guildId).channels.cache.get(logChannel).send({
            embeds: [
                new MessageEmbed()
                    .setColor('#61d261')
                    .setTitle('Un thread a Ã©tÃ© crÃ©Ã©')
                    .addFields(
                        { name: 'ð·ï¸ ID', value: `\`${thread.id}\``, inline: true },
                        { name: 'ð©âð¦ Parent', value: `<#${thread.parentId}>`, inline: true },
                        { name: 'ð Date', value: `<t:${parseInt(thread.createdAt / 1000)}:f>` },
                        { name: 'ð Auteur', value: `<@${thread.ownerId}> (\`${thread.ownerId}\`)`, inline: true },
                        { name: 'ð Nom', value: `\`\`\`${thread.name}\`\`\`` },
                        {
                            name: 'ð Lien',
                            value: `[Lien du thread](https://discordapp.com/channels/${thread.guildId}/${thread.parentId}/${thread.id})`
                        }
                    )
                    .setTimestamp()
                    .setThumbnail(thread.guild.iconURL({ dynamic: true }))
                    .setFooter({
                        text: `ID: ${thread.id}`,
                        iconURL: client.user.displayAvatarURL({ dynamic: true })
                    })
            ]
        });
    }
}
