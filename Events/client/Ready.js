const config = require('../../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({
            activities: [
                {
                    name: config.richPresence.activity.name,
                    type: config.richPresence.activity.type,
                },
            ],
            status: config.richPresence.status,
        })

        // Instant update interaction
        // const devGuild = await client.guilds.cache.get(require('../../config.json').guilds.devGuildID);
        // await devGuild.commands.set(client.commands.map(cmd => cmd));

        // Update in all servers
        await client.application.commands.set(client.commands.map(cmd => cmd));
    }
};
