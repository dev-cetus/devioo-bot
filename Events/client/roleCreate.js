const {MessageEmbed} = require("discord.js");
const prodGuild = require('../../config.json').guilds.prodGuildID;
const logChannel= require('../../config.json').channels.logsID;

module.exports = {
    name: 'roleCreate',
    once: false,
    async execute(client, role) {
        if (role.guild.id !== prodGuild) return;

        if (role.name === '@everyone') return;


        client.guilds.cache.get(role.guild.id).channels.cache.get(logChannel).send({embeds: [
            new MessageEmbed()
                .setColor('#61d261')
                .setTitle('Un rôle a été créé')
                .addFields(
                    {name: '🎈 Nom du rôle', value: role.name},
                    {name: '🏷️ ID du rôle', value: `\`${role.id}\``, inline: true},
                    {name: '🗓️ Créé le', value: `<t:${parseInt(role.createdAt/1000)}:f>`}
                )
                .setThumbnail(role.guild.iconURL({dynamic: true}))
                .setTimestamp()
                .setFooter({
                    text: 'ID du serveur : ' + role.guild.id,
                    iconURL: role.guild.iconURL({dynamic: true})
                })
            ]})
    }
}