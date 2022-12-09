const { MessageEmbed } = require('discord.js');
const { User } = require("../../Models/index");

module.exports = {
    name: 'reports',
    category: 'Moderation',
    permissions: [ 'SEND_MESSAGES' ],
    description: 'Voir ou modifier des signalements.',
    usage: 'reports [list|edit|reset]',
    options: [
        {
            name: 'list',
            description: 'Voir la liste des signalements.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'utilisateur',
                    description: 'L\'utilisateur dont vous souhaitez voir les signalements.',
                    type: 'USER',
                    required: true
                }
            ]
        }
    ],
    async runInteraction(client, interaction) {
        let target = interaction.options.getMember('utilisateur');
            if (interaction.user.id !== target.id) {
                if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#d84141')
                            .setTitle('Erreur')
                            .setDescription('Vous n\'avez pas la permission de voir les signalements de cet utilisateur.')
                            .setTimestamp()
                            .setFooter({
                                text: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                            })
                    ], ephemeral: true
                });
            }

            await User.findOne({
                id: target.user.id
            }).then(async user => {
                if (!user) {
                    return interaction.reply({
                        content: `**✅ | <@${target.user.id}>** n'a reçu aucun signalement.`,
                        ephemeral: true
                    });
                }

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`Signalements de ${target.user.tag}`)
                            .addField('Signalements contre l\'utilisateur', `\`${user.reports.length}\` signalement(s)`)
                            .addField('Signalements contre des messages de l\'utilisateur', `\`${user.msgReports.length}\``)
                            .setTimestamp()
                            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                            .setFooter({
                                text: `${target.user.id}`,
                                iconURL: target.user.displayAvatarURL({ dynamic: true })
                            })
                    ], ephemeral: true
                })
            });
        }
}
