const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'threadDelete',
    once: false,
    execute(client, thread) {
        let prodGuild = require('../../config.json').guilds.prodGuildID;

        if (thread.guildId !== prodGuild) return;

        let logChannel = require('../../config.json').channels.logsID;

        client.guilds.cache.get(thread.guildId).channels.cache.get(logChannel).send({
            embeds: [
                new MessageEmbed()
                    .setColor('#e13d3d')
                    .setTitle('Un thread a été supprimé')
                    .addFields(
                        { name: '🏷️ ID', value: `\`${thread.id}\``, inline: true },
                        { name: '👩‍👦 Parent', value: `<#${thread.parentId}>`, inline: true },
                        { name: '🗓️ Crée le', value: `<t:${parseInt(thread.createdAt / 1000)}:f>` },
                        { name: '🗓️ Supprimé le', value: `<t:${parseInt(Date.now() / 1000)}:f>`, inline: true },
                        { name: '📝 Auteur', value: `<@${thread.ownerId}> (\`${thread.ownerId}\`)`, inline: true },
                        { name: '📍 Nom', value: `\`\`\`${thread.name}\`\`\`` },
                        {
                            name: '🔗 Lien',
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
