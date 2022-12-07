const prodGuild = require('../../config.json').guilds.prodGuildID
const { MessageEmbed } = require("discord.js");
const logChannel = require('../../config.json').channels.logsID

module.exports = {
    name: 'guildUpdate',
    once: false,
    async execute(client, oldGuild, newGuild) {
        if (newGuild.id !== prodGuild) return;

        if (oldGuild.name !== newGuild.name) {
            client.guilds.cache.get(newGuild.id).channels.cache.get(logChannel).send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#da8d2a')
                        .setTitle('Le nom du serveur a été changé')
                        .addFields(
                            { name: '📜 Ancien nom', value: `\`${oldGuild.name}\`` },
                            { name: '📃 Nouveau nom', value: `\`${newGuild.name}\`` }
                        )
                        .setTimestamp()
                        .setThumbnail(newGuild.iconURL({ dynamic: true }))
                        .setFooter({
                            text: `ID du serveur: ${newGuild.id}`,
                            iconURL: newGuild.iconURL({ dynamic: true })
                        })
                ]
            })
        }

        if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
            client.guilds.cache.get(newGuild.id).channels.cache.get(logChannel).send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#da8d2a')
                        .setTitle('Le salon AFK a été changé')
                        .addFields(
                            {
                                name: '📜 Ancien salon',
                                value: `<#${oldGuild.afkChannelId}> (\`${oldGuild.afkChannelId}\`)`,
                            },
                            {
                                name: '📃 Nouveau salon',
                                value: `<#${newGuild.afkChannelId}> (\`${newGuild.afkChannelId}\`)`,
                            }
                        )
                        .setTimestamp()
                        .setThumbnail(newGuild.iconURL({ dynamic: true }))
                        .setFooter({
                            text: `ID du serveur: ${newGuild.id}`,
                            iconURL: newGuild.iconURL({ dynamic: true })
                        })
                ]
            })
        }
        if (oldGuild.icon !== newGuild.icon) {
            client.guilds.cache.get(newGuild.id).channels.cache.get(logChannel).send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#da8d2a')
                        .setTitle('L\'icône du serveur a été changée')
                        .setDescription(`Nouvel icon à droite\nAncien icon ci-dessous`)
                        .setImage(oldGuild.iconURL({ dynamic: true }))
                        .setTimestamp()
                        .setThumbnail(newGuild.iconURL({ dynamic: true }))
                        .setFooter({
                            text: `ID du serveur: ${newGuild.id}`,
                            iconURL: newGuild.iconURL({ dynamic: true })
                        })
                ]
            })
        }
        if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
            client.guilds.cache.get(newGuild.id).channels.cache.get(logChannel).send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#da8d2a')
                        .setTitle('Le salon système a été changé')
                        .addFields(
                            {
                                name: '📜 Ancien salon système',
                                value: `<#${oldGuild.systemChannelId}> (\`${oldGuild.systemChannelId}\`)`,
                                inline: true
                            },
                            {
                                name: '📃 Nouveau salon système',
                                value: `<#${newGuild.systemChannelId}> (\`${newGuild.systemChannelId}\`)`,
                                inline: true
                            }
                        )
                        .setTimestamp()
                        .setThumbnail(newGuild.iconURL({ dynamic: true }))
                        .setFooter({
                            text: `ID du serveur: ${newGuild.id}`,
                            iconURL: newGuild.iconURL({ dynamic: true })
                        })
                ]
            })
        }
    }
}
