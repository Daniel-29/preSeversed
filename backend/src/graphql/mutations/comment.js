const { CommentType } = require('../types')
const { Post, Notification, Comment } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const { encrypt,decrypt } = require('../../middleware/rsa')

const addComment = {
    type: CommentType,
    description: "Create new Comment",
    args: {
        body: { type: GraphQLString },
        post_Owner: { type: GraphQLString },
        user_Action: { type: GraphQLString },
        NComment: { type: GraphQLString },
        user_Post_Owner: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.post_Owner = decrypt(args.post_Owner);
        args.user_Action = decrypt(args.user_Action);
        args.user_Post_Owner = decrypt(args.user_Post_Owner);
        let rules = {
            body: 'required|min:1',
            post_Owner: 'required|string|min:24',
            user_Action: 'required|string|min:24',
            NComment: 'required',
            user_Post_Owner: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        let nLCommentGET = await Comment.find({ post_Owner: args.post_Owner }).count();
        const post = await Post.findOneAndUpdate(
            {
                _id: args.post_Owner
            },
            {
                nComment: nLCommentGET + 1
            },
            {
                new: true,
                runValidators: true,
            }
        )
        const NotificationAdd = new Notification({
            unicodeNoti: "5",
            user_Owner: args.user_Post_Owner,
            user_Writer: args.user_Action,
        });
        NotificationAdd.save();
        if (!post) {
            throw new Error("No Like with the given ID found for the author")
        }
        const CommentAdd = new Comment({
            body: args.body,
            post_Owner: args.post_Owner,
            user_Action: args.user_Action
        });
        return CommentAdd.save()
    },
}

const updateComment = {
    type: CommentType,
    description: "Update Comment",
    args: {
        id: { type: GraphQLString },
        body: { type: GraphQLString },
        post_Owner: { type: GraphQLString },
        user_Action: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|string|min:24',
            body: 'required|min:1',
            post_Owner: 'required|string|min:24',
            user_Action: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const CommentUpdated = await Comment.findOneAndUpdate(
            {
                id: args.id,
                user_Action: context.req.verifiedUser._id,
            },
            args,
            {
                new: true,
                runValidators: true,
            }
        )
        if (!CommentUpdated) {
            throw new Error("No Comment with the given ID found for the author")
        }

        return CommentUpdated
    },
}

const deleteComment = {
    type: GraphQLString,
    description: "Delete Comment",
    args: {
        id: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        let nLCommentGET = await Comment.find({ post_Owner: args.post_Owner }).count();
        const CommentDeleted = await Comment.findOneAndDelete({
            _id: args.id,
        })
        if (!CommentDeleted) {
            throw new Error("No Comment with the given ID found for the author")
        }

        return "Comment deleted"
    },
}


module.exports = {
    addComment,
    updateComment,
    deleteComment,
}
