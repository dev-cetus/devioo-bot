module.exports = {
    name: 'clear',
    category: 'Moderation',
    permissions: ['MANAGE_MESSAGES'],
    description: 'Permet de supprimer un nombre définit de messages d\'un seul utilisateur ou de tous le monde.',
    usage: 'clear [number] <@username>',
    options: [
        {
            name: 'messages',
            description: 'Nombre de messages à supprimer.',
            type: "NUMBER",
            required: true
        },
        {
            name: 'user',
            description: 'Utilisateur dont les messages doivent être supprimés.',
            type: "USER",
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const amountToDelete = interaction.options.getNumber("messages");
        if (amountToDelete > 100 || amountToDelete < 1) {
            return interaction.reply({ content: "**❌ | Vous devez entrer un nombre entre 1 et 100.**", ephemeral: true });
        }
        const target = interaction.options.getMember("user");

        const messagesToDelete = await interaction.channel.messages.fetch({ limit: amountToDelete });
        if (target) {
            let i = 0;
            let filteredMessages = [];
            (await messagesToDelete).filter(msg =>  {
                if (msg.author.id === target.id && amountToDelete > i) {
                    filteredMessages.push(msg);
                    i++;
                }
            });

            await interaction.channel.bulkDelete(filteredMessages, true).then(msg => {
                interaction.reply({ content: `\`${msg.size}\` messages de <@${target.user.id}> on été supprimés parmi les ${amountToDelete} derniers messages.`, ephemeral: true })
            });
        } else {
            await interaction.channel.bulkDelete(amountToDelete, true).then(msg => {
                interaction.reply({ content: `\`${msg.size}\` messages on été supprimés.`, ephemeral: true })
            });
        }
    }
}