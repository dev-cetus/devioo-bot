const {MessageEmbed} = require("discord.js");
const logChannel = require('../../config.json').channels.logsID;
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'messageDeleteBulk',
    once: false,
    async execute(client, messages) {
        let message = messages.first();

        if (message.guild.id !== prodGuild) return;

        if (message.guild.id === logChannel) return;

        client.guilds.cache.get(message.guild.id).channels.cache.get(logChannel).send({embeds: [
            new MessageEmbed()
                .setColor('#e13d3d')
                .setTitle('Des messages ont été supprimés')
                .addFields(
                    {name: '🗑️ Nombre de messages supprimés', value: `\`\`\`fix\n${messages.size}\`\`\``},
                    {name: '📍 Salon', value: `<#${message.channel.id}>`, inline: true},
                    {name: '🗓️ Date', value: `<t:${parseInt(Date.now()/1000)}:f>`, inline: true},
                )
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setTimestamp()
                .setFooter({
                    text: `ID du salon : ${message.channel.id}`,
                    iconURL: message.guild.iconURL({dynamic: true})
                })
            ]})
    },
};