module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: `/help | Bot de modération`,
          type: 'WATCHING',
        },
      ],
      status: 'online'
    })

    // Instant update interaction
    // const devGuild = await client.guilds.cache.get(require('../../config.json').guilds.devGuildID);
    // await devGuild.commands.set(client.commands.map(cmd => cmd));

    // Update in all servers
    await client.application.commands.set(client.commands.map(cmd => cmd));
  }
};