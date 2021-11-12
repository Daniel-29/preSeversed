const mongoose = require("mongoose")

const chat_Schema = new mongoose.Schema(
    {
        user_Owner: {
            type: String,
            required: false,
        },
        user_Chat: {
            type: String,
            required: false,
        },
        chatcode: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("chat", chat_Schema)
