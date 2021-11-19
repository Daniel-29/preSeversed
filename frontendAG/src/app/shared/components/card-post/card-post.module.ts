import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPostComponent } from './card-post.component';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import apiHelperlice, { name as apiHelperFeatureKey } from '@shared/slice/api.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [CardPostComponent],
  imports: [
    CommonModule,
    RouterModule,
    SvgIconsModule,
    StoreModule.forFeature(apiHelperFeatureKey, apiHelperlice),
  ],
  exports: [
    CardPostComponent
  ]
})
export class CardPostModule { }
