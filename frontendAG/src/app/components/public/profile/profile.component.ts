import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserState } from '@app/shared/interfaces/data.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store, select } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserService } from '@app/shared/services/user.service';
import { PostService } from '@app/shared/services/post.service';
import { ActivatedRoute } from '@angular/router';
import * as profileUserSlice from '@shared/slice/user.slice';
import { createSelector } from '@reduxjs/toolkit';
import * as apiHelperSlice from '@shared/slice/api.slice';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  UserData!: UserState;
  private stateObserver!: Subscription;
  private stateObserverAPI!: Subscription;
  post$ = this.postService.postByUser$;
  isOwner: Boolean = false;
  IdUser!: string;
  IdUserProfile!: string;
  username!: string;
  display_name!: string;
  image!: string;
  description!: string;
  following!: string;
  followers!: string;
  page!:string;

  constructor(
    private apollo: Apollo,
    private readonly store: Store<{}>,
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
  ) { }
  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );
  apiHelperSlice$ = this.store.select(
    createSelector(apiHelperSlice.selectFeature, (state) => state)
  );
  ngOnInit(): void {
    this.stateObserver = this.UserSlice$.pipe(tap(data => {
      this.UserData = data;
    })).subscribe();
    
    this.route.params.pipe(
      take(1),
      tap(({ id }) => {
        this.IdUserProfile= id;
      })
    ).subscribe();
    /*  this.userService.getFollowersData(this.IdUser);
     this.userService.getFollowingData(this.IdUser);*/
   
    this.getDataUser(this.IdUserProfile);
    this.stateObserverAPI = this.apiHelperSlice$.pipe(tap(data=>{
      this.page= data.ProfilePostPage;
      if(!data.ProfilePostisLoading && data.ProfilePostIdUser != this.IdUserProfile){
        this.postService.clearPostByUserData();   
        this.store.dispatch(apiHelperSlice.setProfilePostIdUser(this.IdUserProfile));
        this.store.dispatch(apiHelperSlice.setProfilePostPage('0'));
        this.store.dispatch(apiHelperSlice.setProfilePostisLoading(true));
        this.postService.getPostByUserData(this.IdUserProfile,this.page);
      }else if(data.ProfilePostIdUser != this.IdUserProfile){
        this.postService.clearPostByUserData();   
        this.store.dispatch(apiHelperSlice.setProfilePostIdUser(this.IdUserProfile));
        this.store.dispatch(apiHelperSlice.setProfilePostPage('0'));
        this.store.dispatch(apiHelperSlice.setProfilePostisLoading(true));
        this.postService.getPostByUserData(this.IdUserProfile,this.page);
      }
    })).subscribe();
    this.getFollowersData(this.IdUserProfile);
    this.getFollowingData(this.IdUserProfile);
  }
  ngOnDestroy() {
    this.stateObserver.unsubscribe();
    this.stateObserverAPI.unsubscribe();
  }
  onMoreData() {
    this.page = (Number(this.page)+1).toString();
    this.store.dispatch(apiHelperSlice.setProfilePostPage(this.page));
    this.postService.getPostByUserData(this.IdUserProfile,this.page);
  }
  onMoreDataClear() {
    this.postService.clearPostByUserData();
  }

  getDataUser(IdUser: string): void {
    try {
      const GET_USER = gql`
      query Users($id:String!){
        user(id: $id){
          username
          email
          display_name
          password
          description
          image
        }
      }
      `;
      this.apollo.watchQuery<any>({
        query: GET_USER,
        variables: {
          id: IdUser
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1), tap(({ data }) => {
        if(this.UserData.username == data.user.username){
          this.isOwner=true;
        }
        this.username = data.user.username;
        this.display_name = data.user.display_name;
        this.image = data.user.image;
        this.description = data.user.description;
        //this.store.dispatch(setUser({ user: userIns }));
      }, (error) => {
        console.log('there was an error sending the query', error);
      })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  getFollowingData(IdUser: string): void {
    try {
      const countFollowings = gql`
      query countFollowings($id: String!) {
        countFollowings(id:$id)
      }
    `;
      this.apollo.watchQuery<any>({
        query: countFollowings,
        variables: {
          id: IdUser
        }
      }).valueChanges.pipe(take(1), tap(({ data }) => {
        this.following = data.countFollowings;
        //this.store.dispatch(setFollowingUser({ count: data.countFollowings }));
      }, (error) => {
        console.log('there was an error sending the query', error);
      })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  getFollowersData(IdUser: string): void {
    try {
      const countFollowers = gql`
      query countFollowers($id: String!) {
        countFollowers(id:$id)
      }
    `;
      this.apollo.watchQuery<any>({
        query: countFollowers,
        variables: {
          id: IdUser
        }
      }).valueChanges.pipe(take(1), tap(({ data }) => {
        this.followers = data.countFollowers;
        //this.store.dispatch(setFollowersUser({ count: data.countFollowers }));
      }, (error) => {
        console.log('there was an error sending the query', error);
      })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

}