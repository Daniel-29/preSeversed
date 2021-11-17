// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql")

//  // Import queries;
const { users, user } = require('./queries/user');
const { posts, post, postsByUser, tagsPost, tagsPostTrending, postsFeed } = require('./queries/post');
const { notifications, noti, notificationsByUser } = require('./queries/notification');
const { messages, message, messagesByChat } = require('./queries/message');
const { likes, like, likeToPostByUser } = require('./queries/like');
const { follows, follow, countFollowings, countFollowers, followByUsers, user_follwing } = require('./queries/follows');
const { comments, comment, commentsByPost } = require('./queries/comment');
const { chats, chat, chatsByUser, chatByUser, userListChat } = require('./queries/chat');
//  // Import mutations;
const { register, login, updateUser, updatePassword,updateUserPhoto } = require("./mutations/user");
const { addPost, updatePost, deletePost } = require('./mutations/post');
const { addNoti, updateNoti, deleteNoti } = require('./mutations/notification');
const { addMessage, updateMessage, deleteMessage } = require('./mutations/message');
const { addLike, updateLike, deleteLike } = require('./mutations/like');
const { addFollows, updateFollows, deleteFollows } = require('./mutations/follows');
const { addComment, updateComment, deleteComment } = require('./mutations/comment');
const { addChat, updateChat, deleteChat } = require('./mutations/chat');

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: {
    users, user,
    post, posts, postsByUser, tagsPost, tagsPostTrending, postsFeed,
    noti, notifications, notificationsByUser,
    message, messages, messagesByChat,
    like, likes, likeToPostByUser,
    follow, follows, countFollowings, countFollowers, followByUsers, user_follwing,
    comments, comment, commentsByPost,
    chats, chat, chatsByUser, chatByUser, userListChat
  },
})

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    register, login, updateUser, updatePassword,updateUserPhoto,
    addPost, updatePost, deletePost,
    addNoti, updateNoti, deleteNoti,
    addMessage, updateMessage, deleteMessage,
    addLike, updateLike, deleteLike,
    addFollows, updateFollows, deleteFollows,
    addComment, updateComment, deleteComment,
    addChat, updateChat, deleteChat,
  },
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
