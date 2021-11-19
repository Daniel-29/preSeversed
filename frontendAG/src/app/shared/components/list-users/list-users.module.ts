import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users.component';
import { RouterModule } from '@angular/router';
import { UserCardModule } from '../user-card/user-card.module';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [ListUsersComponent],
  imports: [
    CommonModule,
    RouterModule,
    UserCardModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
  ],
  exports: [
    ListUsersComponent
  ]
})
export class ListUsersModule { }