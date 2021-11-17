import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFeatureSelector } from '@ngrx/store';
import { UserState } from '../interfaces/data.interface';

const userProfileSlice = createSlice({
  name: 'user-profile',
  initialState: {
    id: '',
    email: '',
    username: '',
    display_name: '',
    image: '',
    description: '',
    following: '',
    followers: '',
  },
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      //state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.display_name = action.payload.display_name;
      state.image = action.payload.image;
      state.description = action.payload.description;
      state.following = action.payload.following;
      state.followers = action.payload.followers;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setFollowersUser: (state, action: PayloadAction<string>) => {
      state.followers = action.payload;
    },
    setFollowingUser: (state, action: PayloadAction<string>) => {
      state.following = action.payload;
    },
    resetDataUser: (state) => {
      state.id ='';
      state.email ='';
      state.username ='';
      state.display_name ='';
      state.image ='';
      state.description ='';
      state.following ='';
      state.followers ='';
    },
  },
});


const {
  reducer,
  actions: { setUser, setId, setFollowersUser, setFollowingUser ,resetDataUser},
  name,
} = userProfileSlice;

export default userProfileSlice.reducer;
export { setUser, setId, name, setFollowersUser, setFollowingUser,resetDataUser };

export const selectFeature =
  createFeatureSelector<ReturnType<typeof reducer>>(name);

