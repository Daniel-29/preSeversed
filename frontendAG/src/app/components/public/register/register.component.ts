import { Component, OnInit } from '@angular/core';
import { Router, Navigation } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Apollo, gql } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { UserInterface } from '@app/shared/interfaces/data.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { UserService } from '@app/shared/services/user.service';
import { take, tap } from 'rxjs/operators';
import * as profileUserSlice from '@shared/slice/user.slice';
import { environment } from '@enviroment/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  private REGISTER_USER = gql`
  mutation register($username:String!,$email:String,$password:String!){
  register(username:$username,email:$email,password:$password)
}
`;

  formRegister = new FormGroup({
    "email": new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(50)
    ]),
    "username": new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
      Validators.pattern(environment.TextValidation),
    ]),
    "password": new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(8),
      Validators.pattern(environment.PasswordValidation),
    ]),
    "passwordConfirm": new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(8),
      Validators.pattern(environment.PasswordValidation),
    ]),
  });

  user$: Observable<UserInterface> | undefined;
  constructor(
    private toastr: ToastrService,
    private apollo: Apollo,
    private route: Router,
    private cookieService: CookieService,
    private readonly store: Store<{}>,
    private userService: UserService
  ) { }

  onRegister(): void {
    try {
      if (!this.formRegister.valid) {
        this.toastr.info('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      } else if (this.formRegister.value.password != this.formRegister.value.passwordConfirm) {
        this.toastr.warning('passwords error', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      } else {
        this.apollo.mutate<any>({
          mutation: this.REGISTER_USER,
          variables: {
            username: this.formRegister.value.username,
            email: this.formRegister.value.email,
            password: this.formRegister.value.password
          }
        }).pipe(take(1), tap(({ data }) => {
          const helper = new JwtHelperService();
          this.formRegister.reset();
          this.cookieService.set('token', data.register);
          this.store.dispatch(profileUserSlice.setId(helper.decodeToken(data.register).user._id));
          this.userService.getDataUser(helper.decodeToken(data.register).user._id, true)
          this.toastr.success('welcome', 'success!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
        }, (error) => {
          this.toastr.error(error, 'error!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
          //console.log('there was an error sending the query', error);
        })).subscribe();
      }
    } catch (error) {
      this.toastr.error('somethings is wrong :C', 'error!', {
        closeButton: true,
        progressBar: true,
        timeOut: 1500,
      });
      //console.log('there was an error sending the query', error);
    }
  }


  ngOnInit(): void {
  }

}
