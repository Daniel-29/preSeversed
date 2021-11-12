const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { LikeType } = require('../types');
const { Like } = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');

const likes = {
  type: new GraphQLList(LikeType),
  description: "Retrieves list of users",
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    return Like.find()
  },
}
const like = {
  type: LikeType,
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
      throw new Error('Invalid arguments validation no pass! like')
    }
    return Like.findById(args.id)
  },
}
const likeToPostByUser = {
  type: LikeType,
  description: "Retrieves one user",
  args: {
    post_Owner: { type: GraphQLString },
    user_Action: { type: GraphQLString },
  },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    args.post_Owner = decrypt(args.post_Owner);
    args.user_Action = decrypt(args.user_Action);
    let rules = {
      post_Owner: 'required|min:24',
      user_Action: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! likeToPostByUser')
    }
    return Like.findOne(args)
  },
}

module.exports = { likes, like, likeToPostByUser }
