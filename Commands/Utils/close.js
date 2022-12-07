const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
let category = require('../../config.json').categories.tickets;

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId("yes")
            .setLabel("OUI")
            .setEmoji("✅")
            .setStyle("SECONDARY"),

        new MessageButton()
            .setCustomId("no")
            .setLabel("NON")
            .setEmoji("❌")
            .setStyle("PRIMARY"),
    )

module.exports = {
    name: 'close',
    category: 'Utils',
    permissions: ['SEND_MESSAGES'],
    description: 'Permet de fermer un ticket.',
    usage: 'close',
    async runInteraction(client, interaction) {
        if (!interaction.channel.name.startsWith('ticket-') && interaction.channel.parentId !== category) {
            return interaction.reply({content: '**❌ | Ce salon n\'est pas un ticket.**', ephemeral: true});
        }

        interaction.reply({embeds: [
            new MessageEmbed()
                .setColor('#da8d2a')
                .setTitle('Êtes-vous sûr de vouloir fermer ce ticket ?')
                .setDescription('Cette action est irréversible.')
                .setTimestamp()
            ], components: [buttons], ephemeral: true});
    }
}