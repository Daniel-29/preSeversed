import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
  ]
})
export class LoginModule { }
