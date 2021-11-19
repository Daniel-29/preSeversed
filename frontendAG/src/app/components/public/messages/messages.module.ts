import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { SideBarLeftModule } from '@app/shared/components/side-bar-left/side-bar-left.module';
import { SideBarRightModule } from '@app/shared/components/side-bar-right/side-bar-right.module';
import { SendMessageModule } from '@app/shared/components/send-message/send-message.module';
import { ReceivedMessageModule } from '@app/shared/components/received-message/received-message.module';
import { ListUsersModule } from '@app/shared/components/list-users/list-users.module';
import { NavigationBarModule } from '@app/shared/components/navigation-bar/navigation-bar.module';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';

@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    NavigationBarModule,
    SideBarLeftModule,
    SideBarRightModule,
    SendMessageModule,
    ReceivedMessageModule,
    ListUsersModule,
    ReactiveFormsModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
  ]
})
export class MessagesModule { }
