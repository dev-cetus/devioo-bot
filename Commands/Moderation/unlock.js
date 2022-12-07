module.exports = {
    name: 'unlock',
    category: 'Moderation',
    permissions: [ 'MANAGE_CHANNELS' ],
    description: 'Dévérouiller un salon',
    usage: 'unlock',
    async runInteraction(client, interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
            SEND_MESSAGES: true,
        })
        await interaction.reply({ content: `**🔓 | Le salon a été dévérouillé par ${interaction.user.tag}.**` })
    }
}
