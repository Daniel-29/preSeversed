import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar.component';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';

@NgModule({
  declarations: [NavigationBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    SvgIconsModule,
  ],
  exports: [
    NavigationBarComponent
  ]
})
export class NavigationBarModule { }