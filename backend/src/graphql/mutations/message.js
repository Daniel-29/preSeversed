const { MessageType } = require('../types')
const { Notification, Message, Chat } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const {encrypt,decrypt} = require('../../middleware/rsa')

const addMessage = {
    type: MessageType,
    description: "Create new Message",
    args: {
        message: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
        chatcode: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        args.user_Owner = decrypt(args.user_Owner)
        args.chatcode = decrypt(args.chatcode)
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            message: 'required|min:1',
            user_Owner: 'required|min:24',
            chatcode: 'required|string|min:48',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        let UserReceiber = await Chat.findOne({ user_Owner: args.user_Owner, chatcode: args.chatcode })
        const NotificationAdd = new Notification({
            unicodeNoti: "6",
            user_Owner: UserReceiber.user_Chat,
            user_Writer: args.user_Owner,
        });
        await NotificationAdd.save();
        const MessageAdd = new Message(
            {
                message: args.message,
                user_Owner: args.user_Owner,
                chatcode: args.chatcode,
            }
        );
        return MessageAdd.save()
    },
}

const updateMessage = {
    type: MessageType,
    description: "Update Message",
    args: {
        id: { type: GraphQLString },
        message: { type: GraphQLString },
        users_Chatcode: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|min:24',
            message: 'required|min:1',
            user_Owner: 'required|min:24',
            chatcode: 'required|string|min:48',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const MessageUpdated = await Message.findOneAndUpdate(
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

        if (!MessageUpdated) {
            throw new Error("No Message with the given ID found for the author")
        }

        return MessageUpdated
    },
}

const deleteMessage = {
    type: GraphQLString,
    description: "Delete Message",
    args: {
        id: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const MessageDeleted = await Message.findOneAndDelete({
            _id: args.id,
        })
        if (!MessageDeleted) {
            throw new Error("No Message with the given ID found for the author")
        }

        return "Message deleted"
    },
}


module.exports = {
    addMessage,
    updateMessage,
    deleteMessage,
}
