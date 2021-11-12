import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { createSelector, select, Store } from '@ngrx/store';
import { Observable, pipe, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserService } from './shared/services/user.service';
import * as profileUserSlice from '@shared/slice/user.slice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private readonly store: Store<{}>,
    private userService: UserService,
  ) {
    const helper = new JwtHelperService();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (!this.cookieService.check('token')) {
          if (event.url.toString() != '/login' && event.url.toString() != '/register') {
            this.router.navigate(['/login']);
          }
        } else {
          const token = cookieService.get('token') || '';
          const isExpired = helper.isTokenExpired(token);
          if (isExpired) {
            cookieService.delete('token');
            this.router.navigate(['/login']);
          }
          else if (event.url.toString() == '/login' || event.url.toString() == '/register' || event.url.toString() == '/') {
            this.router.navigate(['/home'])
          }
          this.UserSlice$.pipe(tap(data => {
            if (data.username === '') {
              this.store.dispatch(profileUserSlice.setId(helper.decodeToken(this.cookieService.get('token')).user._id));
              this.userService.getDataUser(helper.decodeToken(this.cookieService.get('token')).user._id, false);
            }
          })).subscribe();
        }
      }
    });
  }

}
