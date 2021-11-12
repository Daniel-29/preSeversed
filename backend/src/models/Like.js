const mongoose = require("mongoose")

const like_Schema = new mongoose.Schema(
    {
        like: {
            type: String,
            required: true,
        },
        post_Owner: {
            type: String,
            required: true,
        },
        user_Action: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
)

module.exports = mongoose.model("like", like_Schema)
