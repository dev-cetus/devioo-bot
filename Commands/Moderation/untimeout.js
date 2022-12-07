const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'untimeout',
    category: 'Moderation',
    permissions: ['MODERATE_MEMBERS'],
    description: 'Retire le timeout d\'un utilisateur',
    usage: 'untimeout [@username]',
    options: [
        {
            name: 'user',
            description: 'Utilisateur à dont il faut retier le timeout.',
            type: "USER",
            required: true
        }
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember("user");

        if (!target.isCommunicationDisabled()) return interaction.reply({embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('Erreur')
                    .setDescription('Cet utilisateur n\'est pas en timeout.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    })
            ], ephemeral: true});

        target.timeout(null);

        await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#6fe153')
                    .setTitle('🗣️ Timeout retiré')
                    .addFields(
                        { name: '👤 Utilisateur', value: `<@${target.user.id}>`, inline: true },
                        { name: '👮 Modérateur', value: `<@${interaction.user.id}>`, inline: true },
                    )
                    .setTimestamp()
                    .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    })
            ]})

    }
}