const {MessageEmbed} = require("discord.js");
const {User} = require("../../Models");
const modChannel = require('../../config.json').channels.moderation;
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'Signaler ce message',
    category: 'contextuel',
    permissions: ['READ_MESSAGE_HISTORY'],
    type: 'MESSAGE',
    async runInteraction(client, interaction) {
        if (interaction.guild.id !== prodGuild) {
            return;
        }

        if (interaction.user.id === interaction.targetMessage.author.id) {
            return interaction.reply({ content: '**❌ | Vous ne pouvez pas signaler votre propre message !**', ephemeral: true });
        }

        let messageContent = interaction.targetMessage.content;

        if (interaction.targetMessage.content.length > 1000) {
            messageContent = interaction.targetMessage.content.substring(0, 1000) + "...";
        }

        if (interaction.targetMessage.content.length <= 0) {
            messageContent = 'Ce message ne contient pas de texte.';
        }

        let embed = new MessageEmbed()
            .setColor('#e83636')
            .setTitle('Signalement')
            .setDescription(`**<@${interaction.user.id}> (${interaction.user.id}) a signalé un message.**`)
            .addField('Message', messageContent)
            .addField('Auteur', `<@${interaction.targetMessage.author.id}> (\`${interaction.targetMessage.author.id}\`)`)
            .addField('ID du message', `\`${interaction.targetMessage.id}\``)
            .addField('ID du salon', `\`${interaction.channelId}\``)
            .addField('ID du serveur', `\`${interaction.guild.id}\``)
            .addField('Lien vers le message', `[Lien](${interaction.targetMessage.url})`)
            .setTimestamp()
            .setThumbnail(interaction.targetMessage.author.displayAvatarURL({ dynamic: true}))
            .setFooter({
                text: 'Signalement de message',
                iconURL: client.user.displayAvatarURL({dynamic: true})
            })

        if (interaction.targetMessage.attachments.size > 0) {
            embed.addField('Pièces jointes', interaction.targetMessage.attachments.map(attachment => `[${attachment.name}](${attachment.url})`).join('\n'));
            embed.setImage(interaction.targetMessage.attachments.first().url);
        }

        client.guilds.cache.get(interaction.guild.id).channels.cache.get(modChannel).send({ embeds: [embed] });

        interaction.reply({ content: '**✅ | Votre signalement a bien été envoyé à l\'équipe de modération, nous vous remercions.**', ephemeral: true });

        if (interaction.targetMessage.content.length > 150) {
            messageContent = interaction.targetMessage.content.substring(0, 150) + "...";
        }

        await User.updateOne({
            id: interaction.targetMessage.author.id
        }, {
            $inc: {
                reportScore: 1
            },
            $push: {
                msgReports: [{
                    msgID: interaction.targetMessage.id,
                    channelID: interaction.channelId,
                    authorID: interaction.user.id,
                    msg: messageContent,
                    date: Date.now(),
                }]
            }
        }, { upsert: true });
    }
}