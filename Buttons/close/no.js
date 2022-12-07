const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'no',
    async runInteraction(client, interaction) {
        interaction.reply({embeds: [
            new MessageEmbed()
                .setColor("#61d261")
                .setTitle('Nous avons arrêté le processus de fermeture')
                .setDescription('On a évité la catastrophe !')
                .setTimestamp()
                .setFooter({
                    text: `${interaction.user.tag} - ${interaction.user.id}`,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                })
            ], ephemeral: true})
    }
}