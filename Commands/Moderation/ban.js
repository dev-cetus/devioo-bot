const { MessageEmbed } = require('discord.js');
const {info} = require('../../Utils/Logger');
const modChannel = require('../../config.json').channels.moderation;

module.exports = {
    name: 'ban',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],
    description: 'Bannir un utilisateur',
    usage: 'ban [@username] <raison>',
    options: [
        {
            name: 'user',
            description: 'Utilisateur à bannir.',
            type: "USER",
            required: true
        },
        {
            name: 'reason',
            description: 'Raison du bannissement.',
            type: "STRING",
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        if (!target.bannable) return interaction.reply({embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('Erreur')
                    .setDescription('Impossible de bannir cet utilisateur.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    })
            ], ephemeral: true});

        try {
            await target.user.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#d84141')
                        .setTitle('📤 Ban')
                        .addFields(
                            { name: '👮 Banni par', value: interaction.user.tag },
                            { name: '🗒️ Raison', value: reason || 'Aucune raison fournie.' }
                        )
                        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({dynamic: true})
                        })
                ]
            })
        } catch (e) {
            info(`Impossible d'envoyer un message privé à ${target.user.tag} (${target.user.id}).`)
        }

        await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('📤 Ban')
                    .addFields(
                        { name: '👤 Utilisateur', value: `<@${target.user.id}>`, inline: true },
                        { name: '👮 Modérateur', value: `<@${interaction.user.id}>`, inline: true },
                        { name: '🗒️ Raison', value: reason || 'Aucune raison fournie.' }
                    )
                    .setTimestamp()
                    .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    })
            ]})

        reason ? await target.ban(reason) : await target.ban();
    }
}