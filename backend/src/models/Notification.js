const mongoose = require("mongoose")

const notification_Schema = new mongoose.Schema(
    {
        unicodeNoti: {
            type: String,
            required: true,
        },
        user_Owner: {
            type: String,
            required: true,
        },
        user_Writer: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("notification", notification_Schema)
