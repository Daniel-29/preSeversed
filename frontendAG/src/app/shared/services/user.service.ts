import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { UserState } from '../interfaces/data.interface';
import { take, tap } from 'rxjs/operators';
import * as profileUserSlice from '@shared/slice/user.slice';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apollo: Apollo,
    private route: Router,
    private readonly store: Store<{}>,
  ) { }
  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );
  getDataUser(IdUser: string, toHome: boolean): void {
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
        }
      }).valueChanges.pipe(take(1), tap(({ data }) => {
        const userIns: UserState = {
          id: '',
          email: data.user.email,
          username: data.user.username,
          display_name: data.user.display_name,
          image: data.user.image,
          description: data.user.description,
          following: '',
          followers: '',
        }
        this.store.dispatch(profileUserSlice.setUser(userIns));
        if (toHome) {
          this.route.navigate(['/home']);
        }
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
        this.store.dispatch(profileUserSlice.setFollowingUser(data.countFollowings));
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
        this.store.dispatch(profileUserSlice.setFollowersUser(data.countFollowings));
      }, (error) => {
        console.log('there was an error sending the query', error);
      })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
}
