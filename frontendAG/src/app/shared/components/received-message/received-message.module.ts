import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceivedMessageComponent } from './received-message.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ReceivedMessageComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    ReceivedMessageComponent
  ]
})
export class ReceivedMessageModule { }