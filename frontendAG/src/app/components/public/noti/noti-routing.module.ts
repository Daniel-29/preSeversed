import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotiComponent } from './noti.component';

const routes: Routes = [{ path: '', component: NotiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotiRoutingModule { }
