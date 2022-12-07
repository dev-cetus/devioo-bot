const { MessageEmbed, MessageAttachment } = require("discord.js");
const { getLeaderboard } = require("../../Utils/Level")

module.exports = {
    name: 'leaderboard',
    category: 'Level',
    permissions: [ 'SEND_MESSAGES' ],
    description: "Affiche le leaderboard du serveur.",
    usage: 'leaderboard',
    options: [],
    async runInteraction(client, interaction) {

        const leaderboard = await getLeaderboard()
        let list = leaderboard.map((el, i) => {
            return `${i + 1}. **${el.username}** : Level \`${el.level}\``
        });

        const embed = {
            color: Math.floor(Math.random() * 16777215),
            title: `:trophy: Leaderboard :`,
            description: list.join('\n')
        };

        return interaction.reply({ embeds: [ embed ] });
    }
}
