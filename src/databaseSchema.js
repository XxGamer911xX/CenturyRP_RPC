const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    server: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    port: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('CenturyData', schema, 'CenturyData');