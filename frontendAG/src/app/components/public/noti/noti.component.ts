import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store, select, createSelector } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { NotificationsService } from '@app/shared/services/notifications.service';
import * as profileUserSlice from '@shared/slice/user.slice';
import { tap } from 'rxjs/operators';
import * as apiHelperSlice from '@shared/slice/api.slice';

@Component({
  selector: 'app-noti',
  templateUrl: './noti.component.html',
  styleUrls: ['./noti.component.css']
})
export class NotiComponent implements OnInit, OnDestroy {
  idUser!: string;
  username!: string;
  display_name!: string;
  image!: string;
  page!:string;
  private stateObserverAPI!: Subscription;
  private stateObserver!: Subscription;
  notis$ = this.notiService.NotisByUser$;

  constructor(
    private apollo: Apollo,
    private readonly store: Store<{}>,
    private notiService: NotificationsService,
  ) { }
  UserSlice$ = this.store.select(
    createSelector(profileUserSlice.selectFeature, (state) => state)
  );
  apiHelperSlice$ = this.store.select(
    createSelector(apiHelperSlice.selectFeature, (state) => state)
  );

  ngOnInit(): void {
    const helper = new JwtHelperService();
    this.stateObserver = this.UserSlice$.pipe(tap(data=>{
      this.idUser=data.id;
      this.username = data.username;
      this.display_name = data.display_name;
      this.image = data.image
    })).subscribe();
    this.stateObserverAPI = this.apiHelperSlice$.pipe(tap(data=>{
      this.page= data.NotificationsPage;
      if(!data.NotificationsisLoading){
        this.store.dispatch(apiHelperSlice.setNotificationsPage('0'));
        this.store.dispatch(apiHelperSlice.setNotificationsisLoading(true));
        this.notiService.getNotisByUserData(this.idUser,this.page);
      }
    })).subscribe();
  }
  ngOnDestroy() {
    this.stateObserverAPI.unsubscribe();
    this.stateObserver.unsubscribe();
  }

  onScrollDown() {
    //this.page = (Number(this.page)+1).toString();
    //this.notiService.getNotisByUserData(this.idUser,this.page);
  }
  onMoreData() {
    this.page = (Number(this.page)+1).toString();
    this.store.dispatch(apiHelperSlice.setNotificationsPage(this.page));
    this.notiService.getNotisByUserData(this.idUser,this.page);
  }

}
