const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { CommentType } = require('../types');
const { Comment } = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');

const comments = {
    type: new GraphQLList(CommentType),
    description: "Retrieves list of users",
    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        return Comment.find();
    },
}
const comment = {
    type: CommentType,
    description: "Retrieves one user",
    args: { id: { type: GraphQLID } },

    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        return Comment.findById(args.id);
    },
}
const commentsByPost = {
    type: new GraphQLList(CommentType),
    description: "Retrieves list of users",
    args: {
        post_Owner: { type: GraphQLString },
        page: { type: GraphQLString },
    },
    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.post_Owner = decrypt(args.post_Owner);
        let rules = {
            post_Owner: 'required|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass! commentsByPost')
        }
        return Comment.find({ post_Owner: args.post_Owner }).skip(args.page * 10).limit(10);
    },
}

module.exports = { comments, comment, commentsByPost }
