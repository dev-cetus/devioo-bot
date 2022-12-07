const { Badwords } = require('../../Models/index')
const { warn } = require('../../Utils/Logger')
const { MessageEmbed } = require("discord.js");
const logChannel = require('../../config.json').channels.logsID
const prodGuild = require('../../config.json').guilds.prodGuildID

module.exports = {
    name: 'badwords',
    category: 'Admin',
    permissions: [ 'ADMINISTRATOR' ],
    description: 'Permet de gérer les mots interdits',
    usage: 'badwords [add|remove|edit|list] [mot] [sévérité]',
    options: [
        {
            name: 'add',
            description: 'Ajouter un mot interdit',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'mot',
                    description: 'Le mot à ajouter',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'sévérité',
                    description: 'La sévérité du mot',
                    type: 'NUMBER',
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Supprimer un mot interdit',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'mot',
                    description: 'Le mot à supprimer',
                    type: 'STRING',
                    required: true
                },
            ],
        },
        {
            name: 'edit',
            description: 'Editer un mot interdit',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'mot',
                    description: 'Le mot à éditer',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'sévérité',
                    description: 'La sévérité du mot',
                    type: 'NUMBER',
                    required: true
                },
            ],
        },
        {
            name: 'list',
            description: 'Liste des mots interdits',
            type: 'SUB_COMMAND'
        }
    ],
    async runInteraction(client, interaction) {

        if (interaction.guild.id !== prodGuild) {
            return
        }

        let word = interaction.options.getString('mot')

        if (word == null) {
            word = ""
        }

        word.toLowerCase()

        switch (interaction.options.getSubcommand()) {
            case 'add':
                const severity = interaction.options.getNumber('sévérité');

                if (severity < 1 || severity > 10) {
                    interaction.reply({
                        content: '**❌ | La sévérité doit être comprise entre 1 et 10**',
                        ephemeral: true
                    })
                }

                Badwords.findOneAndUpdate({
                    word: word
                }, {
                    word: word,
                    severity: severity
                }, {
                    upsert: true,
                }, (err) => {
                    if (err) {
                        interaction.reply({ content: '**❌ | Une erreur est survenue**', ephemeral: true });
                        warn(`\t${err}`)
                    } else {
                        interaction.reply({
                            content: `**✅ | Le mot \`${word}\` a été ajouté avec la sévérité \`${severity}\`**\nN'oubliez pas de faire \`/reload\` pour mettre à jour les mot interdits.`,
                            ephemeral: true
                        });
                    }
                });

                client.guilds.cache.get(interaction.guild.id).channels.cache.get(logChannel).send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Ajout d\'un mot interdit')
                            .setColor('#40ca53')
                            .setDescription(`**Mot:** \`${word}\`\n**Sévérité:** \`${severity}\``)
                            .setFooter({
                                text: `ID: ${interaction.user.id}`,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                    ]
                });

                break;

            case 'remove':

                Badwords.findOneAndDelete({
                    word: word
                }, (err) => {
                    if (err) {
                        interaction.reply({ content: '**❌ | Une erreur est survenue**', ephemeral: true });
                        warn(`\t${err}`)
                    } else {
                        interaction.reply({
                            content: `**✅ | Le mot \`${word}\` a été supprimé**\nN'oubliez pas de faire \`/reload\` pour mettre à jour les mot interdits.`,
                            ephemeral: true
                        });
                    }
                });

                client.guilds.cache.get(interaction.guild.id).channels.cache.get(logChannel).send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Suppression d\'un mot interdit')
                            .setColor('#ca4040')
                            .setDescription(`**Mot:** \`${word}\``)
                            .setFooter({
                                text: `ID: ${interaction.user.id}`,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                    ]
                });
                break;

            case 'edit':
                const severityEdit = interaction.options.getNumber('sévérité');

                Badwords.findOneAndUpdate({
                    word: word
                }, {
                    word: word,
                    severity: severityEdit
                }, {
                    upsert: true,
                }, (err) => {
                    if (err) {
                        interaction.reply({ content: '**❌ | Une erreur est survenue**', ephemeral: true });
                        warn(`\t${err}`)
                    } else {
                        interaction.reply({
                            content: `**✅ | Le mot \`${word}\` a été édité avec la sévérité \`${severityEdit}\`**\nN'oubliez pas de faire \`/reload\` pour mettre à jour les mot interdits.`,
                            ephemeral: true
                        });
                    }
                });

                client.guilds.cache.get(interaction.guild.id).channels.cache.get(logChannel).send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Edition d\'un mot interdit')
                            .setColor('#1698d0')
                            .setDescription(`**Mot:** \`${word}\`\n**Sévérité:** \`${severityEdit}\``)
                            .setFooter({
                                text: `ID: ${interaction.user.id}`,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                    ]
                });
                break;

            case 'list':


                let embed = new MessageEmbed()
                    .setColor('#1698d0')
                    .setTitle('Liste des mots interdits')
                    .setThumbnail('https://i.imgur.com/xucUWdp.png')
                    .setFooter({
                        text: `ID: ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })

                let str = '';
                for (const key of client.badwords.keys()) {
                    str += `\`${key}\`, `;
                }
                str = str.substring(0, str.length - 2);
                embed.setDescription(`**Mots:** ${str}`);

                interaction.reply({ embeds: [ embed ] });

                break;
        }
    }
}
