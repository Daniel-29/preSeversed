const { NotificationType } = require('../types')
const { Notification } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const {encrypt,decrypt} = require('../../middleware/rsa')

const addNoti = {
    type: NotificationType,
    description: "Create new Notify",
    args: {
        unicodeNoti: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
        user_Writer: { type: GraphQLString },
    },
    resolve(parent, args, context) {
        args.user_Owner=decrypt(args.user_Owner);
        args.user_Writer=decrypt(args.user_Writer);
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            unicodeNoti: 'required|string|min:1',
            user_Owner: 'required|string|min:24',
            user_Writer: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const NotificationAdd = new Notification(args);
        return NotificationAdd.save()
    },
}

const updateNoti = {
    type: NotificationType,
    description: "Update Notify",
    args: {
        id: { type: GraphQLString },
        unicodeNoti: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
        user_Writer: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.user_Owner=decrypt(args.user_Owner);
        args.user_Writer=decrypt(args.user_Writer);
        let rules = {
            id: 'required|string|min:24',
            unicodeNoti: 'required|string|min:1',
            user_Owner: 'required|string|min:24',
            user_Writer: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const NotiUpdated = await Notification.findOneAndUpdate(
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

        if (!NotiUpdated) {
            throw new Error("No Notify with the given ID found for the author")
        }

        return NotiUpdated
    },
}

const deleteNoti = {
    type: GraphQLString,
    description: "Delete Noti",
    args: {
        id: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.user_Owner=decrypt(args.user_Owner);
        let rules = {
            id: 'required|string|min:24',
            user_Owner: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const NotiDeleted = await Notification.findOneAndDelete({
            _id: args.id,
            user_Owner: context.req.verifiedUser._id,
        })
        if (!NotiDeleted) {
            throw new Error("No No1ti with the given ID found for the author")
        }

        return "Notify deleted"
    },
}


module.exports = {
    addNoti,
    updateNoti,
    deleteNoti,
}
