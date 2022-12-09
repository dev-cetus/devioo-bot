
const { MessageAttachment } = require("discord.js");
const { getUserData } = require("../../Utils/Level")
const canvacord = require("canvacord");

module.exports = {
    name: 'rank',
    category: 'Level',
    permissions: [ 'SEND_MESSAGES' ],
    description: "Affiche votre rang sur le serveur.",
    usage: 'rank <user>',
    options: [
        {
            name: 'user',
            description: "La personne dont vous voulez voir le rang.",
            type: 'USER',
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        let user = interaction.user
        if (interaction.options.data.length > 0) user = interaction.options.data[0].user;

        const data = await getUserData(user.id);

        const image = new canvacord.Rank()
            .setAvatar(user.avatarURL({ format: "jpg" }))
            .setCurrentXP(data.xp)
            .setRequiredXP(data.requiredXP)
            .setLevel(data.level)
            .setRank(data.rank)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(user.username)
            .setDiscriminator(user.discriminator);

        const buff = await image.build();
        const attachment = new MessageAttachment(buff, "RankCard.png");

        const embed = {
            color: Math.floor(Math.random() * 16777215),
            title: `Rang de ${user.tag} :`,
            image: {
                url: 'attachment://RankCard.png',
            },
        };

        return interaction.reply(({ files: [ attachment ], embeds: [ embed ] }));
    }
}
