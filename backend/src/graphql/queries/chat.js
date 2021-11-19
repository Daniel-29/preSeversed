const { GraphQLList, GraphQLString } = require("graphql");
const { ChatType, ChatTypeHelper } = require('../types');
const { Chat } = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');

const chats = {
  type: new GraphQLList(ChatType),
  description: "Retrieves list of users",
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    return Chat.find()
  },
}
const chatByUser = {
  type: ChatType,
  description: "Retrieves list of users",
  args: {
    user_Owner: { type: GraphQLString },
    user_Chat: { type: GraphQLString },
  },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    args.user_Owner = decrypt(args.user_Owner);
    args.user_Chat = decrypt(args.user_Chat);
    let rules = {
      user_Owner: 'required|min:24',
      user_Chat: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! chatByUser')
    }
    return Chat.findOne(args)
  },
}

const userListChat = {
  type: new GraphQLList(ChatTypeHelper),
  description: "Retrieves list of users",
  args: {
    user_Owner: { type: GraphQLString },
    page: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    args.user_Owner = decrypt(args.user_Owner);
    let rules = {
      user_Owner: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! userListChat' )
    }
    var ChatList = await Chat.find({ user_Owner: args.user_Owner }).sort({ "_id": -1 }).skip(args.page * 8).limit(8);
    var CHAT_LIST = [];
    let i = 0;
    ChatList.forEach(async (chat) => {
      chat = chat.toObject();
      var temp = encrypt(chat.chatcode);
      chat._id = "";
      chat.id = temp;
      CHAT_LIST[i] = chat;
      i++;
    });
    return CHAT_LIST
  },
}

const chatsByUser = {
  type: ChatType,
  description: "Retrieves list of users",
  args: {
    user_Owner: { type: GraphQLString },
  },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    let rules = {
      user_Owner: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! chatsByUser')
    }
    return Chat.findOne(args)
  },/*  */
}
const chat = {
  type: ChatType,
  description: "Retrieves one user",
  args: {
    id: { type: GraphQLString }
  },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    let rules = {
      id: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! chat ')
    }
    return Chat.findById(args.id)
  },
}

module.exports = { chats, chat, chatsByUser, chatByUser, userListChat }
