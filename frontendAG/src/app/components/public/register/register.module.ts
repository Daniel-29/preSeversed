import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
  ]
})
export class RegisterModule { }
