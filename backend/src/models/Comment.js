const mongoose = require("mongoose")

const comment_Schema = new mongoose.Schema(
    {
        body: {
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

module.exports = mongoose.model("comment", comment_Schema)
