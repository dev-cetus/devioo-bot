const {User} = require('../Models')
const {info} = require("./Logger");
const client = require('../index');

module.exports = {
    async warn(id, reason = "No reason provided", severity = 5) {
        await User.findOneAndUpdate({
            id: id
        }, {
            $push: {
                warns: {
                    reason: reason,
                    severity: severity,
                }
            }
        }).then(() => {
            info(`Warned user ${id} for ${reason}`)
            client.emit('warn', id, reason, severity)
        })
    },

    async getWarns(id) {
        return await User.findOne({
            id: id
        }).then(user => {
            return user.warns
        })
    }
}
