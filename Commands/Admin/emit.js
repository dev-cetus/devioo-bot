const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'emit',
    category: 'Admin',
    permissions: ['ADMINISTRATOR'],
    description: 'Emettre un évenement.',
    usage: 'emit [event]',
    options: [
        {
            name: 'event',
            description: 'L\'évenement à émettre.',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'GuildMemberAdd',
                    value: 'guildMemberAdd'
                },
                {
                    name: 'GuildMemberRemove',
                    value: 'guildMemberRemove'
                }
            ]
        }
    ],
    runInteraction(client, interaction) {
        const evtChoicies = interaction.options.getString('event');

        if (evtChoicies === 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({content: 'L\'évenement a été émit', ephemeral: true});
        } else if (evtChoicies === 'guildMemberRemove') {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({content: 'L\'évenement a été émit', ephemeral: true});
        } else {
            interaction.reply({ embeds: [new MessageEmbed()
                .setColor('#ef5353')
                .setTitle('Erreur')
                .setDescription('L\'évenement n\'existe pas')
            ]});
        }
    }
}