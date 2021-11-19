import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CookieService } from 'ngx-cookie-service';
import { createSelector, select, Store } from '@ngrx/store';
import { UserInterface, UserState } from '@app/shared/interfaces/data.interface';
import { UserService } from '@app/shared/services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, pipe, Subscription } from 'rxjs';
import { map, filter, take, tap } from 'rxjs/operators';
import * as profileUserSlice from '@shared/slice/user.slice';
import * as apiHelperSlice from '@shared/slice/api.slice';
import { PostService } from '@app/shared/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  idUser!:string;
  username!: string;
  display_name!: string;
  image!: string;
  post$ = this.postService.postFeed$;
  page!:string;
  private stateObserver!: Subscription;
  private stateObserverAPI!: Subscription;
  constructor(
    private apollo: Apollo,
    private readonly store: Store<{}>,
    private postService: PostService,
  ) { }

  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );
  apiHelperSlice$ = this.store.select(
    createSelector(apiHelperSlice.selectFeature, (state) => state)
  );

  ngOnInit(): void {
    const helper = new JwtHelperService();
    this.stateObserver = this.UserSlice$.pipe(tap(data=>{
      this.idUser=data.id;
      this.username = data.username;
      this.display_name = data.display_name;
      this.image = data.image
    })).subscribe();
    
    this.stateObserverAPI = this.apiHelperSlice$.pipe(tap(data=>{
      this.page= data.PostPage;
      if(!data.PostisLoading){ 
        this.store.dispatch(apiHelperSlice.setPostisLoading(true));
        this.postService.getPostFeedData('',this.page,false);
      }
    })).subscribe();
  }
  ngOnDestroy() {
    this.stateObserver.unsubscribe();
    this.stateObserverAPI.unsubscribe();
  }
  onMoreData() {
    this.page = (Number(this.page)+1).toString();
    this.store.dispatch(apiHelperSlice.setPostPage(this.page));
    this.postService.getPostFeedData('',this.page,false);
  }

}
