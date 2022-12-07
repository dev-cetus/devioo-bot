const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    category: 'Utils',
    permissions: [ 'SEND_MESSAGES' ],
    description: 'Indique le ping du bot.',
    usage: 'ping',
    async runInteraction(client, interaction) {
        let tryPing = await interaction.reply({ content: 'Ping en cours...', fetchReply: true })

        const embed = new MessageEmbed()
            .setTitle('🏓 Pong!')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor('#00AE86')
            .addFields(
                { name: 'Latence API', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
                {
                    name: 'Latence BOT',
                    value: `\`\`\`${tryPing.createdTimestamp - interaction.createdTimestamp}ms\`\`\``,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true })
            });

        await interaction.editReply({ content: null, embeds: [ embed ] })
    }
}
