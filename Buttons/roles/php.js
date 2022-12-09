const { MessageEmbed } = require("discord.js");
const roleName = "php";
const role = require('../../config.json').roles[roleName];

module.exports = {
    name: roleName,
    async runInteraction(client, interaction) {

        if (!interaction.member.roles.cache.has(role)) {
            interaction.member.roles.add(role);
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Role obtenu !")
                        .setColor("#4fca4f")
                        .setDescription(`Vous avez obtenu le rôle <@&${role}> !`)
                        .setTimestamp()
                        .setFooter({
                            text: interaction.guild.name,
                            iconURL: interaction.guild.iconURL({ dynamic: true })
                        })
                ], ephemeral: true
            });
        } else {
            interaction.member.roles.remove(role);
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Role retiré !")
                        .setColor("#e64d4d")
                        .setDescription(`Vous vous êtes retiré le rôle <@&${role}> !`)
                        .setTimestamp()
                        .setFooter({
                            text: interaction.guild.name,
                            iconURL: interaction.guild.iconURL({ dynamic: true })
                        })
                ], ephemeral: true
            });
        }
    }
}
