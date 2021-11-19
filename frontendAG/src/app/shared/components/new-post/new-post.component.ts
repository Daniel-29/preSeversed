import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { Apollo, gql } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { environment } from '@enviroment/environment';
import { PostService } from '@app/shared/services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit, OnDestroy {

  @Input() idUserOwner!: string;
  showForm: boolean = false;
  withImage: boolean = false;
  filePath: string = 'null';
  private newImage: string = '';
  private previewImage!: Subscription;

  constructor(
    private apollo: Apollo,
    private toastr: ToastrService,
    private http: HttpClient,
    private postService: PostService,
  ) { }

  formNewPost = new FormGroup({
    "title": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(1),
      Validators.pattern(environment.TextValidation),
    ]),
    "body": new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(1),
      Validators.pattern(environment.TextValidation),
    ]),
    "files": new FormControl(null,
      FileUploadValidators.filesLimit(1)
    ),
    "tags": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(1),
      Validators.pattern(environment.TextValidation),
    ]),
  });

  ngOnInit(): void {
    this.previewImage = this.formNewPost.controls.files.valueChanges.subscribe(File => {
      try {
        if (File[0] === undefined) {
          this.filePath = 'null'
        } else if (File[0].type == 'image/png' || File[0].type == 'image/jpg' || File[0].type == 'image/jpeg') {
          const reader = new FileReader();
          reader.onload = () => {
            this.filePath = reader.result as string;
          }
          reader.readAsDataURL(File[0])
        }
      } catch (error) { }
    })
  }

  onShowform(): void {
    this.showForm = !this.showForm;
  }

  onImageRequired(): void {
    this.withImage = !this.withImage;
  }

  onCreatePost() {
    try {
      if (this.withImage) {
        if (!this.formNewPost.valid || (this.formNewPost.controls.files.value.length === 0)) {
          this.toastr.warning('Invalid data', 'warning!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
        } else {
          this.onPostWithImage();
        }
      } else {
        if (!this.formNewPost.controls.title.valid && !this.formNewPost.controls.body.valid && !this.formNewPost.controls.tags.valid) {
          this.toastr.warning('Invalid data', 'warning!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
        } else {
          this.onPostNoImage()
        }
      }

    } catch (error) {

    }
  }

  onPostNoImage(): void {
    const CREATE_POST = gql`
      mutation addPost($TITLE: String!,$BODY:String!,$IMAGE:String!,$TAGS:String!,$USER:String!){ 
        addPost(title:$TITLE,body:$BODY,image:$IMAGE,nLike:"0",nComment:"0",tags:$TAGS,user_Owner:$USER){
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
          image
          display_name
          }
        }
      }
    `;
    this.apollo.mutate<any>({
      mutation: CREATE_POST,
      variables: {
        TITLE: this.formNewPost.controls.title.value,
        BODY: this.formNewPost.controls.body.value,
        IMAGE: '',
        TAGS: this.formNewPost.controls.tags.value,
        USER: this.idUserOwner,
      }
    }).pipe(take(1), tap(({ data }) => {
      this.toastr.success('infor updated', 'success!', {
        closeButton: true,
        progressBar: true,
        timeOut: 1500,
      });
      this.postService.addPostFeedData(data.addPost);
      this.postService.addPostProfileData(data.addPost);
      this.formNewPost.reset();
      this.formNewPost.controls.files.setValue([]);
      this.formNewPost.controls.title.setValue('');
      this.formNewPost.controls.body.setValue('');
      this.formNewPost.controls.tags.setValue('');
    }, (error) => {
      this.toastr.error('somethings is wrong :C', 'error!', {
        closeButton: true,
        progressBar: true,
        timeOut: 1500,
      });
      console.log('there was an error sending the query', error);
    })).subscribe();
  }

  onPostWithImage(): void {
    let testData: FormData = new FormData();
    testData.append('image', this.formNewPost.controls.files.value[0]);
    this.http.post<any>(environment.apiUrl + 'post', testData)
      .pipe(
        take(1),
        catchError(this.handleError)
      ).subscribe({
        next: data => {
          this.newImage = data.name;
          const CREATE_POST = gql`
          mutation addPost($TITLE: String!,$BODY:String!,$IMAGE:String!,$TAGS:String!,$USER:String!){ 
            addPost(title:$TITLE,body:$BODY,image:$IMAGE,nLike:"0",nComment:"0",tags:$TAGS,user_Owner:$USER){
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
              image
              display_name
              }
            }
          }
        `;
          this.apollo.mutate<any>({
            mutation: CREATE_POST,
            variables: {
              TITLE: this.formNewPost.controls.title.value,
              BODY: this.formNewPost.controls.body.value,
              IMAGE: this.newImage,
              TAGS: this.formNewPost.controls.tags.value,
              USER: this.idUserOwner,
            }
          }).pipe(take(1), tap(({ data }) => {
            this.toastr.success('infor updated', 'success!', {
              closeButton: true,
              progressBar: true,
              timeOut: 1500,
            });
            this.postService.addPostFeedData(data.addPost);
            this.postService.addPostProfileData(data.addPost);
            this.formNewPost.reset();
            this.formNewPost.controls.files.setValue([]);
            this.formNewPost.controls.title.setValue('');
            this.formNewPost.controls.body.setValue('');
            this.formNewPost.controls.tags.setValue('');
          }, (error) => {
            this.toastr.error('somethings is wrong :C', 'error!', {
              closeButton: true,
              progressBar: true,
              timeOut: 1500,
            });
            console.log('there was an error sending the query', error);
          })).subscribe();
        },
        error: error => {
          console.error('There was an error!', error);
        }
      });
  }
  ngOnDestroy() {
    this.previewImage.unsubscribe();
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

}
