export interface APIResponse<T> {
  results: T;
}

export interface DataResponse {
  notificationsByUser: APIResponse<Notifications[]>;
  postsByUser: APIResponse<PostbyUser[]>;
  FollowingByUser: APIResponse<UserChatInterface[]>;
  TagsPost: APIResponse<TrendingTags[]>;
}
/*
export interface Episode {
  name: string;
  episode: string;
}

export interface token {
  login: string;
}
 
export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  isFavorite?: boolean;
}
 */

export interface UserInterface {
  id: string,
  token: string,
  email: string,
  username: string
  display_name: string
  password: string,
  image: string,
  description: string,
}

export interface TrendingTags {
  tags: string,
}

export interface apiState {
  TrendsisLoading: boolean,
  TrendsPage: string,
  MessagesisLoading: boolean,
  MessagesPage: string,
  NotificationsisLoading: boolean,
  Chatcode: string,
  NotificationsPage: string,
  ProfilePostisLoading: boolean,
  ProfilePostPage: string,
  ProfilePostIdUser: string,
  PostisLoading: boolean,
  PostPage: string,
  ContactsisLoading: boolean,
  ContactsPage: string,
}

export interface MessagesOfChat {
  id: string,
  message: string,
  user_Owner: {
    id: string,
    username: string,
    display_name: string,
    image: string,
  }
}

export interface UserChatInterface {
  id: string,
  chatcode: string,
  user_Chat: {
    id: string,
    username: string,
    display_name: string,
    image: string,
  }
}
export interface PostbyUser {
  id: string,
  title: string,
  body: string,
  image: string,
  nLike: string,
  nComment: string,
  tags: string,
}
export interface PostFeed {
  id: string,
  title: string,
  body: string,
  image: string,
  nLike: string,
  nComment: string,
  tags: string,
  user_Owner:{
    id: string,
    username: string,
    display_name: string,
    image: string,
  }
}

export interface Notifications {
  id: string,
  unicodeNoti: string,
  user_Writer: {
    id: string,
    username: string,
    display_name: string,
    image: string,
  },
}
export interface CommentsbyPost {
  id: string,
  body: string,
  user_Action: {
    id: string,
    image: string,
    username: string,
  },
}

export interface UserState {
  id: string,
  email: string,
  username: string
  display_name: string
  image: string,
  description: string,
  following: string,
  followers: string,
}