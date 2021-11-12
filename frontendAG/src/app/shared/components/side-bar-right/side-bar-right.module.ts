import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarRightComponent } from './side-bar-right.component';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SideBarRightComponent],
  imports: [
    CommonModule,
    RouterModule,
    SvgIconsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
  ],
  exports: [
    SideBarRightComponent
  ]
})
export class SideBarRightModule { }