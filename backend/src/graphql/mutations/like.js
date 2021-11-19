const { LikeType } = require('../types')
const { Post, Notification, Like } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const { encrypt,decrypt } = require('../../middleware/rsa')

const addLike = {
    type: LikeType,
    description: "Create new Like",
    args: {
        like: { type: GraphQLString },
        post_Owner: { type: GraphQLString },
        user_Action: { type: GraphQLString },
        nLikeCount: { type: GraphQLString },
        user_Post_Owner: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.post_Owner=decrypt(args.post_Owner);
        args.user_Action=decrypt(args.user_Action);
        args.user_Post_Owner=decrypt(args.user_Post_Owner);
        let rules = {
            like: 'required',
            post_Owner: 'required|string|min:24',
            user_Action: 'required|string|min:24',
            nLikeCount: 'required',
            user_Post_Owner: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        let nLikesGET = await Like.find({ post_Owner: args.post_Owner }).count();
        const post = await Post.findOneAndUpdate(
            {
                _id: args.post_Owner
            },
            {
                nLike: nLikesGET + 1
            },
            {
                new: true,
                runValidators: true,
            }
        )
        if (!post) {
            throw new Error("No Like with the given ID found for the author")
        }
        const NotificationAdd = new Notification({
            unicodeNoti: "3",
            user_Owner: args.user_Post_Owner,
            user_Writer: args.user_Action,
        });
        NotificationAdd.save();
        const LikeAdd = new Like({
            like: args.like,
            post_Owner: args.post_Owner,
            user_Action: args.user_Action
        });
        return LikeAdd.save()
    },
}

const updateLike = {
    type: LikeType,
    description: "Update Like",
    args: {
        id: { type: GraphQLString },
        Like: { type: GraphQLString },
        post_Owner: { type: GraphQLString },
        user_Action: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|string|min:24',
            Like: 'required',
            post_Owner: 'required|string|min:24',
            user_Action: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const LikeUpdated = await Like.findOneAndUpdate(
            {
                _id: args.id,
                user_Owner: context.req.verifiedUser._id,
            },
            args,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!LikeUpdated) {
            throw new Error("No Like with the given ID found for the author")
        }

        return LikeUpdated
    },
}

const deleteLike = {
    type: GraphQLString,
    description: "Delete Like",
    args: {
        id: { type: GraphQLString },
        post_Owner: { type: GraphQLString },
        nLikeCount: { type: GraphQLString },
        user_Post_Owner: { type: GraphQLString },
        user_Action: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        args.post_Owner=decrypt(args.post_Owner);
        args.user_Action=decrypt(args.user_Action);
        args.user_Post_Owner=decrypt(args.user_Post_Owner);
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|string|min:24',
            post_Owner: 'required|string|min:24',
            nLikeCount: 'required',
            user_Post_Owner: 'required|string|min:24',
            user_Action: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        let nLikesGET = await Like.find({ post_Owner: args.post_Owner }).count();
        const post = await Post.findOneAndUpdate(
            {
                _id: args.post_Owner
            },
            {
                nLike: nLikesGET - 1
            },
            {
                new: true,
                runValidators: true,
            }
        )
        const NotificationAdd = new Notification({
            unicodeNoti: "4",
            user_Owner: args.user_Post_Owner,
            user_Writer: args.user_Action,
        });
        NotificationAdd.save();
        if (!post) {
            throw new Error("No Like with the given ID found for the author")
        }
        const LikeDeleted = await Like.findOneAndDelete({
            _id: args.id,
        })
        if (!LikeDeleted) {
            throw new Error("No Like with the given ID found for the author")
        }

        return "Like deleted"
    },
}


module.exports = {
    addLike,
    updateLike,
    deleteLike,
}
