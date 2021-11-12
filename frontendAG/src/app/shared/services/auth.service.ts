import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loading!: boolean;
  isAuth: boolean = false;
  public obs$!: Observable<boolean>
  constructor(
    private apollo: Apollo,
    private cookieService: CookieService
  ) { }

  loginAttempt(email: string, password: string): boolean {
    const LOGIN = gql`
    mutation login($email: String!, $pass: String!) {
     login(email:$email,password:$pass)
   }
 `;
    this.apollo.mutate<any>({
      mutation: LOGIN,
      variables: {
        email: email,
        pass: password
      }
    }).subscribe(({ data }) => {
      this.isAuth = true;
    });
    return this.isAuth
  }

  registerAttempt(email: string, username: string, password: string): boolean {
    const LOGIN = gql`
    mutation login($email: String!, $pass: String!) {
     login(email:$email,password:$pass)
   }
 `;
    this.apollo.mutate<any>({
      mutation: LOGIN,
      variables: {
        email: email,
        pass: password
      }
    }).subscribe(async ({ data }) => {
      this.setTokenOnCookies(data.login);
      this.isAuth = true;
    }, (error) => {
      this.isAuth = false;
      console.log('there was an error sending the query', error);
    });
    return this.isAuth
  }

  private setTokenOnCookies(token: string): void {
    this.cookieService.deleteAll();
    this.cookieService.set('token', token);
  }

}
