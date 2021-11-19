const { GraphQLList, GraphQLString } = require("graphql");
const { PostType } = require('../types');
const { Post } = require('../../models');
const { encrypt, decrypt } = require('../../middleware/rsa');
let Validator = require('validatorjs');

const posts = {
  type: new GraphQLList(PostType),
  description: "Retrieves list of users",
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    return Post.find()
  },
}

const post = {
  type: PostType,
  description: "Retrieves one user",
  args: {
    id: { type: GraphQLString }
  },

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
      throw new Error('Invalid arguments validation no pass! post')
    }
    return Post.findById(args.id)
  },
}

const postsByUser = {
  type: new GraphQLList(PostType),
  args: {
    id: { type: GraphQLString },
    page: { type: GraphQLString }
  },
  description: "Retrieves list of post owner user",
  async resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    args.id = decrypt(args.id);
    let rules = {
      id: 'required|min:24',
    };
    let validation = new Validator(args, rules);
    if (validation.fails()) {
      throw new Error('Invalid arguments validation no pass! postsByUser' )
    }
    var PostList = await Post.find({ user_Owner: args.id }).sort({ "_id": -1 }).skip(args.page * 8).limit(8);
    var POST_LIST = [];
    let i = 0;
    PostList = PostList.forEach(async (post) => {
     
      post = post.toObject();
      var temp = encrypt(post._id);
      post._id = "";
      post.id = temp;
      POST_LIST[i] = post;
      i++;
    });
    return POST_LIST
  },
}

const postsFeed = {
  type: new GraphQLList(PostType),
  args: {
    search: { type: GraphQLString },
    page: { type: GraphQLString },
  },
  description: "Retrieves list of post owner user",
  async resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    if (args.search === '') {
      var PostList = await Post.find().sort({ "_id": -1 }).skip(args.page * 8).limit(8);
      var POST_LIST = [];
      let i = 0;
      PostList = PostList.forEach(async (post) => {
       
        post = post.toObject();
        var temp = encrypt(post._id);
        post._id = "";
        post.id = temp;
        POST_LIST[i] = post;
        i++;
      });
      return POST_LIST
    } else {
      const reg = { $regex: '.*' + args.search + '.*', $options: 'i' };
      const filt = {
        //title: reg,
        body: reg
      }
      var PostList = await Post.find(filt).sort({ "_id": -1 }).skip(args.page * 8).limit(8);
      var POST_LIST = [];
      let i = 0;
      PostList = PostList.forEach(async (post) => {
       
        post = post.toObject();
        var temp = encrypt(post._id);
        post._id = "";
        post.id = temp;
        POST_LIST[i] = post;
        i++;
      });
      return POST_LIST
    }
  },
}

const tagsPost = {
  type: new GraphQLList(PostType),
  args: {
    tags: { type: GraphQLString },
    page: { type: GraphQLString },
  },
  description: "Retrieves list of post owner user",
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    if (args.tags === '') {
      return Post.find().sort({ "_id": -1 }).skip(args.page * 8).limit(8);
    } else {
      return Post.find({ tags: args.tags }).sort({ "_id": -1 }).skip(args.page * 8).limit(8);
    }
  },
}
const tagsPostTrending = {
  type: new GraphQLList(PostType),
  args: {
    page: { type: GraphQLString },
  },
  description: "Retrieves list of post owner user",
  resolve(parent, args, context) {
    if (!context.req.verifiedUser) {
      throw new Error("Unauthorized")
    }
    return Post.find().sort({ "_id": -1 }).skip(args.page * 8).limit(8);
  },
}

module.exports = { posts, post, postsByUser, tagsPost, tagsPostTrending, postsFeed }
