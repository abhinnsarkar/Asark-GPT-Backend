const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    messages: [{ user: String, ai: String }],
});

module.exports = Chat = mongoose.model("chat", ChatSchema);
// const ChatSchema = new Schema({
//     text: String,
//     fromUser: Boolean,
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: "user",
//     },
// });

// const Chat = mongoose.model("Chat", ChatSchema);
