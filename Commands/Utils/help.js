const { readdirSync } = require('fs');
const { MessageEmbed } = require("discord.js");
const commandFolder = readdirSync('./Commands')

module.exports = {
    name: 'help',
    category: 'Utils',
    permissions: [ 'SEND_MESSAGES' ],
    description: 'Affiche le menu d\'aide.',
    usage: 'help <commande>',
    options: [
        {
            name: 'commande',
            description: 'La commande dont vous voulez plus d\'aide.',
            type: 'STRING',
            required: false
        }
    ],
    runInteraction(client, interaction) {
        const cmdName = interaction.options.getString('commande');
        if (!cmdName) {
            const noCmdEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Liste des commandes')
                .setTimestamp()
                .setFooter({
                    text: 'Pour plus d\'aide sur une commande, utilisez la commande `help [commande]`',
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                });

            for (const category of commandFolder) {
                if (category === 'contextuel') continue;
                noCmdEmbed.addField(
                    `${category.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}`,
                    `\`${client.commands.filter(cmd => cmd.category.toLowerCase() === category.toLowerCase()).map(cmd => cmd.name).join('`, `')}\``
                )
            }

            return interaction.reply({ embeds: [ noCmdEmbed ] });
        }

        const cmd = client.commands.get(cmdName)
        if (!cmd) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#e54242')
                    .setTitle('Commande introuvable')
                    .setDescription(`La commande \`${cmdName}\` n'a pas été trouvée. Tapez \`/help\` pour afficher la liste des commandes.`)
                    .setFooter({
                        text: 'Pour plus d\'aide sur une commande, utilisez la commande `help [commande]`',
                        iconURL: client.user.displayAvatarURL({ dynamic: true })
                    })
            ]
        });

        return interaction.reply({
            embeds: [ new MessageEmbed()
                .setColor('#3bd55d')
                .setTitle(`Aide sur la commande \`${cmd.name}\``)
                .addField(`Description`, `${cmd.description || 'Aucune description disponible'}`)
                .addField('Utilisation', `\`${cmd.usage || '\`Aucun exemple d\'utilisation disponible'}\``)
                .addField('Catégorie', `\`${cmd.category || '\`Aucune catégorie'}\``)
                .addField('Permissions', `\`${cmd.permissions.join(', ') || '\`Aucune'}\``)
                .setFooter({
                    text: 'Pour plus d\'aide sur une commande, utilisez la commande /help [commande]',
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                }) ]
        });
    }
}
