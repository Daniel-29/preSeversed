import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardNotiComponent } from './card-noti.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CardNotiComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    CardNotiComponent
  ]
})
export class CardNotiModule { }
