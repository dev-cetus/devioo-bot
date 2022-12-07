module.exports = {
    name: 'slowmode',
    category: 'Moderation',
    permissions: [ 'MANAGE_MESSAGES' ],
    description: 'Permet d\'activer ou de désactiver le mode lent.',
    usage: 'slowmode [temps]',
    options: [
        {
            name: 'temps',
            description: 'Temps pour le mode lent.',
            type: "NUMBER",
            required: true
        },
    ],
    async runInteraction(client, interaction) {
        const time = interaction.options.getNumber('temps');

        if (time === 0) {
            await interaction.channel.setRateLimitPerUser(0);
            return interaction.reply({ content: '**✅ | Le mode lent est désactivé.**', ephemeral: true });
        }
        await interaction.channel.setRateLimitPerUser(time);
        return interaction.reply({ content: `**✅ | Le mode lent est activé (${time} secondes).**`, ephemeral: true });
    }
}
