const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return interaction.reply('Cette commande n\'existe pas.');

            // Check permissions
            if (!interaction.member.permissions.has([ cmd.permissions ])) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#e64949')
                        .setTitle('Permissions insuffisantes')
                        .setDescription(`❌ | Vous n'avez pas la/les permission(s) requise(s) (\`${cmd.permissions.join(', ')}\`) pour exécuter cette commande.`)
                        .setTimestamp()
                        .setFooter({
                            text: `${interaction.user.username} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        })
                ], ephemeral: true
            });

            cmd.runInteraction(client, interaction);
        } else if (interaction.isButton()) {
            const btn = client.buttons.get(interaction.customId);
            if (!btn) return interaction.reply({ content: 'Ce bouton n\'existe pas.', ephemeral: true });
            btn.runInteraction(client, interaction);
        } else if (interaction.isSelectMenu()) {
            const menu = client.select.get(interaction.customId);
            if (!menu) return interaction.reply({ content: 'Ce menu n\'existe pas.', ephemeral: true });
            menu.runInteraction(client, interaction);
        }
    }
}
