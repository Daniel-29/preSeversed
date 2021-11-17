import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { SideBarLeftModule } from '@app/shared/components/side-bar-left/side-bar-left.module';
import { SideBarRightModule } from '@app/shared/components/side-bar-right/side-bar-right.module';
import { NavigationBarModule } from '@app/shared/components/navigation-bar/navigation-bar.module';
import { CardPostModule } from '@app/shared/components/card-post/card-post.module';
import { ProfileCardModule } from '@app/shared/components/profile-card/profile-card.module';
import { NewPostModule } from '@app/shared/components/new-post/new-post.module';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SideBarLeftModule,
    SideBarRightModule,
    NavigationBarModule,
    CardPostModule,
    ProfileCardModule,
    NewPostModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),

  ]
})
export class ProfileModule { }
