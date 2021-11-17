import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store, select, createSelector } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { Observable, Subscription, throwError } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserState } from '@app/shared/interfaces/data.interface';
import { take, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as profileUserSlice from '@shared/slice/user.slice';
import { UserService } from '@app/shared/services/user.service';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@enviroment/environment';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  url= environment.apiUrl;
  UserData!: UserState;
  editProfileSettings: Boolean = true;
  editPhotoSettings: Boolean = true;
  editPassword: Boolean = true;
  private newImage: string = '';
  private UPDATE_USER = gql`
  mutation updateUser($id:String!,$username:String!,$display_name:String!,$email:String!,$description:String!,$password:String!) {
    updateUser(
    id:$id,
    username:$username,
    display_name:$display_name,
    email:$email,
    description:$description,
    password:$password) {
      username
      email
      display_name
      password
      description
      image
    }
  }
`;
  private UPDATE_USER_PASS = gql`
  mutation updatePassword($id:String!,$new_password:String!,$old_password:String!) {
    updatePassword(
    id:$id, 
    new_password: $new_password,
    old_password: $old_password){
     id
    }
  }
`;

  PhotoPreferences = new FormGroup({
    "files": new FormControl(null, FileUploadValidators.filesLimit(1)),
    "password": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern(environment.PasswordValidation),
    ])
  });

  formPreferences = new FormGroup({
    "username": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern(environment.TextValidation),
    ]),
    "display_name": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern(environment.TextValidation),
    ]),
    /*     "files": new FormControl(null, FileUploadValidators.filesLimit(1)),
             "image": new FormControl(null, 
              [Validators.required, requiredFileType('png')
            ]),   */
    "email": new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(25),
      Validators.minLength(5),
    ]),
    "description": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern(environment.TextValidation),
    ]),
    "password": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern(environment.PasswordValidation),
    ])
  });

  formPassword = new FormGroup({
    "new_password": new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
      Validators.pattern(environment.PasswordValidation),
    ]),
    "confirm_password": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern(environment.PasswordValidation),
    ]),
    "old_password": new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern(environment.PasswordValidation),
    ])
  });

  private stateObserver!: Subscription;
  private previewImage!: Subscription;

  public animation: boolean = false;
  public multiple: boolean = false;
  filePath: string = 'null';


  constructor(
    private apollo: Apollo,
    private readonly store: Store<{}>,
    private toastr: ToastrService,
    private http: HttpClient,
  ) {
    this.formPreferences.disable();
    this.formPassword.disable();
    this.PhotoPreferences.disable()
  }
  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );
  ngOnInit(): void {
    this.stateObserver = this.UserSlice$.pipe(tap(data => {
      this.UserData = data
      this.formPreferences.controls.username.setValue(data.username);
      this.formPreferences.controls.display_name.setValue(data.display_name);
      this.formPreferences.controls.email.setValue(data.email);
      this.formPreferences.controls.description.setValue(data.description);
    })).subscribe();
    this.previewImage = this.PhotoPreferences.controls.files.valueChanges.subscribe(File => {
      try {
        if (File[0].type == 'image/png' || File[0].type == 'image/jpg' || File[0].type == 'image/jpeg') {
          const reader = new FileReader();
          reader.onload = () => {
            this.filePath = reader.result as string;
          }
          reader.readAsDataURL(File[0])
        }
      } catch (error) { }
    })
  }
  onChangeDataUser(): void {
    try {
      if (!this.formPreferences.valid) {
        this.toastr.warning('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      } else {
        this.apollo.mutate<any>({
          mutation: this.UPDATE_USER,
          variables: {
            id: this.UserData.id,
            username: this.formPreferences.controls.username.value,
            display_name: this.formPreferences.controls.display_name.value,
            email: this.formPreferences.controls.email.value,
            description: this.formPreferences.controls.description.value,
            password: this.formPreferences.controls.password.value,
          }
        }).pipe(take(1), tap(({ data }) => {
          this.formPreferences.disable()
          this.editProfileSettings = !this.editProfileSettings;
          this.formPreferences.controls.password.setValue('');
          this.store.dispatch(profileUserSlice.setUser(data.updateUser));
          this.toastr.success('infor updated', 'success!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
        }, (error) => {
          this.toastr.error('somethings is wrong :C', error);
          console.log('there was an error sending the query', error);
        })).subscribe();
      }
    } catch (error) {
      this.toastr.error('somethings is wrong :C', 'error!', {
        closeButton: true,
        progressBar: true,
        timeOut: 1500,
      });
      console.log(error);
    }
  }

  onPhotoUser(): void {
    try {
      if (!this.PhotoPreferences.valid || (this.PhotoPreferences.controls.files.value.length === 0)) {
        this.toastr.warning('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      } else {
        const UPDATE_USER_IMAGE = gql`
      mutation updateUserPhoto($id:String!,$image:String!,$password:String!) {
        updateUserPhoto(
          id:$id,
          image:$image,
          password:$password) {
            username
            email
            display_name
            password
            description
            image
          }
        }
      `;
        let testData: FormData = new FormData();
        testData.append('image', this.PhotoPreferences.controls.files.value[0]);
        this.http.post<any>(environment.apiUrl + 'user', testData)
          .pipe(
            take(1),
            catchError(this.handleError)
          ).subscribe({
            next: data => {
              this.newImage = data.name;
              this.apollo.mutate<any>({
                mutation: UPDATE_USER_IMAGE,
                variables: {
                  id: this.UserData.id,
                  image: this.newImage,
                  password: this.PhotoPreferences.controls.password.value,
                }
              }).pipe(take(1), tap(({ data }) => {
                this.PhotoPreferences.disable()
                this.editPhotoSettings = !this.editPhotoSettings;
                this.PhotoPreferences.reset();
                this.PhotoPreferences.controls.files.setValue([]);
                this.PhotoPreferences.controls.password.setValue('');
                this.store.dispatch(profileUserSlice.setUser(data.updateUserPhoto));
                this.toastr.success('infor updated', 'success!', {
                  closeButton: true,
                  progressBar: true,
                  timeOut: 1500,
                });
              }, (error) => {
                this.toastr.error('somethings is wrong :C', 'error!');
                console.log('there was an error sending the query', error);
              })).subscribe();
            },
            error: error => {
              console.error('There was an error!', error);
            }
          });
      }
    } catch (error) {
      this.toastr.error('somethings is wrong :C', 'error!', {
        closeButton: true,
        progressBar: true,
        timeOut: 1500,
      });
      console.log(error);
    }
  }

  onChangePassword(): void {
    try {
      if (this.formPassword.invalid || (this.formPassword.controls.new_password.value != this.formPassword.controls.confirm_password.value)) {
        this.toastr.warning('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        }
        );
      } else {
        this.apollo.mutate<any>({
          mutation: this.UPDATE_USER_PASS,
          variables: {
            id: this.UserData.id,
            new_password: this.formPassword.controls.new_password.value,
            old_password: this.formPassword.controls.old_password.value,
          }
        }).pipe(take(1), tap(({ data }) => {
          this.formPassword.disable()
          this.editPassword = !this.editPassword;
          this.formPassword.controls.new_password.setValue('');
          this.formPassword.controls.confirm_password.setValue('');
          this.formPassword.controls.old_password.setValue('');
          //this.store.dispatch(profileUserSlice.setUser(data.updateUser));
          this.toastr.success('password updated', 'success!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
        }, (error) => {
          this.toastr.error('somethings is wrong :C', 'error!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
          console.log('there was an error sending the query', error);
        })).subscribe();
      }
    } catch (error) {
      this.toastr.error('somethings is wrong :C', 'error!', {
        closeButton: true,
        progressBar: true,
        timeOut: 1500,
      });
      console.log(error);
    }


  }
  onEditUserSettings(): void {
    this.editProfileSettings = !this.editProfileSettings;
    if (this.editProfileSettings) {
      this.formPreferences.disable()
    } else {
      this.formPreferences.enable();
    }
  }
  onEditPhotoSettings(): void {
    this.editPhotoSettings = !this.editPhotoSettings;
    if (this.editPhotoSettings) {
      this.PhotoPreferences.disable()
    } else {
      this.PhotoPreferences.enable();
    }
  }
  onEditPassword(): void {
    this.editPassword = !this.editPassword;
    if (this.editPassword) {
      this.formPassword.disable()
    } else {
      this.formPassword.enable();
    }
  }
  ngOnDestroy() {
    this.previewImage.unsubscribe();
    this.stateObserver.unsubscribe();
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
