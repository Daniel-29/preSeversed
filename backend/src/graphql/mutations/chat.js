const { ChatType } = require('../types')
const { Chat } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const { encrypt,decrypt } = require('../../middleware/rsa')

const addChat = {
    type: ChatType,
    description: "Create new Chat",
    args: {
        user_Owner: { type: GraphQLString },
        user_Chat: { type: GraphQLString },
        chatcode: { type: GraphQLString },
    },
    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.user_Owner = decrypt(args.user_Owner);
        args.user_Chat = decrypt(args.user_Chat);
        args.chatcode =  args.user_Owner+args.user_Chat;
        let rules = {
            user_Owner: 'required|string|min:24',
            user_Chat: 'required|string|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const ChatAdd = new Chat(args);
        return ChatAdd.save()
    },
}

const updateChat = {
    type: ChatType,
    description: "Update Chat",
    args: {
        id: { type: GraphQLString },
        user_Owner: { type: GraphQLString },
        user_Chat: { type: GraphQLString },
        chatcode: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|string|min:24',
            user_Owner: 'required|string|min:24',
            user_Chat: 'required|string|min:24',
            chatcode: 'required|string|min:48',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const ChatUpdated = await Chat.findOneAndUpdate(
            {
                _id: args.id,
            },
            args,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!ChatUpdated) {
            throw new Error("No Chat with the given ID found for the author")
        }

        return ChatUpdated
    },
}

const deleteChat = {
    type: GraphQLString,
    description: "Delete Chat",
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
        const ChatDeleted = await Chat.findOneAndDelete({
            _id: args.id,
        })
        if (!ChatDeleted) {
            throw new Error("No Chat with the given ID found for the author")
        }

        return "Chat deleted"
    },
}


module.exports = {
    addChat,
    updateChat,
    deleteChat,
}
