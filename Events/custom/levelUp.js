const { MessageEmbed } = require("discord.js");
const levelChannel = require('../../config.json').channels.levels;

module.exports = {
    name: 'levelUp',
    once: false,
    execute(client, user) {
        client.channels.cache.get(levelChannel).send({ content: `**${user.username}** viens de passer au niveau ${user.level}` })
    }
}
