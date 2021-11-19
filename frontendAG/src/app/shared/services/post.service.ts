import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { pluck, take, tap, withLatestFrom } from 'rxjs/operators';
import { PostbyUser, CommentsbyPost, TrendingTags, PostFeed } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private profilePostSubject = new BehaviorSubject<PostbyUser[]>([]);
  postByUser$ = this.profilePostSubject.asObservable();

  private commentsPostSubject = new BehaviorSubject<CommentsbyPost[]>([]);
  commentsByPost$ = this.commentsPostSubject.asObservable();

  private tagsSubject = new BehaviorSubject<TrendingTags[]>([]);
  tagsPost$ = this.tagsSubject.asObservable();

  private PostSubject = new Subject<PostbyUser>();
  postByID$ = this.PostSubject.asObservable();

  private PostFeedSubject = new BehaviorSubject<PostFeed[]>([]);
  postFeed$ = this.PostFeedSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private router: Router,
  ) { }
  addCommentToPost(NewComment:CommentsbyPost) {
    this.commentsByPost$.pipe(
      take(1),
      tap((Comment) => {
        this.commentsPostSubject.next([NewComment,...Comment]);
      })
    ).subscribe();
  }
  addPostFeedData(NewPost:PostFeed) {
    this.postFeed$.pipe(
      take(1),
      tap((Post) => {
        this.PostFeedSubject.next([NewPost,...Post]);
      })
    ).subscribe();
  }
  addPostProfileData(NewPost:PostbyUser) {
    this.postByUser$.pipe(
      take(1),
      tap((Post) => {
        this.profilePostSubject.next([NewPost,...Post]);
      })
    ).subscribe();
  }
  getTagsPost(tags: string, page: string): void {

    try {
      const TAGS_POST = gql`
      query tagsPost($TAGS:String!,$PAGE:String!){ 
        tagsPost(tags:$TAGS, page:$PAGE){
          tags
        }
      }
    `;
      this.apollo.watchQuery<any>({
        query: TAGS_POST,
        variables: {
          PAGE: page,
          TAGS: tags
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'tagsPost'),
        withLatestFrom(this.tagsPost$),
        tap(([apiResponse, tagsPost]) => {
          this.tagsSubject.next([...tagsPost, ...apiResponse]);
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  clearPostByUserData() {
    this.profilePostSubject.next([]);
  }
  clearCommentsByPostData() {
    this.commentsPostSubject.next([]);
  }
  clearPostFeedData() {
    this.PostFeedSubject.next([]);
  }

  getPostByUserData(IdUser: string, page: string): void {
    try {
      const POST_BY_USER = gql`
      query postsByUser($id: String!,$PAGE:String!){ 
        postsByUser(id:$id,page:$PAGE){
          id
          title
          body
          image
          nLike
          nComment
          tags
        }
      }
    `;
      this.apollo.watchQuery<any>({
        query: POST_BY_USER,
        variables: {
          id: IdUser,
          PAGE: page
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'postsByUser'),
        withLatestFrom(this.postByUser$),
        tap(([apiResponse, postsByUser]) => {
          this.profilePostSubject.next([ ...postsByUser,...apiResponse]);
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  addPostToProfileData(newPost: PostbyUser) {
    this.postByUser$.pipe(
      take(1),
      tap((Post) => {
        this.profilePostSubject.next([newPost, ...Post]);
      })
    ).subscribe();
  }


  getPostFeedData(search: string,page: string,toFedd:boolean): void {
    try {
      const POST_FEED = gql`
      query postsFeed($SEARCH:String!,$PAGE:String!){ 
        postsFeed(search:$SEARCH,page:$PAGE){
          id
          title
          body
          image
          nLike
          nComment
          tags
          user_Owner{
            id
            username
            display_name
            image
          }
        }
      }
    `;
      this.apollo.watchQuery<any>({
        query: POST_FEED,
        variables: {
          SEARCH:search,
          PAGE: page,
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'postsFeed'),
        withLatestFrom(this.postFeed$),
        tap(([apiResponse, postsFeed]) => { 
          this.PostFeedSubject.next([...postsFeed, ...apiResponse]);
          toFedd? this.router.navigate(['/home']):false;
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  getCommentsByPostData(IdPOST: string, page: string): void {
    try {
      const COMMENTS_BY_POST = gql`
      query commentsByPost($ID:String!,$PAGE:String!){ 
        commentsByPost(post_Owner:$ID,page:$PAGE){
          body
          user_Action{
            username
            image
          }
        }
      }
        
    `;
      this.apollo.watchQuery<any>({
        query: COMMENTS_BY_POST,
        variables: {
          ID: IdPOST,
          PAGE: page
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1),
        pluck('data', 'commentsByPost'),
        withLatestFrom(this.commentsByPost$),
        tap(([apiResponse, commentsByPost]) => {
          this.commentsPostSubject.next([...commentsByPost, ...apiResponse]);
        }, (error) => {
          console.log('there was an error sending the query', error);
        })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
}
