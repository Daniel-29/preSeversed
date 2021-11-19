const { GraphQLList, GraphQLString } = require("graphql");
const {  NotificationType } = require('../types');
const { Notification} = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');

const notifications = {
  type: new GraphQLList(NotificationType),
  description: "Retrieves list of users",
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    return Notification.find()
  },
}
const noti = {
  type: NotificationType,
  description: "Retrieves one user",
  args: { id: { type: GraphQLString } },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    let rules = {
      id: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! noti')
    }
    return Notification.findById(args.id)
  },
}

const notificationsByUser = {
  type: new GraphQLList(NotificationType),
  description: "Retrieves list of users",
  args: { 
    user_Owner: { type: GraphQLString } ,
    page: { type: GraphQLString } 
  },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    } 
    args.user_Owner = decrypt(args.user_Owner);
    let rules = {
      user_Owner: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! notificationsByUser')
    }
    const noti   = Notification.find({user_Owner:args.user_Owner}).sort({"_id": -1}).skip(args.page*10).limit(10)
    return noti;
  },
}

module.exports = { notifications, noti, notificationsByUser }
