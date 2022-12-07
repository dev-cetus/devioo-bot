const channels = require('../../config.json').channels;
const {MessageEmbed} = require("discord.js");
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(client, member) {
        if (member.guild.id !== prodGuild) {
            return;
        }

        const fetchKickLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK'
        });

        const kickLog = fetchKickLog.entries.first();
        let isMemberKick = false

        if (kickLog.target === member.id) isMemberKick = true;

        client.guilds.cache.get(member.guild.id).channels.cache.get(channels.logsID).send({embeds: [
                new MessageEmbed()
                    .setAuthor({ name: `${member.user.tag} (${member.user.id})`, iconURL: `${member.user.displayAvatarURL({ dynamic: true })}` })
                    .setColor('#d34848')
                    .setDescription(`**»** Nom d'utilisateur: <@${member.user.id}>
                    **»** Crée le: <t:${parseInt(member.user.createdTimestamp/1000)}:f> (<t:${parseInt(member.user.createdTimestamp/1000)}:R>)
                    **»** Rejoint le: <t:${parseInt(member.joinedTimestamp/1000)}:f> (<t:${parseInt(member.joinedTimestamp/1000)}:R>)
                    **»** Quitté le: <t:${parseInt(Date.now()/1000)}:f> (<t:${parseInt(Date.now()/1000)}:R>)
                    **»** Kick: ${isMemberKick ? 'Oui' : 'Non'}`)
                    .setTimestamp()
                    .setFooter({ text: `L'utilisateur a quitté` })
            ]})

            client.guilds.cache.get(member.guild.id).channels.cache.get(channels.memberCountID).setName(`Membres: ${client.guilds.cache.get(member.guild.id).memberCount}`)
    }
}