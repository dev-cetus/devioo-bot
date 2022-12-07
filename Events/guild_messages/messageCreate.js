const { User } = require('../../Models/index');
const {MessageEmbed} = require("discord.js");
const modChannel = require('../../config.json').channels.moderation;
const { info } = require('../../Utils/Logger')
const { automod } = require('../../Utils/AutoModerator');
const prodGuild = require('../../config.json').guilds.prodGuildID;
const { updateUserXp } = require("../../Utils/Level")

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        updateUserXp(message.member.id, message).then();

        if (message.guild.id !== prodGuild) {
            return;
        }

        // if (message.member.permissions.has('MANAGE_MESSAGES')) return;
        if (message.member) {
            if (message.member.permissions.has('MANAGE_MESSAGES')) return;
        }

        let badword = '';
        for (const word of client.badwords.keys()) {
            if (message.content.toLowerCase().includes(word)) {
                badword = word;
                break;
            }
        }

        if (badword !== '') {
            await User.findOneAndUpdate({
                id: message.author.id,
                username: message.author.username
            }, {
                $inc: {
                    reportScore: client.badwords.get(badword)
                },
                $push: {
                    autoReports: [
                        {
                            reason: `Bad word: ${badword}`,
                            date: Date.now()
                        }
                    ]
                }
            }, { upsert: true });

            client.guilds.cache.get(message.guild.id).channels.cache.get(modChannel).send({ embeds: [
                    new MessageEmbed()
                        .setColor('#d33a3a')
                        .setTitle('Auto-modérateur')
                        .setDescription(`${message.author} (${message.author.id}) vient de se faire sanctionner.`)
                        .addField('Raison', `Contenu inapproprié : \`${badword}\``)
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({
                            text: 'Auto-modérateur',
                            iconURL: client.user.displayAvatarURL({dynamic: true})
                        })
                ]})

            await automod(client, message)


            message.member.send({ content: `${message.author.username},\nVotre message dans le serveur ${message.guild.name} a été automatiquement sanctionné pour contenu inapproprié.`,
            }).catch(() => {
                info(`${message.author.username} (${message.author.id}) a été automatiquement sanctionné pour contenu inapproprié, mais il n'accepte pas les messages privés.`)
            })

        }
    },
};
