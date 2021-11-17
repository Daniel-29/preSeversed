const { GraphQLList, GraphQLString } = require("graphql");
const { UserType } = require('../types');
const { User } = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');

const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves list of users",
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    return User.find()
  },
}
const user = {
  type: UserType,
  description: "Retrieves one user",
  args: { id: { type: GraphQLString } },
  async resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    let idDecrypted = decrypt(args.id);
    let rules = {
      id: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! user')
    }
    var userFound = await User.findById(idDecrypted);
    userFound._id = encrypt(userFound._id);
    return userFound
  },
}

module.exports = { users, user }
