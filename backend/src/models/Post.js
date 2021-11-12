const mongoose = require("mongoose")

const post_Schema = new mongoose.Schema(
    {

        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        nLike: {
            type: String,
            required: false,
        },
        nComment: {
            type: String,
            required: false,
        },
        tags: {
            type: String,
            required: false,
        },
        user_Owner: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
)

module.exports = mongoose.model("post", post_Schema)
