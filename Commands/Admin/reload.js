const { info } = require('../../Utils/Logger');

module.exports = {
    name: 'reload',
    category: 'Admin',
    permissions: ['MANAGE_MESSAGES'],
    description: 'Permet recharger le bot',
    usage: 'reload',
    /*options: [
        {
            name: 'badwords',
            description: 'Permet de recharger les mots interdits uniquement',
            type: 'SUB_COMMAND',
        }
    ],*/
    async runInteraction(client, interaction) {
        /*
        // interaction.options.getSubcommand()
        let options = interaction.options.getString('badwords');

        if (options === 'badwords'){
            await require('../../Utils/Handlers/BadwordsUtil')(client);
        } else {


        }
        */
        info('\tReloading...');
        await require('../../Utils/Handlers/BadwordsUtil')(client);
        interaction.reply({ content: '**✅ | Le bot a bien été rechargé !**', ephemeral: true })
    }
}