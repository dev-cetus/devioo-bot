const { MessageEmbed } = require("discord.js");
const modChannel = require('../../config.json').channels.moderation;
const { User } = require('../../Models/index')
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'Signaler cet utilisateur',
    category: 'contextuel',
    permissions: [ 'READ_MESSAGE_HISTORY' ],
    type: 'USER',
    async runInteraction(client, interaction) {
        if (interaction.guild.id !== prodGuild) {
            return;
        }

        if (interaction.targetMember.id === interaction.user.id) {
            return interaction.reply({ content: '**❌ | Vous ne pouvez vous signaler vous-même !**', ephemeral: true });
        }

        client.guilds.cache.get(interaction.guild.id).channels.cache.get(modChannel).send({
            embeds: [ new MessageEmbed()
                .setColor('#e83636')
                .setTitle('Signalement')
                .setDescription(`**<@${interaction.user.id}> (${interaction.user.id}) a signalé un utilisateur.**`)
                .addField('Utilisateur signalé', `<@${interaction.targetMember.id}> (${interaction.targetMember.id})`)
                .setTimestamp()
                .setThumbnail(interaction.targetMember.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: 'Signalement d\'utilisateur',
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
            ]
        });

        interaction.reply({
            content: '**✅ | Votre signalement a bien été envoyé à l\'équipe de modération, nous vous remercions.**',
            ephemeral: true
        });

        await User.updateOne({
            id: interaction.targetMember.id
        }, {
            $inc: {
                reportScore: 5
            },
            $push: {
                reports: Date.now()
            }
        }, { upsert: true });
    }
}
