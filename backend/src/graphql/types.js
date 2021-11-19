const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql")
const { encrypt,decrypt } = require("../middleware/rsa")

const { User, Post, Notification, Message, Like, Follows, Comment, Chat } = require("../models")

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    display_name: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    image: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const FollowingType = new GraphQLObjectType({
  name: "Following",
  description: "Following type",
  fields: () => ({
    id: { type: GraphQLString },
    user_Owner: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.owner);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
    user_follwing: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.user_follwing);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
  }),
});

const NotificationType = new GraphQLObjectType({
  name: "Notification",
  description: "Notification type",
  fields: () => ({
    id: { type: GraphQLString },
    unicodeNoti: { type: GraphQLString },
    user_Owner: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.user_Owner);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
    user_Writer: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.user_Writer);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
  }),
});

const ChatType = new GraphQLObjectType({
  name: "Chat",
  description: "Chat type",
  fields: () => ({
    id: { type: GraphQLString },
    user_Owner: { type: GraphQLString },
    user_Chat: { type: GraphQLString },
    chatcode: { type: GraphQLString },
  }),
});
const ChatTypeHelper = new GraphQLObjectType({
  name: "ListChat",
  description: "Chat type",
  fields: () => ({
    id: { type: GraphQLString },
    user_Owner: { type: GraphQLString },
    user_Chat: {
      type: UserType,
      async resolve(parent, args) {
        return User.findById(parent.user_Chat);
      }
    },
    chatcode: { type: GraphQLString },
  }),
});

const MessageType = new GraphQLObjectType({
  name: "Message",
  description: "Message type",
  fields: () => ({
    id: { type: GraphQLString },
    message: { type: GraphQLString },
    chatcode: { type: GraphQLString },
    user_Owner: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.user_Owner);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post type",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    image: { type: GraphQLString },
    nLike: { type: GraphQLString },
    nComment: { type: GraphQLString },
    tags: { type: GraphQLString },
    user_Owner: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.user_Owner);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
  }),
});

const PostTypeALl = new GraphQLObjectType({
  name: "Post",
  description: "Post type",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    image: { type: GraphQLString },
    nLike: { type: GraphQLString },
    nComment: { type: GraphQLString },
    tags: { type: GraphQLString },
    user_Owner: {
      type: LikeType,
      resolve(parent, args) {
        return Like.find({})
      }
    },
    user_Owner: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.user_Owner);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "Comment type",
  fields: () => ({
    id: { type: GraphQLString },
    body: { type: GraphQLString },
    post_Owner: {
      type: PostType,
      resolve(parent, args) {
        return Post.findById(parent.post_Owner)
        
      }
    },
    user_Action: {
      type: UserType,
      async resolve(parent, args) {
        return User.findById(parent.user_Action);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
  }),
});

const LikeType = new GraphQLObjectType({
  name: "Like",
  description: "Like type",
  fields: () => ({
    id: { type: GraphQLString },
    like: { type: GraphQLString },
    post_Owner: {
      type: PostType,
      resolve(parent, args) {
        return Post.findById(parent.post_Owner)
      }
    },
    user_Action: {
      type: UserType,
      async resolve(parent, args) {
        var usDat = await User.findById(parent.user_Action);
        usDat = usDat.toObject();
        usDat.password = "";
        var temp = encrypt(usDat._id);
        usDat._id = "";
        usDat.id = temp;
        return usDat
      }
    },
  }),
});

module.exports = {
  UserType,
  FollowingType,
  NotificationType,
  ChatType,
  MessageType,
  PostType,
  CommentType,
  LikeType,
  ChatTypeHelper,
}
