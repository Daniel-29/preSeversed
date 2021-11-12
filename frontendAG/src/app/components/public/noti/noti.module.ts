import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotiRoutingModule } from './noti-routing.module';
import { NotiComponent } from './noti.component';
import { SideBarLeftModule } from '@shared/components/side-bar-left/side-bar-left.module';
import { NavigationBarModule } from '@shared/components/navigation-bar/navigation-bar.module';
import { SideBarRightModule } from '@shared/components/side-bar-right/side-bar-right.module';
import { CardNotiModule } from '@shared/components/card-noti/card-noti.module';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    NotiComponent
  ],
  imports: [
    CommonModule,
    NotiRoutingModule,
    SideBarLeftModule,
    NavigationBarModule,
    SideBarRightModule,
    CardNotiModule,
    InfiniteScrollModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
  ]
})
export class NotiModule { }
