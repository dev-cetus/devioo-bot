const {MessageEmbed} = require("discord.js");
const {warn} = require("../../Utils/Logger");
let category = require('../../config.json').categories.tickets;
let team = require('../../config.json').roles.team;
let logChannel = require('../../config.json').channels.logsID;

module.exports = {
    name: 'create',
    async runInteraction(client, interaction) {
        if (client.guilds.cache.get(interaction.guild.id).channels.cache.find(c => c.name === `ticket-${interaction.user.id}`)) {
            return interaction.reply({content: "**❌ | Vous avez déjà un ticket d'ouvert !**", ephemeral: true});
        }

        client.guilds.cache.get(interaction.guild.id).channels.create(`ticket-${interaction.user.id}`, {
            type: 'GUILD_TEXT',
            topic: `Ticket créé par ${interaction.user.tag}`,
            reason: 'Ticket creation',
            parent: category,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL'],
                    type: 'role'
                },
                {
                    id: interaction.user.id,
                    deny: ["MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "CREATE_INSTANT_INVITE", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS", "MENTION_EVERYONE", "MANAGE_MESSAGES", "MANAGE_THREADS", "SEND_TTS_MESSAGES"],
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "EMBED_LINKS", "ATTACH_FILES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "USE_EXTERNAL_STICKERS", "READ_MESSAGE_HISTORY", "USE_APPLICATION_COMMANDS"],
                    type: 'member'
                },
                {
                    id: team,
                    deny: ["MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "CREATE_INSTANT_INVITE", "CREATE_PRIVATE_THREADS", "MENTION_EVERYONE", "MANAGE_MESSAGES", "MANAGE_THREADS", "SEND_TTS_MESSAGES"],
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "CREATE_PUBLIC_THREADS", "EMBED_LINKS", "ATTACH_FILES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "USE_EXTERNAL_STICKERS", "READ_MESSAGE_HISTORY", "USE_APPLICATION_COMMANDS"],
                    type: 'role'
                }
            ]
        }).then(channel => {
            channel.send({embeds: [
                new MessageEmbed()
                    .setColor("#61d261")
                    .setTitle("Ticket créé !")
                    .setDescription(`Bienvenue dans votre ticket, merci d'indiquer votre problème ou votre demande.\nN'envoyez aucune informations sensible ! (Ex: token)\nPour fermer ce ticket, tapez \`/close\`.`)
                    .setTimestamp()
                    .setFooter({
                        text: `${interaction.user.tag} - ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    })
                ]})
            interaction.reply({content: `**✅ | Votre ticket a bien été créé !** <#${channel.id}>`, ephemeral: true});

            client.guilds.cache.get(interaction.guildId).channels.cache.get(logChannel).send({embeds: [
                new MessageEmbed()
                    .setColor("#61d261")
                    .setTitle("Ticket créé !")
                    .addFields(
                        {name: '📍 Salon', value: `<#${channel.id}> (\`${channel.id}\`)`},
                        {name: '👤 Auteur', value: `<@${interaction.user.id}> (\`${interaction.user.id}\`)`},
                    )
                    .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    .setFooter({
                        text: `${interaction.user.tag} - ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    })
                ]})
        }).catch(err => {
            interaction.reply({content: "**❌ | Une erreur est survenue lors de la création du ticket !**", ephemeral: true});
            warn(`\t[TICKETS] ${err}`)
        });
    }
}