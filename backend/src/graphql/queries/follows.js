const { GraphQLList, GraphQLString } = require("graphql");
const { FollowingType } = require('../types');
const { Follows } = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');

const follows = {
  type: new GraphQLList(FollowingType),
  description: "Retrieves list of FollowingType",
  args: {
    user_Owner: { type: GraphQLString },
    user_follwing: { type: GraphQLString },
  },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    let rules = {
      user_Owner: 'required|min:24',
      user_follwing: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! follows')
    }
    return Follows.find(args)
  },
}
const user_follwing = {
  type: new GraphQLList(FollowingType),
  description: "Retrieves list of FollowingType",
  args: {
    user_Owner: { type: GraphQLString },
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
      throw new Error('Invalid arguments validation no pass! user_follwing')
    }
    return Follows.find({ user_Owner: args.user_Owner }).sort({ "_id": -1 }).skip(args.page * 8).limit(8);
  },
}
const follow = {
  type: FollowingType,
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
      throw new Error('Invalid arguments validation no pass! follow' )
    }
    return Follows.findById(args.id)
  },
}
const followByUsers = {
  type: FollowingType,
  description: "Retrieves one user",
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
      user_Owner: 'required|min:24',
      user_follwing: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! followByUsers')
    }
    return Follows.findOne({ user_follwing: args.user_follwing, user_Owner: args.user_Owner })
  },
}
const countFollowers = {
  type: GraphQLString,
  description: "Retrieves count Followers by user",
  args: { id: { type: GraphQLString } },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    args.id = decrypt(args.id);
    let rules = {
      id: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! countFollowers')
    }
    return Follows.find({ user_follwing: args.id }).count();
  },
}
const countFollowings = {
  type: GraphQLString,
  description: "Retrieves count Followings by user",
  args: { id: { type: GraphQLString } },
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    args.id = decrypt(args.id);
    let rules = {
      id: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! countFollowings')
    }
    return Follows.find({ user_Owner: args.id }).count();
  },
}

module.exports = { follows, follow, countFollowings, countFollowers, followByUsers, user_follwing }
