import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendMessageComponent } from './send-message.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SendMessageComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    SendMessageComponent
  ]
})
export class SendMessageModule { }