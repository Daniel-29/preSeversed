import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarLeftComponent } from './side-bar-left.component';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [SideBarLeftComponent],
  imports: [
    CommonModule,
    RouterModule,
    SvgIconsModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
  ],
  exports: [
    SideBarLeftComponent
  ]
})
export class SideBarLeftModule { }

