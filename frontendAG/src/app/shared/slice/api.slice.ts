import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFeatureSelector } from '@ngrx/store';
import { apiState } from '../interfaces/data.interface';

const apiHelperSlice = createSlice({
    name: 'rest-helpers',
    initialState: {
        TrendsisLoading: false,
        TrendsPage: '0',
        MessagesisLoading: false,
        Chatcode: '',
        MessagesPage: '0',
        NotificationsisLoading: false,
        NotificationsPage: '0',
        ProfilePostisLoading: false,
        ProfilePostPage: '0',
        ProfilePostIdUser: '',
        PostisLoading: false,
        PostPage: '0',
        ContactsisLoading: false,
        ContactsPage: '0',
    },
    reducers: {
        setTrendsisLoading: (state, action: PayloadAction<boolean>) => {
            state.TrendsisLoading = action.payload;
        },
        setTrendsPage: (state, action: PayloadAction<string>) => {
            state.TrendsPage = action.payload;
        },
        setMessagesisLoading: (state, action: PayloadAction<boolean>) => {
            state.MessagesisLoading = action.payload;
        },
        setChatcode: (state, action: PayloadAction<string>) => {
            state.Chatcode = action.payload;
        },
        setMessagesPage: (state, action: PayloadAction<string>) => {
            state.MessagesPage = action.payload;
        },
        setNotificationsisLoading: (state, action: PayloadAction<boolean>) => {
            state.NotificationsisLoading = action.payload;
        },
        setNotificationsPage: (state, action: PayloadAction<string>) => {
            state.NotificationsPage = action.payload;
        },
        setProfilePostisLoading: (state, action: PayloadAction<boolean>) => {
            state.ProfilePostisLoading = action.payload;
        },
        setProfilePostPage: (state, action: PayloadAction<string>) => {
            state.ProfilePostPage = action.payload;
        },
        setProfilePostIdUser: (state, action: PayloadAction<string>) => {
            state.ProfilePostIdUser = action.payload;
        },
        setPostisLoading: (state, action: PayloadAction<boolean>) => {
            state.PostisLoading = action.payload;
        },
        setPostPage: (state, action: PayloadAction<string>) => {
            state.PostPage = action.payload;
        },
        setContactsisLoading: (state, action: PayloadAction<boolean>) => {
            state.ContactsisLoading = action.payload;
        },
        setContactsPage: (state, action: PayloadAction<string>) => {
            state.ContactsPage = action.payload;
        },    
        resetDataAPI: (state) => {
            state.TrendsisLoading =false;
            state.TrendsPage= '0';
            state.MessagesisLoading= false;
            state.Chatcode='';
            state.MessagesPage= '0';
            state.NotificationsisLoading= false;
            state.NotificationsPage= '0';
            state.ProfilePostisLoading= false;
            state.ProfilePostPage= '0';
            state.ProfilePostIdUser='';
            state.PostisLoading= false;
            state.PostPage= '0';
            state.ContactsisLoading= false;
            state.ContactsPage='0';
          },
    },
});


const {
    reducer,
    actions: {
        setTrendsisLoading, setTrendsPage,
        setMessagesisLoading, setMessagesPage,setChatcode,
        setNotificationsisLoading, setNotificationsPage,
        setProfilePostisLoading, setProfilePostPage,setProfilePostIdUser,
        setPostisLoading, setPostPage,
        setContactsisLoading,setContactsPage,
        resetDataAPI,
    },
    name,
} = apiHelperSlice;

export default apiHelperSlice.reducer;
export {
    name,
    setTrendsisLoading, setTrendsPage,
    setMessagesisLoading, setMessagesPage,setChatcode,
    setNotificationsisLoading, setNotificationsPage,
    setProfilePostisLoading, setProfilePostPage,setProfilePostIdUser,
    setPostisLoading, setPostPage,
    setContactsisLoading,setContactsPage,
    resetDataAPI
};

export const selectFeature =
    createFeatureSelector<ReturnType<typeof reducer>>(name);

