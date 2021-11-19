import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostService } from '@app/shared/services/post.service';
import { Apollo, gql } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { take, tap } from 'rxjs/operators';
import * as apiHelperSlice from '@shared/slice/api.slice';
import { Store } from '@ngrx/store';
import { environment } from '@enviroment/environment';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.css']
})
export class CardPostComponent implements OnInit, OnDestroy {
  url= environment.apiUrl;
  @Input() isOwner!: Boolean;
  @Input() display_name!: String;
  @Input() idUser!: String;
  @Input() idUserPost!: String;
  @Input() username!: String;
  @Input() imageUser!: String;
  @Input() idPost!: String;
  @Input() title!: String;
  @Input() body!: String;
  @Input() image!: String;
  @Input() nLike!: String;
  @Input() nComment!: String;
  @Input() tags!: String;
  idLiked!: string;
  isLiked!: Boolean;
  isCommented: Boolean = false;

  constructor(
    private apollo: Apollo,
    private toastr: ToastrService,
    private postService: PostService,
    private readonly store: Store<{}>,
  ) { }

  ngOnInit(): void {
    this.loadLiked();
  }
  ngOnDestroy() {

  }

  private loadLiked(): void {
    try {
      const likeStats = gql`
      query likeToPostByUser($post:String!,$user:String!){
        likeToPostByUser(post_Owner:$post,user_Action:$user) {
          id
          like
        }
      }
    `;
      this.apollo.watchQuery<any>({
        query: likeStats,
        variables: {
          post: this.idPost,
          user: this.idUser,
        },
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(take(1), tap(({ data }) => {
        if (data.likeToPostByUser !== null) {
          this.isLiked = true;
          this.idLiked = data.likeToPostByUser.id
        }
      }, (error) => {
        console.log('there was an error sending the query', error);
      })).subscribe();

    } catch (error) {
      console.log(error);
    }
  }

  LikerDislikear(): void {
    try {
      if (this.isLiked) {
        const DELETE_LIKE = gql`
        mutation deleteLike($ID:String!,$POST:String!,$NLIKE:String!,$USER_POST:String!,$USER_SESSION:String!) {
          deleteLike(id:$ID,post_Owner:$POST,nLikeCount:$NLIKE,user_Post_Owner:$USER_POST,user_Action:$USER_SESSION)
          }
        `;
        this.apollo.mutate<any>({
          mutation: DELETE_LIKE,
          variables: {
            ID: this.idLiked,
            POST: this.idPost,
            NLIKE: (Number(this.nLike) - 1).toString(),
            USER_POST: this.idUserPost,
            USER_SESSION: this.idUser,
          }
        }).pipe(take(1), tap(({ data }) => {
          this.idLiked = '';
          this.isLiked = false;
          this.nLike = (Number(this.nLike) - 1).toString();
          //window.location.reload();
        }, (error) => {
          console.log('there was an error sending the query', error);
        }
        )).subscribe();

      } else {
        const ADD_LIKE = gql`
      mutation addLike($post:String!,$user:String!,$nlike:String!,$USER_POST:String!) {
          addLike(like:"true",post_Owner:$post,user_Action:$user,nLikeCount:$nlike,user_Post_Owner:$USER_POST){
            id
          }
        }
      `;
        this.apollo.mutate<any>({
          mutation: ADD_LIKE,
          variables: {
            post: this.idPost,
            user: this.idUser,
            nlike: (Number(this.nLike) + 1).toString(),
            USER_POST: this.idUserPost,
          }
        }).pipe(take(1), tap(({ data }) => {
          this.idLiked = data.addLike.id;
          this.isLiked = true;
          this.nLike = (Number(this.nLike) + 1).toString();
          //window.location.reload();
        }, (error) => {
          console.log('there was an error sending the query', error);
        }
        )).subscribe();
      }
    } catch (error) {
      console.log(error);
    }
  }

  onDeletePost(): void {
    try {
      const DELETE_POST = gql`
      mutation deletePost($deletePostId: String!){
          deletePost(id: $deletePostId)
        }
      `;
      this.apollo.mutate<any>({
        mutation: DELETE_POST,
        variables: {
          deletePostId: this.idPost,
        }
      }).pipe(take(1), tap(({ data }) => {
        this.postService.clearPostByUserData();
        this.postService.getPostByUserData(this.idUser.toString(),'0');
        this.toastr.success('post deleted successfully', 'success!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      }, (error) => {
        console.log('there was an error sending the query', error);
      })).subscribe();
    } catch (error) {
      console.log(error);
    }
  }
}
