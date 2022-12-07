const {MessageEmbed} = require("discord.js");
const {create} = require("sourcebin");
const modChannel = require('../../config.json').channels.moderation;
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(client, message) {
        if (message.guild.id !== prodGuild) {
            return;
        }

        if (message.channel.id === modChannel) {
            return;
        }

        let bin;
        let msgContent;
        if (!message.content) {
            msgContent= '<empty>'
        } else if (message.content.length > 1024) {
            msgContent = message.content.substring(0, 1020) + '...';

            bin = await create(
                [
                    {
                        content: message.content,
                        language: 'text',
                    }
                ],
                {
                    title: `[DELETE] Message supprimé`,
                    description: `Message de ${message.author.tag} (${message.author.id})`,
                }
            ).catch(() => {
                return message.reply({content: '**❌ | Une erreur est survenue durant la sauvegarde du ticket.**', ephemeral: true});
            })
        } else if (message.content.length === 0) {
            msgContent = '<empty>';
        } else {
            msgContent = message.content;
        }

        let embed = new MessageEmbed()
            .setColor('#e13d3d')
            .setTitle('Un message a été supprimé')
            .setTimestamp()

        if (message.author) {
            embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            embed.addFields(
                {name: '👤 Auteur', value: `<@${message.author.id}> (\`${message.author.id}\`)`, inline: true},
                {name: '📃 Message', value: msgContent},
                {name: '🗓️ Envoyé le', value: `<t:${parseInt(message.createdAt/1000)}:f>`, inline: true},
                {name: '📍 Salon', value: `<#${message.channel.id}>`, inline: true},
            )
            embed.setFooter({
                text: `ID du message : ${message.id}`,
                iconURL: message.author.displayAvatarURL({dynamic: true})
            })

            if (bin) {
                embed.addField('📄 Message', `[Voir le message au complet](${bin.url})`)
            }

            if (message.attachments.size === 1) {
                embed.addField('📎 Pièce jointe', `[${message.attachments.first().name}](${message.attachments.first().url})`);
                embed.setImage(message.attachments.first().url);
            } else if (message.attachments.size > 1) {
                embed.addField('📎 Pièces jointes', `${message.attachments.map(attachment => `[${attachment.name}](${attachment.url})`).join('\n')}`);
            }
        } else {
            embed.setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            embed.setDescription('ℹ️ | Un message a été supprimé, mais il est impossible de récupérer toutes les informations.');
            embed.addFields(
                {name: '🗓️ Envoyé le', value: `<t:${parseInt(message.createdAt/1000)}:f>`, inline: true},
                {name: '📍 Salon', value: `<#${message.channel.id}>`, inline: true},
            )
            embed.setFooter({
                text: `ID du message : ${message.id}`,
                iconURL: client.user.displayAvatarURL({dynamic: true})
            })
        }

        client.guilds.cache.get(message.guild.id).channels.cache.get(modChannel).send({embeds: [embed]})

    },
};