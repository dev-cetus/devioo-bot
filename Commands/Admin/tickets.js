const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('create')
            .setLabel('Créer')
            .setEmoji('📩')
            .setStyle('PRIMARY')
    )


module.exports = {
    name: 'tickets',
    category: 'Admin',
    permissions: [ 'ADMINISTRATOR' ],
    description: 'Affiche le bouton pour créer un ticket.',
    usage: 'tickets',
    async runInteraction(client, interaction) {
        await interaction.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#31e391')
                    .setTitle('Créer un ticket')
                    .setDescription('Vous pouvez créer un ticket en cliquant sur le bouton ci-dessous.')
                    .setTimestamp()
                    .setFooter({
                        text: `${interaction.guild.name} - Tickets`,
                        iconURL: interaction.guild.iconURL({ dynamic: true })
                    })
            ], components: [ buttons ]
        })
        await interaction.reply({ content: '**✅ | L\'embed a été envoyé avec succès.**', ephemeral: true })
    }
}
