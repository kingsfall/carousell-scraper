const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    searchParameter: {
        type: String,
        required: true
    },
    keyword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Posts', PostSchema)