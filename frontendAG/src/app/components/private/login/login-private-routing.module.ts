import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPrivateComponent } from './login-private.component';

const routes: Routes = [{ path: '', component: LoginPrivateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginPrivateRoutingModule { }
