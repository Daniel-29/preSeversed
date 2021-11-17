const { FollowingType } = require('../types')
const { Notification,Follows } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const { encrypt,decrypt } = require('../../middleware/rsa')

const addFollows = {
    type: FollowingType,
    description: "Create new Follows",
    args: {
        user_Owner: { type: GraphQLString },
        user_follwing: { type: GraphQLString },
    },
    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.user_Owner = decrypt(args.user_Owner);
        args.user_follwing = decrypt(args.user_follwing);
        let rules = {
            user_Owner: 'required|string|min:24',
            user_follwing: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const NotificationAdd = new Notification({
            unicodeNoti: "1",
            user_Owner: args.user_follwing,
            user_Writer: args.user_Owner,
        });
        NotificationAdd.save();
        const FollowsAdd = new Follows(args);
        return FollowsAdd.save()
    },
}

const updateFollows = {
    type: FollowingType,
    description: "Update Follows",
    args: {
        id: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
        user_follwing: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.user_Owner = decrypt(args.user_Owner);
        args.user_follwing = decrypt(args.user_follwing);
        let rules = {
            id: 'required|string|min:24',
            user_Owner: 'required|string|min:24',
            user_follwing: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const FollowsUpdated = await Follows.findOneAndUpdate(
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

        if (!FollowsUpdated) {
            throw new Error("No Follows with the given ID found for the author")
        }

        return FollowsUpdated
    },
}

const deleteFollows = {
    type: GraphQLString,
    description: "Delete Follows",
    args: {
        id: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
        user_follwing: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.user_Owner = decrypt(args.user_Owner);
        args.user_follwing = decrypt(args.user_follwing);
        let rules = {
            id: 'required|string|min:24',
            user_Owner: 'required|string|min:24',
            user_follwing: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const FollowsDeleted = await Follows.findOneAndDelete({
            _id: args.id,
        })
        const NotificationAdd = new Notification({
            unicodeNoti: "2",
            user_Owner: args.user_follwing,
            user_Writer: args.user_Owner,
        });
        NotificationAdd.save();
        if (!FollowsDeleted) {
            throw new Error("No Follows with the given ID found for the author")
        }

        return "Follows deleted"
    },
}


module.exports = {
    addFollows,
    updateFollows,
    deleteFollows,
}
