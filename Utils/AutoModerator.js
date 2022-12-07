const { User } = require('../Models/index')
const {MessageEmbed} = require("discord.js");
const {info} = require("./Logger");

async function check(client, message) {
    await User.findOne({
        where: {
            id: message.author.id
        }
    }).then(async user => {
        if (user.reportScore >= 20) {

            await message.member.send({ embeds: [
                new MessageEmbed()
                    .setTitle("Modérateur automatique")
                    .setColor("#f15b30")
                    .setDescription(`Attention, votre score de signalement commence à être élevé, si vous continuez ainsi vous risquez d'être banni. Si vous pensez qu'il s'agit d'une erreur, contactez l'équipe de modération.`)
                    .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    .setFooter({
                        text: "Modérateur automatique",
                        iconURL: client.user.displayAvatarURL({dynamic: true})
                    })
                ]}).catch(() => {
                    message.channel.send({ content: `<@${message.author.id}>, `, embeds: [
                            new MessageEmbed()
                                .setTitle("Modérateur automatique")
                                .setColor("#f15b30")
                                .setDescription(`Attention, votre score de signalement commence à être élevé, si vous continuez ainsi vous risquez d'être banni. Si vous pensez qu'il s'agit d'une erreur, contactez l'équipe de modération.`)
                                .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                                .setFooter({
                                    text: "Modérateur automatique",
                                    iconURL: client.user.displayAvatarURL({dynamic: true})
                                })
                        ]})
                })
        } else if (user.reportScore >= 40) {

            await message.member.send({ embeds: [
                    new MessageEmbed()
                        .setColor('#d84141')
                        .setTitle('📤 Expulsion')
                        .addFields(
                            { name: '👮 Expulsé par', value: 'Modération automatique' },
                            { name: '🗒️ Raison', value: 'Automatique' }
                        )
                        .setThumbnail(message.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        .setFooter({
                            text: message.author.tag,
                            iconURL: message.author.displayAvatarURL({dynamic: true})
                        })
                ]}).catch(() => {
                    info(`\t${message.author.tag} (${message.author.id}) a été expulsé automatiquement car il a un score de signalement élevé, il n'a pas pu être averti en MP.`)
                    message.channel.send({ embeds: [
                            new MessageEmbed()
                                .setColor('#6fe153')
                                .setTitle('📤 Expulsion par le modérateur automatique')
                                .addFields(
                                    { name: '👤 Utilisateur', value: `<@${message.author.id}>`, inline: true },
                                    { name: '👮 Modérateur', value: `Modérateur automatique`, inline: true },
                                    { name: '🗒️ Raison', value: 'Automatique' }
                                )
                                .setTimestamp()
                                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                                .setFooter({
                                    text: message.author.tag,
                                    iconURL: message.author.displayAvatarURL({dynamic: true})
                                })
                        ]})
                })

            if(message.member.kickable) {
                await message.member.kick(`Automatique`)
            }else {
                message.channel.send(`**⚠️ | <@${message.guild.ownerId}>, le score de signalement de ${message.author.tag} est trop élevé, mais il est impossible de l'expulser.**`)
            }

        } else if (user.reportScore >= 60) {
            try {
                await message.member.send({ embeds: [
                        new MessageEmbed()
                            .setColor('#d84141')
                            .setTitle('📤 Bannissement par le modérateur automatique')
                            .addFields(
                                { name: '👮 Banni par', value: 'Modérateur automatique' },
                                { name: '🗒️ Raison', value: 'Automatique' }
                            )
                            .setThumbnail(message.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            .setFooter({
                                text: message.author.tag,
                                iconURL: message.author.displayAvatarURL({dynamic: true})
                            })
                    ]
                }).catch(() => {
                    info(`\t${message.author.tag} (${message.author.id}) a été banni automatiquement car il a un score de signalement élevé, il n'a pas pu être averti en MP.`)
                })
            } catch (e) {

            }

            message.channel.send({ embeds: [
                    new MessageEmbed()
                        .setColor('#d84141')
                        .setTitle('📤 Bannissement par le modérateur automatique')
                        .addFields(
                            { name: '👤 Utilisateur', value: `<@${message.author.id}>`, inline: true },
                            { name: '👮 Modérateur', value: `Modérateur automatique`, inline: true },
                            { name: '🗒️ Raison', value: 'Automatique' }
                        )
                        .setTimestamp()
                        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                        .setFooter({
                            text: message.author.tag,
                            iconURL: message.author.displayAvatarURL({dynamic: true})
                        })
                ]})

            if (message.member.bannable) {
                await message.member.ban({
                    reason: 'Automatique'
                })
            } else {
                message.channel.send(`**⚠️ | <@${message.guild.ownerId}>, le score de signalement de ${message.author.tag} est trop élevé, mais il est impossible de le bannir.**`)
            }

            await User.deleteOne({
                id: message.author.id
            })
        }
    })
}

module.exports = {
    check
}
