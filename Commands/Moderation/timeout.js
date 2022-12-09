
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'timeout',
    category: 'Moderation',
    permissions: [ 'MODERATE_MEMBERS' ],
    description: 'Timeout un utilisateur',
    usage: 'timeout [@username] [temps] [raison]',
    options: [
        {
            name: 'user',
            description: 'Utilisateur à timeout.',
            type: "USER",
            required: true
        },
        {
            name: 'temps',
            description: 'Temps de timeout (En anglais).',
            type: "STRING",
            required: true
        },
        {
            name: 'reason',
            description: 'Raison du timeout.',
            type: "STRING",
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember("user");
        const time = interaction.options.getString("temps");
        const reason = interaction.options.getString("reason");
        const convertedTime = ms(time);

        if (!target || !target.moderatable) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('Erreur')
                    .setDescription('Impossible de timeout cet utilisateur.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ], ephemeral: true
        });

        if (!convertedTime || convertedTime > 2419200000 || convertedTime === 0) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('Erreur')
                    .setDescription('La temps de timeout est invalide (Max. 28 jours).')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ], ephemeral: true
        });

        reason ? target.timeout(convertedTime, reason) : target.timeout(convertedTime);

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#6fe153')
                    .setTitle('🤐 Timeout')
                    .addFields(
                        { name: '👤 Utilisateur', value: `<@${target.user.id}>`, inline: true },
                        { name: '👮 Modérateur', value: `<@${interaction.user.id}>`, inline: true },
                        { name: '🗒️ Raison', value: reason || 'Aucune raison fournie.' },
                        { name: '🕒 Temps', value: time }
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
