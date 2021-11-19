import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { appHomeSimpleIcon } from 'src/assets/svg/home-simple';
import { appBellIcon } from 'src/assets/svg/bell';
import { appMessagesIcon } from 'src/assets/svg/messages';
import { appIdCardIcon } from 'src/assets/svg/id-card';
import { appArrowLeftIcon } from 'src/assets/svg/arrow-left';
import { appHeartIcon } from 'src/assets/svg/heart';
import { appCommentsIcon } from 'src/assets/svg/comments';
import { appGearsIcon } from 'src/assets/svg/gears';
import { appMagnifyingGlassIcon } from 'src/assets/svg/magnifying-glass';
import { appPenToSquareIcon } from 'src/assets/svg/pen-to-square';
import { appTrashCanIcon } from 'src/assets/svg/trash-can';
import { appImagesIcon } from 'src/assets/svg/images';
import { appBarsIcon } from 'src/assets/svg/bars';
import { appArrowRightFromBracketIcon } from 'src/assets/svg/arrow-right-from-bracket';
import { SpinnerIntercepor } from './shared/interceptor/spinner.interceptor';
import { environment } from '../environments/environment';
import { WebSocketService } from './shared/services/web-socket.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    ReactiveFormsModule,
    SpinnerModule,
    SvgIconsModule.forRoot({
      icons: [
        appHomeSimpleIcon,
        appBellIcon,
        appMessagesIcon,
        appIdCardIcon,
        appArrowLeftIcon,
        appHeartIcon,
        appCommentsIcon,
        appGearsIcon,
        appMagnifyingGlassIcon,
        appPenToSquareIcon,
        appTrashCanIcon,
        appImagesIcon,
        appBarsIcon,
        appArrowRightFromBracketIcon,
      ],
    }),
    GraphQLModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [CookieService,  { provide: HTTP_INTERCEPTORS, useClass: SpinnerIntercepor, multi: true }/*,WebSocketService*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
