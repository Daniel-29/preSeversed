import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPrivateRoutingModule } from './login-private-routing.module';
import { LoginPrivateComponent } from './login-private.component';


@NgModule({
  declarations: [
    LoginPrivateComponent
  ],
  imports: [
    CommonModule,
    LoginPrivateRoutingModule
  ]
})
export class LoginPrivateModule { }
