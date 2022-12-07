const {MessageEmbed} = require("discord.js");
const levelChannel = require('../../config.json').channels.levels;

module.exports = {
    name: 'levelUp',
    once: false,
    execute(client, user) {
        let userId = user.id;

        client.channels.cache.get(levelChannel).send({content: `<@!${userId}> viens de passer au niveau ${user.level}`})
    }
}