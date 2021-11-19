import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from './profile-card.component';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [ProfileCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    SvgIconsModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
  ],
  exports: [
    ProfileCardComponent
  ]
})
export class ProfileCardModule { }