const { MessageEmbed } = require("discord.js");
const { User } = require("../../Models");

module.exports = {
    name: 'warn',
    category: 'Moderation',
    permissions: [ 'MANAGE_MESSAGES' ],
    description: 'Averti un utilisateur',
    usage: 'warn <utilisateur> <raison> <sévérité>',
    options: [
        {
            name: 'user',
            description: 'Utilisateur à avertir.',
            type: "USER",
            required: true
        },
        {
            name: 'reason',
            description: 'Raison de l\'avertissement.',
            type: "STRING",
            required: false
        },
        {
            name: 'severity',
            description: 'Sévérité de l\'avertissement, par défaut 5.',
            type: "NUMBER",
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        let target = interaction.options.getMember("user");
        let reason = interaction.options.getString("reason") || "Aucune raison donnée.";
        let severity = interaction.options.getNumber("severity") || 5;

        if (!target || !target.moderatable) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#d84141')
                    .setTitle('Erreur')
                    .setDescription('Impossible d\'avertir cet utilisateur.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ], ephemeral: true
        });

        await User.findOneAndUpdate({
            id: target.id
        }, {
            $push: {
                warns: {
                    reason: reason,
                    severity: severity,
                }
            }
        }).then(async () => {
            await target.user.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#d84141')
                        .setTitle('Avertissement')
                        .setDescription(`Vous avez été avertis par ${interaction.user.tag} pour la raison suivante: \`${reason}\``)
                        .setTimestamp()
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        })
                ]
            }).catch(() => {
                return interaction.reply({
                    content: `<@${target.id}>,`, embeds: [
                        new MessageEmbed()
                            .setColor('#d77813')
                            .setTitle('Avertissement')
                            .setDescription(`Vous avez été avertis par ${interaction.user.tag} pour la raison suivante: \`${reason}\``)
                            .setTimestamp()
                            .setFooter({
                                text: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                            })
                    ]
                })
            })
        })

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#40ca53')
                    .setTitle('Avertissement')
                    .setDescription(`Vous avez averti <@${target.id}> pour la raison suivante: \`${reason}\``)
                    .setTimestamp()
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
            ], ephemeral: true
        });
    }

}
