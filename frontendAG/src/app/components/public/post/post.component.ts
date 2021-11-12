import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostbyUser, UserState } from '@app/shared/interfaces/data.interface';
import { PostService } from '@app/shared/services/post.service';
import { UserService } from '@app/shared/services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store, select } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { environment } from '@enviroment/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import * as profileUserSlice from '@shared/slice/user.slice';
import { createSelector } from '@reduxjs/toolkit';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  username!: string;
  display_name!: string;
  image!: string;
  UserData!: UserState;
  IdPost!: string;
  nComment!: String;
  post!: PostbyUser;
  isOwner: Boolean = false;
  comments$ = this.postService.commentsByPost$;
  page: string = '0';
  User_id!: string;
  User_username!: string;
  User_display_name!: string;
  User_image!: string;



  private stateObserver!: Subscription;
  formComment = new FormGroup({
    body: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(80),
      Validators.pattern(environment.TextValidation)
    ]),
  });

  constructor(
    private apollo: Apollo,
    private readonly store: Store<{}>,
    private route: ActivatedRoute,
    private postService: PostService,
    private toastr: ToastrService
  ) { }
  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );

  ngOnInit(): void {
    this.route.params.pipe(
      take(1),
      tap(({ id }) => {
        this.IdPost = id
      })
    ).subscribe();
    this.stateObserver = this.UserSlice$.pipe(tap(data => {
      this.UserData = data;
      // this.User_id= data.id
    })).subscribe();
    this.getPostByIdData(this.IdPost);
    this.postService.clearCommentsByPostData();
    this.postService.getCommentsByPostData(this.IdPost, this.page);
  }
  ngOnDestroy() {
    this.stateObserver.unsubscribe();
  }
  onMoreData() {
    this.page = (Number(this.page) + 1).toString();
    this.postService.getCommentsByPostData(this.IdPost, this.page);
  }
  getPostByIdData(IdPost: string): void {
    try {
      const POST_BY_ID = gql`
      query postsByUser($id: String!) {
        post(id:$id){
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
        query: POST_BY_ID,
        variables: {
          id: IdPost
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1), tap(({ data }) => {
        if (data.post.user_Owner.id === this.UserData.id) {
          this.isOwner = true;
        }
        const post2: PostbyUser = {
          id: data.post.id,
          title: data.post.title,
          body: data.post.body,
          image: data.post.image,
          nLike: data.post.nLike,
          nComment: data.post.nComment,
          tags: data.post.tags,
        }
        this.User_username = data.post.user_Owner.username;
        this.User_display_name = data.post.user_Owner.display_name;
        this.User_image = data.post.user_Owner.image;
        this.nComment = data.post.nComment;
        this.User_id = data.post.user_Owner.id;
        this.post = post2;
      }, (error) => {
        console.log('there was an error sending the query', error);
      })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
  addCommentToPost(): void {
    try {
      this.formComment.markAsTouched();
      if (!this.formComment.valid) {
        this.toastr.warning('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      } else {
        const ADD_COMMENT = gql`
        mutation postsByUser($BODY: String!,$POST:String!,$USER:String!,$NCOMMENT:String!,$USER_POST:String!) {
        addComment(body:$BODY,post_Owner:$POST,user_Action:$USER,NComment:$NCOMMENT,user_Post_Owner:$USER_POST) {
          id
          body
          user_Action{
            id
            username
            image
          }
        }
      }
      `;
        this.apollo.mutate<any>({
          mutation: ADD_COMMENT,
          variables: {
            BODY: this.formComment.controls.body.value,
            POST: this.IdPost,
            USER: this.UserData.id,
            NCOMMENT: (Number(this.nComment) + 1).toString(),
            USER_POST: this.User_id,
          },
          fetchPolicy: 'network-only'
        }).pipe(take(1), tap(({ data }) => {
          this.postService.addCommentToPost(data.addComment);
          this.formComment.controls.body.setValue('');
          this.nComment = (Number(this.nComment) + 1).toString(),
            this.formComment.markAsUntouched();
          this.formComment.reset();
          this.formComment.controls.body.setValue('');
          this.toastr.success('comment send', 'info!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          }
          );
          //this.toastr.success('welcome', 'success!');
        }, (error) => {
          //this.toastr.error('somethings is wrong :C', 'error!');
          console.log('there was an error sending the query', error);
        })).subscribe();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
