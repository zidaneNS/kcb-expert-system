const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sympthomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    sympthoms: [String],
    treatment: [String]
});

module.exports = mongoose.model('Sympthoms', sympthomSchema);