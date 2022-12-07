const channels = require('../../config.json').channels;
const memberRole = require('../../config.json').roles.member;
const { MessageEmbed } = require("discord.js");
const prodGuild = require('../../config.json').guilds.prodGuildID;

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(client, member) {

        if (member.guild.id !== prodGuild) {
            return;
        }

        client.guilds.cache.get(member.guild.id).channels.cache.get(channels.logsID).send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: `${member.user.tag} (${member.user.id})`,
                        iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`
                    })
                    .setColor('#61d261')
                    .setDescription(`**»** Nom d'utilisateur: ${member}
                **»** Crée le: <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)
                **»**  Rejoint le: <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`)
                    .setTimestamp()
                    .setFooter({ text: `L'utilisateur a rejoint` })
            ]
        })

        client.guilds.cache.get(member.guild.id).channels.cache.get(channels.memberCountID).setName(`Membres: ${client.guilds.cache.get(member.guild.id).memberCount}`)

        member.roles.add(memberRole, 'Automatique')

    }
}
