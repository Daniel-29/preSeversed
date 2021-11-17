import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SideBarLeftModule } from '@shared/components/side-bar-left/side-bar-left.module';
import { NavigationBarModule } from '@shared/components/navigation-bar/navigation-bar.module';
import { SideBarRightModule } from '@shared/components/side-bar-right/side-bar-right.module';
import { CardPostModule } from '@shared/components/card-post/card-post.module';
import { NewPostModule } from '@app/shared/components/new-post/new-post.module';
import { StoreModule } from '@ngrx/store';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SideBarLeftModule,
    NavigationBarModule,
    SideBarRightModule,
    CardPostModule,
    NewPostModule,
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
  ]
})
export class HomeModule { }
