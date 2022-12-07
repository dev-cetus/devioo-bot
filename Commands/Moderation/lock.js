module.exports = {
    name: 'lock',
    category: 'Moderation',
    permissions: [ 'MANAGE_CHANNELS' ],
    description: 'Vérouiller un salon',
    usage: 'lock',
    async runInteraction(client, interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
            SEND_MESSAGES: false,
        })
        await interaction.reply({ content: `**🔒 | Le salon a été vérouillé par ${interaction.user.tag}.**` })
    }
}
