const { User } = require("../Models/index")
const Index = require("../Resources/levels.json")

const client = require('../index')

class Level {
    constructor() {
        this.getUserData = this.getUserData.bind(this)
        this.updateUserXp = this.updateUserXp.bind(this)
        this.getLeaderboard = this.getLeaderboard.bind(this)
        this._getUserInDb = this._getUserInDb.bind(this)
    }

    async getUserData(userId) {
        const user = await this._getUserInDb(userId)

        const filter = Index.filter(el => el.xp <= user.xp);
        const level = filter[filter.length - 1];
        const nextLevel = Index[filter.indexOf(level) + 1];

        const leaderboard = await this.getLeaderboard();
        const place = leaderboard.find(el => el.id === parseInt(userId))
        const rank = leaderboard.indexOf(place)

        return {
            xp: user.xp,
            requiredXP: nextLevel.xp,
            level: level.level,
            rank: rank + 1
        }
    }

    async updateUserXp(userId, message) {
        const user = await this._getUserInDb(userId)

        user.xp += parseInt(message.content.length) / 4

        const filter = Index.filter(el => el.xp <= user.xp)
        const level = filter[filter.length - 1].level

        if (user.level !== level) {
            user.level = level;
            client.emit('levelUp', user);
        }

        await user.save()
    }

    async getLeaderboard() {
        return User.find().sort({
            xp: -1,
        });
    }

    async _getUserInDb(userId) {
        let user = await User.findOne({ id: userId });
        let infos = await client.users.fetch(userId)

        if (!user) {
            user = new User({
                id: userId,
                username: infos.username
            })

            await user.save()
        }

        return user
    }
}

module.exports = new Level();
