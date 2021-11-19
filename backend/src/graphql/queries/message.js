const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { MessageType } = require('../types');
const { Message } = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');


const messages = {
    type: new GraphQLList(MessageType),
    description: "Retrieves list of users",
    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        return Message.find()
    },
}
const message = {
    type: MessageType,
    description: "Retrieves one user",
    args: { id: { type: GraphQLID } },

    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }        
        let rules = {
            id: 'required|min:24',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass! message')
        }
        return Message.findById(args.id)
    },
}
const messagesByChat = {
    type: new GraphQLList(MessageType),
    description: "Retrieves list of users",
    args: {
        chatcode: { type: GraphQLString },
        page: { type: GraphQLString }
    },
    resolve(parent, args, context) {
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        args.chatcode = decrypt(args.chatcode)
        let rules = {
            chatcode: 'required|min:48',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass! messagesByChat')
        }
        return Message.find({ chatcode: args.chatcode }).sort({ "_id": -1 }).skip(args.page * 12).limit(12);
    },
}

module.exports = { messages, message, messagesByChat }
