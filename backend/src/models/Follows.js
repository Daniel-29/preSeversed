const mongoose = require("mongoose")

const follows_Schema = new mongoose.Schema(
    {
        user_Owner: {
            type: String,
            required: true,
        },
        user_follwing: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("follows", follows_Schema)
