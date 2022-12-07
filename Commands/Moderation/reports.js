const { MessageEmbed } = require('discord.js');
const { User } = require("../../Models/index");
const modChannel = require('../../config.json').channels.moderation;

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
        },
        {
            name: 'edit',
            description: 'Modifier le score de signalement.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'utilisateur',
                    description: 'L\'utilisateur dont vous souhaitez modifier le score de signalement.',
                    type: 'USER',
                    required: true
                },
                {
                    name: 'score',
                    description: 'Le nouveau score de signalement.',
                    type: 'NUMBER',
                    required: true
                }
            ]
        },
        {
            name: 'reset',
            description: 'Réinitialise totalement les signalements d\'un utilisateur.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'utilisateur',
                    description: 'L\'utilisateur dont vous souhaitez réinitialiser les signalements.',
                    type: 'USER',
                    required: true
                }
            ]
        }
    ],
    async runInteraction(client, interaction) {
        let target = interaction.options.getMember('utilisateur');

        switch (interaction.options.getSubcommand()) {
            case 'list':
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
                                .addField('Signalements automatiques', `\`${user.autoReports.length}\``)
                                .addField('Score de signalements', `\`${user.reportScore}\``)
                                .setTimestamp()
                                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                                .setFooter({
                                    text: `${target.user.id}`,
                                    iconURL: target.user.displayAvatarURL({ dynamic: true })
                                })
                        ], ephemeral: true
                    })
                });

                break;

            case 'edit':
                if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#d84141')
                            .setTitle('Erreur')
                            .setDescription('Vous n\'avez pas la permission de modifier le score de signalement d\'un utilisateur.')
                            .setTimestamp()
                            .setFooter({
                                text: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                            })
                    ], ephemeral: true
                });

                let score = interaction.options.getNumber('score')

                if (score > 70 && score < 0) {
                    return interaction.reply({
                        content: `**❌ | Le score doit être compris entre 1 et 70 (inclus).**`,
                        ephemeral: true
                    })
                }

                await User.findOneAndUpdate({
                    id: target.user.id
                }, {
                    reportScore: score
                }, {
                    upsert: true
                })
                let newScore = await User.findOne({
                    id: target.user.id
                }).then(user => {
                    return user.reportScore
                })

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#3ddc5d')
                            .setTitle('Score de signalements modifié')
                            .setDescription(`Le score de signalements de <@${target.user.id}> est maintenant de \`${newScore}\``)
                            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()
                            .setFooter({
                                text: `ID: ${target.user.id}`,
                                iconURL: target.user.displayAvatarURL({ dynamic: true })
                            })
                    ], ephemeral: true
                })

                break;

            case 'reset':
                if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#d84141')
                            .setTitle('Erreur')
                            .setDescription('Vous n\'avez pas la permission de réinitialiser le score de signalement d\'un utilisateur.')
                            .setTimestamp()
                            .setFooter({
                                text: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                            })
                    ], ephemeral: true
                });

                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply({
                        content: `**❌ | Vous n'avez pas la permission d'utiliser cette commande.**`,
                        ephemeral: true
                    })
                }

                await User.findOneAndDelete({
                    id: target.user.id
                }, {
                    upsert: true
                })
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#3ddc5d')
                            .setTitle('Signalements réinitialisés')
                            .setDescription(`Les signalements de <@${target.user.id}> ont été réinitialisés.`)
                            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()
                            .setFooter({
                                text: `ID: ${target.user.id}`,
                                iconURL: target.user.displayAvatarURL({ dynamic: true })
                            })
                    ], ephemeral: true
                })

                client.channels.cache.get(modChannel).send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#3ddc5d')
                            .setTitle('Signalements réinitialisés')
                            .setDescription(`Les signalements de <@${target.user.id}> ont été réinitialisés.`)
                            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()
                            .setFooter({
                                text: `ID: ${target.user.id}`,
                                iconURL: target.user.displayAvatarURL({ dynamic: true })
                            })
                    ]
                })

                break;
        }
    }
}
