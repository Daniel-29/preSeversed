import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post.component';
import { SideBarLeftModule } from '@shared/components/side-bar-left/side-bar-left.module';
import { NavigationBarModule } from '@shared/components/navigation-bar/navigation-bar.module';
import { SideBarRightModule } from '@shared/components/side-bar-right/side-bar-right.module';
import { CardPostModule } from '@shared/components/card-post/card-post.module';
import { ReceivedMessageModule } from '@app/shared/components/received-message/received-message.module';
import { ReactiveFormsModule } from '@angular/forms';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    SideBarRightModule,
    SideBarLeftModule,
    NavigationBarModule,
    CardPostModule,
    ReceivedMessageModule,
    ReactiveFormsModule,
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
  ]
})
export class PostModule { }
