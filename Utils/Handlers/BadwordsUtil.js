/*
    Badwords handler utility
    discord.js@13.6.0
 */
const { Badwords } = require('../../Models/index')
const Logger = require('../Logger')

module.exports = async client => {
    const badwords = await Badwords.find({})

    client.badwords.clear()

    badwords.forEach(badword => {
        if (!badword.word || !badword.severity) {
            Logger.warn(`\tAn badword has no word or severity`)
        }

        client.badwords.set(badword.word, badword.severity)
        Logger.badwords(`\tAdded badword: ${badword.word} with severity: ${badword.severity}`)
    })
}