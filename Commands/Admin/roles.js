const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const emojis = require('../../config.json').emojis;
const roles = require('../../config.json').roles;

const languages = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(Object.keys(roles)[0])
            .setLabel('C/C++')
            .setEmoji(emojis.ccpp)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[1])
            .setLabel('C#')
            .setEmoji(emojis.cs)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[2])
            .setLabel('Dart')
            .setEmoji(emojis.dart)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[3])
            .setLabel('Golang')
            .setEmoji(emojis.go)
            .setStyle('SECONDARY'),
    )

const languages2 = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(Object.keys(roles)[4])
            .setLabel('Java')
            .setEmoji(emojis.java)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[5])
            .setLabel('Javascript')
            .setEmoji(emojis.js)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[6])
            .setLabel('Kotlin')
            .setEmoji(emojis.kotlin)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[7])
            .setLabel('PHP')
            .setEmoji(emojis.php)
            .setStyle('SECONDARY'),
    )

const languages3 = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(Object.keys(roles)[8])
            .setLabel('Python')
            .setEmoji(emojis.py)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[9])
            .setLabel('Typescript')
            .setEmoji(emojis.ts)
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[10])
            .setLabel('Web')
            .setEmoji(emojis.web)
            .setStyle('SECONDARY'),
    )

const notifs = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(Object.keys(roles)[11])
            .setLabel('Annonces')
            .setEmoji(emojis.annonces)
            .setStyle('PRIMARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[12])
            .setLabel('Dev')
            .setEmoji(emojis.dev)
            .setStyle('PRIMARY'),

        new MessageButton()
            .setCustomId(Object.keys(roles)[13])
            .setLabel('Partenaires')
            .setEmoji(emojis.partner)
            .setStyle('PRIMARY'),
    )


module.exports = {
    name: 'roles',
    category: 'Admin',
    permissions: [ 'ADMINISTRATOR' ],
    description: 'Affiche les boutons pour s\'ajouter ou se retirer des rôles.',
    usage: 'roles',
    async runInteraction(client, interaction) {
        if (!interaction.channel || interaction.channel.type !== 'GUILD_TEXT') return interaction.reply('**❌ | Cette commande ne peut être utilisée que dans un salon textuel.**');
        await interaction.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle('Rôles')
                    .setDescription(`**Sélectionnez un rôle pour vous l\'ajouter ou vous le retirer.**\n
                    ${emojis.ccpp} <@&${roles.ccpp}>
                    ${emojis.cs} <@&${roles.cs}>
                    ${emojis.dart} <@&${roles.dart}>
                    ${emojis.go} <@&${roles.go}>
                    ${emojis.java} <@&${roles.java}>
                    ${emojis.js} <@&${roles.js}>
                    ${emojis.kotlin} <@&${roles.kotlin}>
                    ${emojis.php} <@&${roles.php}>
                    ${emojis.py} <@&${roles.py}>
                    ${emojis.ts} <@&${roles.ts}>
                    ${emojis.web} <@&${roles.web}>
                    
                    ${emojis.annonces} <@&${roles.annonces}>
                    ${emojis.status} <@&${roles.status}>
                    ${emojis.dev} <@&${roles.dev}>
                    ${emojis.partner} <@&${roles.partner}>
                    `)
                    .setColor('#0099ff')
                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL({ dynamic: true })
                    })
                    .setTimestamp()
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            ], components: [ languages, languages2, languages3, notifs ]
        })
        await interaction.reply({ content: '**✅ | L\'embed a été envoyé avec succès.**', ephemeral: true })
    }
}
