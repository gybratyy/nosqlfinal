const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;

