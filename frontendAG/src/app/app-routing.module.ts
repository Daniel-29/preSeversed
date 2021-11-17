import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  { path: 'login', loadChildren: () => import('./components/public/login/login.module').then(m => m.LoginModule) },
  { path: 'post/:id', loadChildren: () => import('./components/public/post/post.module').then(m => m.PostModule) },
  { path: 'register', loadChildren: () => import('./components/public/register/register.module').then(m => m.RegisterModule) },
  { path: 'home', loadChildren: () => import('./components/public/home/home.module').then(m => m.HomeModule) },
  { path: 'messages', loadChildren: () => import('./components/public/messages/messages.module').then(m => m.MessagesModule) },
  { path: 'profile/:id', loadChildren: () => import('./components/public/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'noti', loadChildren: () => import('./components/public/noti/noti.module').then(m => m.NotiModule) },
  { path: 'loginPrivate', loadChildren: () => import('./components/private/login/login-private.module').then(m => m.LoginPrivateModule) },
  { path: 'dashboard', loadChildren: () => import('./components/private/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'preferences', loadChildren: () => import('./components/public/preferences/preferences.module').then(m => m.PreferencesModule)},
  {path:'**',redirectTo:'home',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
