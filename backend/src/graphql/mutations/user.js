const { UserType } = require('../types')
const { User } = require('../../models')
const { GraphQLString } = require('graphql')
let Validator = require('validatorjs');
const { createJwtToken } = require('../../middleware/auth')
const { encrypt, decrypt } = require('../../middleware/rsa')
const { encryptCrypto, decryptCrypto } = require('../../middleware/crypto')

const register = {
    type: GraphQLString,
    description: "Register new user",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        let rules = {
            username: 'required|min:5',
            email: 'required|email',
            password: 'required|string|min:8'
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        args.password = encryptCrypto(args.password);
        const { username, password, email } = args;
        const display_name = username;
        const image = 'a78d2752810dc21b85537834903d1adf', description = '-';
        const userData = new User({ username, display_name, password, email, image, description })
        await userData.save()
        const token = createJwtToken({
            "_id": encrypt(userData._id),
        })
        context.res.cookie("token", token)
        return token
    },
}


const login = {
    type: GraphQLString,
    description: "Login user",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        let rules = {
            email: 'required|email',
            password: 'required|string|min:8'
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const userData = await User.findOne({ email: args.email }).select("+password");
        console.log(decryptCrypto(userData.password));
        const decrypted = decryptCrypto(userData.password);
        if (args.password !== decrypted) {
            throw new Error("Invalid credentials ")
        }
        const token = createJwtToken({
            "_id": encrypt(userData._id),
        })
        //context.res.cookie("token", token)
        return token
    },
}
const updateUser = {
    type: UserType,
    description: "Update user Data",
    args: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        display_name: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        description: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        args.id = decrypt(args.id)
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|min:24|max:24',
            username: 'required|min:5',
            display_name: 'required|string|min:1',
            password: 'required|min:8',
            email: 'required|email',
            description: 'required|string|min:1'
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const passValidation = await User.findOne({_id: args.id}).select("+password");
        if(decryptCrypto(passValidation.password )!== args.password){
            throw new Error("Invalid credentials")
        }
        args.password=encryptCrypto(args.password)
        const userUpdate = await User.findOneAndUpdate(
            {
                _id: args.id
            },
            args,
            {
                new: true,
                runValidators: true,
            }
        )
        if (!userUpdate) {
            throw new Error("No user with the given ID ")
        }
        return userUpdate
    },
}
const updateUserPhoto = {
    type: UserType,
    description: "Update user Data",
    args: {
        id: { type: GraphQLString },
        password: { type: GraphQLString },
        image: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        args.id = decrypt(args.id)
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|min:24|max:24',
            password: 'required|min:8',
            image: 'required|string',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const passValidation = await User.findOne({_id: args.id}).select("+password");
        if(decryptCrypto(passValidation.password )!== args.password){
            throw new Error("Invalid credentials")
        }
        args.password=encryptCrypto(args.password)
        const userUpdate = await User.findOneAndUpdate(
            {
                _id: args.id,
            },
            args,
            {
                new: true,
                runValidators: true,
            }
        )
        if (!userUpdate) {
            throw new Error("No user with the given ID ")
        }
        return userUpdate
    },
}
const updatePassword = {
    type: UserType,
    description: "Update user password",
    args: {
        id: { type: GraphQLString },
        new_password: { type: GraphQLString },
        old_password: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        args.id = decrypt(args.id)
        if (!context.req.verifiedUser) {
            throw new Error("Unauthorized")
        }
        let rules = {
            id: 'required|min:24|max:24',
            new_password: 'required|min:8',
            old_password: 'required|min:8',
        };
        let validation = new Validator(args, rules);
        if (validation.fails()) {
            throw new Error('Invalid arguments validation no pass!')
        }
        const passValidation = await User.findOne({_id: args.id}).select("+password");
        console.log(decryptCrypto(passValidation.password ));
        if(decryptCrypto(passValidation.password )!== args.old_password){
            throw new Error("Invalid credentials")
        }
        const userUpdate = await User.findOneAndUpdate(
            {
                _id: args.id
            },
            { password: encryptCrypto(args.new_password) },
            {
                new: true,
                runValidators: true,
            }
        )
        if (!userUpdate) {
            throw new Error("No user with the given ID ")
        }
        return userUpdate
    },
}

module.exports = {
    register,
    login,
    updateUser,
    updatePassword,
    updateUserPhoto,
}
