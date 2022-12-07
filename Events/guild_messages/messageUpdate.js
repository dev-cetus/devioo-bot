const {MessageEmbed} = require("discord.js");
const {warn} = require("../../Utils/Logger");
const {create} = require('sourcebin')
const modChannel = require('../../config.json').channels.moderation;
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'messageUpdate',
    once: false,
    async execute(client, oldMessage, newMessage) {
        if (newMessage.guild.id !== prodGuild) return;

        if (newMessage.author.bot) return;

        if (newMessage.partial) {
            try {
                newMessage = await newMessage.fetch();
            } catch (error) {
                warn(`\t[messageUpdate] ${error}`);
            }
        }

        if (oldMessage.content === newMessage.content) return;

        let binOld;
        let oldMsgContent;

        if (!oldMessage.author) {
            oldMsgContent = '❌ | Impossible de récupérer l\'ancien message.';
        } else if (oldMessage.content.length > 1024) {
            oldMsgContent = `${oldMessage.content.substring(0, 1020)}...`;
            binOld = await create(
                [
                    {
                        content: oldMessage.content,
                        language: 'text',
                    }
                ],
                {
                    title: `[OLD] Message modifié`,
                    description: `Message modifié par ${newMessage.author.tag} (${newMessage.author.id})`,
                }
            ).catch(() => {
                return newMessage.reply({content: '**❌ | Une erreur est survenue durant la sauvegarde du ticket.**', ephemeral: true});
            })
        } else if (oldMessage.content.length === 0) {
            oldMsgContent = '<empty>';
        } else {
            oldMsgContent = oldMessage.content;
        }

        let binNew;
        let newMsgContent;

        if (newMessage.content.length > 1024) {
            newMsgContent = `${newMessage.content.substring(0, 1020)}...`;

            binNew = await create(
                [
                    {
                        content: newMessage.content,
                        language: 'text',
                    }
                ],
                {
                    title: `[NEW] Message modifié`,
                    description: `Message modifié par ${newMessage.author.tag} (${newMessage.author.id})`,
                }
            ).catch(() => {
                return newMessage.reply({content: '**❌ | Une erreur est survenue durant la sauvegarde du ticket.**', ephemeral: true});
            })
        } else if (newMessage.content.length === 0) {
            newMsgContent = '<empty>';
        } else {
            newMsgContent = newMessage.content;
        }

        let embed = new MessageEmbed()
            .setColor('#ea800c')
            .setTitle('Un message a été modifié')
            .addFields(
                {name: '👤 Auteur', value: `<@${newMessage.author.id}> (\`${newMessage.author.id}\`)`},
                {name: '📃 Ancien message', value: oldMsgContent, inline: true},
                {name: '📃 Nouveau message', value: newMsgContent, inline: true},
                {name: '🗓️ Envoyé le', value: `<t:${parseInt(oldMessage.createdAt/1000)}:f>`},
                {name: '🗓️ Modifié le', value: `<t:${parseInt(Date.now()/1000)}:f>`},
                {name: '📍 Salon', value: `<#${newMessage.channel.id}>`},
                {name: '🔗 Lien', value: `[Sauter vers le message](${newMessage.url})`, inline: true}
            )
            .setTimestamp()
            .setThumbnail(newMessage.author.displayAvatarURL({dynamic: true}))
            .setFooter({
                text: `ID du message : ${newMessage.id}`,
                iconURL: newMessage.author.displayAvatarURL({dynamic: true})
            })

            if (binOld) {
                embed.addField('📄 Ancien message', `[Voir au complet](${binOld.url})`);
            }

            if (binNew) {
                embed.addField('📄 Nouveau message', `[Voir au complet](${binNew.url})`);
            }

            if (oldMessage.attachments.size === 1) {
                embed.addField('📎 Pièce jointe', `[${oldMessage.attachments.first().name}](${oldMessage.attachments.first().url})`);
                embed.setImage(oldMessage.attachments.first().url);
            } else if (oldMessage.attachments.size > 1) {
                embed.addField('📎 Pièces jointes', `${oldMessage.attachments.map(attachment => `[${attachment.name}](${attachment.url})`).join('\n')}`);
            }

        client.guilds.cache.get(newMessage.guild.id).channels.cache.get(modChannel).send({embeds: [embed]})

    },
};