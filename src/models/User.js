const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Expert: Number,
        Dev: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: [String]
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);