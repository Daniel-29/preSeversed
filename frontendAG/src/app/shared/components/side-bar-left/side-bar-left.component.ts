import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as profileUserSlice from '@shared/slice/user.slice';
import * as apiHelperSlice from '@shared/slice/api.slice';
import { Store } from '@ngrx/store';
import { environment } from '@enviroment/environment';

@Component({
  selector: 'app-side-bar-left',
  templateUrl: './side-bar-left.component.html',
  styleUrls: ['./side-bar-left.component.css']
}) 
export class SideBarLeftComponent {

  url = environment.apiUrl;
  @Input() idUser!: string;
  @Input() username!: string;
  @Input() display_name!: string;
  @Input() image!: string;

  constructor(
    private cookieService: CookieService, 
    private router: Router,
    private readonly store: Store<{}>,
    ) { }
  navbar: Boolean = true;
  onTest() {
    this.navbar = !this.navbar
  }
  onLogout() {
    this.store.dispatch(apiHelperSlice.resetDataAPI());
    this.store.dispatch(profileUserSlice.resetDataUser());
    this.cookieService.deleteAll('token');
    this.router.navigate(['/login']);
  }

}
