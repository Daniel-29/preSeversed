import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Store, select, createSelector } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserState } from '@app/shared/interfaces/data.interface';
import { UserService } from '@app/shared/services/user.service';
import { take, tap } from 'rxjs/operators';
import { environment } from '@enviroment/environment';
import * as profileUserSlice from '@shared/slice/user.slice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private LOGIN_AUTH = gql`
  mutation login($email: String!, $pass: String!) {
    login(email:$email,password:$pass)
  }
`;
  formLogin = new FormGroup({
    "email": new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(50)
    ]),
    "password": new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(8),
      Validators.pattern(environment.PasswordValidation),
    ]),
  });

  user$: Observable<UserState> | undefined;

  constructor(
    private toastr: ToastrService,
    private apollo: Apollo,
    private route: Router,
    private cookieService: CookieService,
    //private store: Store<AppState>,
    private readonly store: Store<{}>,
    private userService: UserService
  ) {
    //this.user$ = store.select(getUserData);
  }

  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );

  onLogin(): void {
    try {
      if (!this.formLogin.valid) {
        this.toastr.warning('Invalid data', 'warning!', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      } else {
        this.apollo.mutate<any>({
          mutation: this.LOGIN_AUTH,
          variables: {
            email: this.formLogin.value.email,
            pass: this.formLogin.value.password
          }
        }).pipe(take(1), tap(({ data }) => {
          const helper = new JwtHelperService();
          this.cookieService.set('token', data.login);
          this.formLogin.reset();
          this.store.dispatch(profileUserSlice.setId(helper.decodeToken(data.login).user._id));
          this.userService.getDataUser(helper.decodeToken(data.login).user._id, true)
          this.toastr.success('welcome', 'success!', {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
        }, (error) => {
          this.toastr.warning('somethings is wrong :C', error, {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          });
          //console.log('there was an error sending the query', error);
        })).subscribe();
      }
    } catch (error) {
      //this.toastr.error('somethings is wrong :C', 'error!');
      //console.log('there was an error sending the query', error);
    }
  }

  ngOnInit(): void {
    //this.channelName$ = this.store.select(getChannelName);
  }

}
