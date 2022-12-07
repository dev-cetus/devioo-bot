const { MessageEmbed } = require("discord.js");
const prodGuild = require('../../config.json').guilds.prodGuildID;
const dayjs = require('dayjs');
const { create } = require('sourcebin');
const { warn } = require("../../Utils/Logger");

module.exports = {
    name: 'yes',
    async runInteraction(client, interaction) {
        if (interaction.guildId !== prodGuild) return;

        if (interaction.channel.partial) {
            try {
                await interaction.channel.fetch();
            } catch (e) {
                warn(`\tFailed to fetch channel ${interaction.channel.id}\n${e}`);
                return;
            }
        }

        const logChannel = require('../../config.json').channels.logsID;
        const messages = await interaction.channel.messages.fetch({ limit: 100 });

        let string = '';
        messages.forEach(message => {
            let msgContent;
            if (message.content.length === 0 || !message.content) {
                msgContent = '<empty>';
            } else {
                msgContent = message.content;
            }
            string += `${message.author.tag} (${message.author.id}) : ${dayjs(message.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}\n${msgContent}\n`;
            if (message.attachments.size > 0) {
                string += `\nAttachments :\n`;
                message.attachments.forEach(attachment => {
                    string += `\t\t- ${attachment.url}\n`;
                });
            }
            string += '----------------------------\n'
        });

        const bin = await create(
            [
                {
                    content: string,
                    language: 'text',
                }
            ],
            {
                title: `Logs de ${interaction.channel.name}`,
                description: `Ticket fermé par ${interaction.user.tag} (${interaction.user.id})`,
            }
        ).catch(() => {
            return interaction.reply({
                content: '**❌ | Une erreur est survenue durant la sauvegarde du ticket.**',
                ephemeral: true
            });
        });


        await client.guilds.cache.get(interaction.guildId).channels.cache.get(logChannel).send({
            embeds: [
                new MessageEmbed()
                    .setColor('#e13d3d')
                    .setTitle('Ticket fermé')
                    .addFields(
                        { name: '🏷️ ID du ticket', value: `\`${interaction.channel.id}\``, inline: true },
                        { name: '🎈 Nom du ticket', value: interaction.channel.name, inline: true },
                        {
                            name: '🗓️ Date d\'ouverture',
                            value: `<t:${parseInt(interaction.channel.createdAt / 1000)}:f>`
                        },
                        { name: '🗓️ Date de fermeture', value: `<t:${parseInt(Date.now() / 1000)}:f>` },
                        {
                            name: '🚧 Fermé par',
                            value: `<@${interaction.user.id}> (\`${interaction.user.id}\`)`,
                            inline: true
                        },
                        { name: '🔗 Lien', value: `[Logs du ticket](${bin.url})`, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({
                        text: 'Ticket fermé',
                        iconURL: client.user.avatarURL({ dynamic: true })
                    })
            ]
        })

        interaction.reply('Ticket fermé !');
        interaction.channel.delete();
    }
}
