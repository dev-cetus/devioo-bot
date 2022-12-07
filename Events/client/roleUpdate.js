const {MessageEmbed} = require("discord.js");
const prodGuild = require('../../config.json').guilds.prodGuildID;
const logChannel= require('../../config.json').channels.logsID;

module.exports = {
    name: 'roleUpdate',
    once: false,
    async execute(client, oldRole, newRole) {
        if (newRole.guild.id !== prodGuild) return;

        if (newRole.name === '@everyone') return;

        if (newRole.name !== oldRole.name) {
            client.guilds.cache.get(newRole.guild.id).channels.cache.get(logChannel).send({ embeds: [
                new MessageEmbed()
                    .setColor('#da8d2a')
                    .setTitle('Un rôle a été modifié')
                    .addFields(
                        {name: '🎈 Ancien nom', value: oldRole.name, inline: true},
                        {name: '🎈 Nouveau nom', value: newRole.name, inline: true},
                        {name: '🏷️ ID', value: `\`${newRole.id}\``},
                        {name: '🗓️ Créé le', value: `<t:${parseInt(oldRole.createdAt/1000)}:f>`, inline: true},
                        {name: '🗓️ Modifié le', value: `<t:${parseInt(Date.now()/1000)}:f>`, inline: true},
                    )
                    .setTimestamp()
                    .setThumbnail(newRole.guild.iconURL({dynamic: true}))
                    .setFooter({
                        text: `ID du rôle : ${newRole.id}`,
                        iconURL: newRole.guild.iconURL({dynamic: true})
                    })
            ]});
        }

        if (oldRole.color !== newRole.color) {
            client.guilds.cache.get(newRole.guild.id).channels.cache.get(logChannel).send({ embeds: [
                new MessageEmbed()
                    .setColor('#da8d2a')
                    .setTitle('Un rôle a été modifié')
                    .addFields(
                        {name: '🎈 Rôle', value: `<@&${newRole.id}>`, inline: true},
                        {name: '🏷️ ID', value: `\`${newRole.id}\``},
                        {name: '🎨 Ancienne couleur', value: `#${parseInt(oldRole.color).toString(16).toUpperCase()}`, inline: true},
                        {name: '🎨 Nouvelle couleur', value: `#${parseInt(newRole.color).toString(16).toUpperCase()}`, inline: true},
                        {name: '🗓️ Créé le', value: `<t:${parseInt(oldRole.createdAt/1000)}:f>`},
                        {name: '🗓️ Modifié le', value: `<t:${parseInt(Date.now()/1000)}:f>`, inline: true},
                    )
                    .setTimestamp()
                    .setThumbnail(newRole.guild.iconURL({dynamic: true}))
                    .setFooter({
                        text: `ID du rôle : ${newRole.id}`,
                        iconURL: newRole.guild.iconURL({dynamic: true})
                    })
            ]});
        }


    }
}