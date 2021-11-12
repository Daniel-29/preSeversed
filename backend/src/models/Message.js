const mongoose = require("mongoose")

const message_Schema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        chatcode: {
            type: String,
            required: true,
        },
        user_Owner: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
)

module.exports = mongoose.model("message", message_Schema)
