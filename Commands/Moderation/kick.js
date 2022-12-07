const { MessageEmbed } = require('discord.js');
const { info } = require('../../Utils/Logger');
const modChannel = require('../../config.json').channels.moderation;
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'kick',
    category: 'Moderation',
    permissions: [ 'KICK_MEMBERS' ],
    description: 'Expulser un utilisateur',
    usage: 'kick [@username] <raison>',
    options: [
        {
            name: 'user',
            description: 'Utilisateur à expulser.',
            type: "USER",
            required: true
        },
        {
            name: 'reason',
            description: 'Raison de l\'expulsion.',
            type: "STRING",
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        if (!target.kickable) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('Erreur')
                    .setDescription('Impossible d\'expulser cet utilisateur.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ], ephemeral: true
        });

        await target.user.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('📤 Expulsion')
                    .addFields(
                        { name: '👮 Expulsé par', value: interaction.user.tag },
                        { name: '🗒️ Raison', value: reason || 'Aucune raison fournie.' }
                    )
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ]
        }).catch(() => {
            info(`Impossible d'envoyer un message à ${target.user.tag} (${target.user.id}).`)
        })

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#6fe153')
                    .setTitle('📤 Expulsion')
                    .addFields(
                        { name: '👤 Utilisateur', value: `<@${target.user.id}>`, inline: true },
                        { name: '👮 Modérateur', value: `<@${interaction.user.id}>`, inline: true },
                        { name: '🗒️ Raison', value: reason || 'Aucune raison fournie.' }
                    )
                    .setTimestamp()
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ]
        })

        reason ? await target.kick(reason) : await target.kick();

        if (interaction.guild.id !== prodGuild) {
            return;
        }

        client.guilds.cache.get(interaction.guild.id).channels.cache.get(modChannel).send({
            embeds: [
                new MessageEmbed()
                    .setTitle('📤 Expulsion')
                    .setColor('#4ad155')
                    .addFields(
                        { name: '👤 Utilisateur', value: `<@${target.user.id}> (\`${target.user.id}\`)`, inline: true },
                        { name: '👮 Modérateur', value: `<@${interaction.user.id}>`, inline: true },
                        { name: '🗒️ Raison', value: reason || 'Aucune raison fournie.' }
                    )
                    .setTimestamp()
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ]
        })
    }
}
