const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'Informations sur l\'utilisateur',
    category: 'contextuel',
    permissions: [ 'SEND_MESSAGES' ],
    type: 'USER',
    async runInteraction(client, interaction) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: `${interaction.targetMember.user.tag} (${interaction.targetMember.id})`,
                        iconURL: interaction.targetMember.user.bot ? 'https://i.imgur.com/bGuuLv6.png' : 'https://i.imgur.com/azxSXgm.png'
                    })
                    .setColor("RANDOM")
                    .setImage(interaction.targetMember.user.avatarURL({ format: 'png', dynamic: true, size: 256 }))
                    .addFields(
                        { name: 'Nom', value: `${interaction.targetMember.displayName}`, inline: true },
                        { name: 'Modérateur', value: `${interaction.targetMember.kickable ? '🔴' : '🟢'}`, inline: true },
                        { name: 'Bot', value: `${interaction.targetMember.user.bot ? '✅' : '❌'}`, inline: true },
                        {
                            name: 'Roles',
                            value: `${interaction.targetMember.roles.cache.map(role => role).join(', ').replace(', @everyone', '')}`,
                            inline: true
                        },
                        {
                            name: 'A crée son compte le',
                            value: `<t:${parseInt(interaction.targetMember.user.createdTimestamp / 1000)}:f> (<t:${parseInt(interaction.targetMember.user.createdTimestamp / 1000)}:R>)`
                        },
                        {
                            name: 'A rejoint le serveur le',
                            value: `<t:${parseInt(interaction.targetMember.joinedTimestamp / 1000)}:f> (<t:${parseInt(interaction.targetMember.joinedTimestamp / 1000)}:R>)`
                        },
                    )
            ]
        });
    }
}
