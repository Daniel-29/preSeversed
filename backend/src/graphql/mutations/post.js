const { PostType } = require('../types')
const { Post } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const {encrypt,decrypt} = require('../../middleware/rsa')

const addPost = {
    type: PostType,
    description: "Create new post",
    args: {
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        image: { type: GraphQLString },
        nLike: { type: GraphQLString },
        nComment: { type: GraphQLString },
        tags: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
    },
    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.user_Owner=decrypt(args.user_Owner);
        let rules = {
            title: 'required|min:1',
            body: 'required|min:1',
            nLike: 'required',
            tags: 'required',
            user_Owner: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const postAdd = new Post(args);
        return postAdd.save()
    },
}

const updatePost = {
    type: PostType,
    description: "Update blog post",
    args: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        image: { type: GraphQLString },
        nLike: { type: GraphQLString },
        nComment: { type: GraphQLString },
        tags: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|string|min:24',
            title: 'required|min:1',
            body: 'required|min:1',
            image: '',
            nLike: 'required',
            tags: 'required',
            user_Owner: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const postUpdated = await Post.findOneAndUpdate(
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

        if (!postUpdated) {
            throw new Error("No post with the given ID found for the author")
        }

        return postUpdated
    },
}

const deletePost = {
    type: GraphQLString,
    description: "Delete post",
    args: {
        id: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.id = decrypt(args.id);
        let rules = {
            id: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const postDeleted = await Post.findOneAndDelete({
            _id: args.id,
            user_Owner: context.req.verifiedUser._id,
        })
        if (!postDeleted) {
            throw new Error("No post with the given ID found for the author")
        }

        return "Post deleted"
    },
}


module.exports = {
    addPost,
    updatePost,
    deletePost,
}
