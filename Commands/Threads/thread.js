module.exports = {
    name: 'thread',
    category: 'Threads',
    permissions: [ 'MANAGE_THREADS' ],
    description: 'Gérer les threads',
    usage: 'thread [join|leave|archive|unarchive|delete]',
    options: [
        {
            name: 'join',
            description: 'Rejoindre un thread',
            type: 'SUB_COMMAND',
        },
        {
            name: 'leave',
            description: 'Quitter un thread',
            type: 'SUB_COMMAND',
        },
        {
            name: 'archive',
            description: 'Archiver un thread',
            type: 'SUB_COMMAND',
        },
        {
            name: 'unarchive',
            description: 'Désarchiver un thread',
            type: 'SUB_COMMAND',
        },
        {
            name: 'delete',
            description: 'Supprimer un thread',
            type: 'SUB_COMMAND',
        }
    ],
    async runInteraction(client, interaction) {
        let thread = interaction.channel;

        if (!thread.type == 'GUILD_PUBLIC_THREAD' || !thread.type == 'GUILD_PRIVATE_THREAD') {
            return interaction.reply({ content: '**❌ | Vous ne pouvez exécuter cette commande que dans un thread.**' });
        }

        switch (interaction.options.getSubcommand()) {
            case 'join':
                if (thread.joinable) {
                    thread.join().then(() => {
                        interaction.reply({ content: '**✅ | Le bot a rejoint le thread.**', ephemeral: true });
                    }).catch(() => {
                        interaction.reply({
                            content: '**❌ | Une erreur est survenue lors de la tentative de rejoindre le thread.**',
                            ephemeral: true
                        });
                    });
                } else {
                    interaction.reply({ content: '**❌ | Ce thread n\'est pas public.**', ephemeral: true });
                }
                break;
            case 'leave':
                thread.leave().then(() => {
                    interaction.reply({ content: '**✅ | Le bot a quitté le thread.**', ephemeral: true });
                }).catch(() => {
                    interaction.reply({
                        content: '**❌ | Une erreur est survenue lors de la tentative de quitter le thread.**',
                        ephemeral: true
                    });
                });
                break;
            case 'archive':
                await interaction.reply({ content: '**✅ | Le thread a été archivé.**', ephemeral: true });
                await thread.setArchived(true).catch(() => {
                    interaction.reply({
                        content: '**❌ | Une erreur est survenue lors de l\'archivage du thread.**',
                        ephemeral: true
                    });
                });
                break;
            case 'unarchive':
                thread.setArchived(false).then(() => {
                    interaction.reply({ content: '**✅ | Le thread a été désarchivé.**', ephemeral: true });
                }).catch(() => {
                    interaction.reply({
                        content: '**❌ | Une erreur est survenue lors de la désarchivage du thread.**',
                        ephemeral: true
                    });
                });
                break;
            case 'delete':
                await thread.delete();
                break;
            default:
                interaction.reply({ content: '**❌ | Vous devez spécifier une sous-commande valide.**' });
                break;
        }
    }
}
