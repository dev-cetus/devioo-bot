const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    reports: {
        type: [Number]
    },
    msgReports: [
        {
            msgID: Number,
            channelID: Number,
            authorID: Number,
            msg: String,
            date: Number
        }
    ],
    autoReports: [
        {
            reason: String,
            date: {
                type: Number,
                default: Date.now
            }
        }
    ],
    reportScore: {
        type: Number,
        default: 0
    },
    warns: [
        {
            reason: String,
            severity: Number,
            date: {
                type: Number,
                default: Date.now
            }
        }
    ],
    level: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema);
