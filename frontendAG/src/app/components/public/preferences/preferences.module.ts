import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesRoutingModule } from './preferences-routing.module';
import { PreferencesComponent } from './preferences.component';
import { SideBarLeftModule } from '@app/shared/components/side-bar-left/side-bar-left.module';
import { NavigationBarModule } from '@app/shared/components/navigation-bar/navigation-bar.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';
import userProfileSlice, { name as profileFeatureKey } from '@shared/slice/user.slice';
import { StoreModule } from '@ngrx/store';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({

  declarations: [
    PreferencesComponent
  ],
  imports: [
    CommonModule,
    PreferencesRoutingModule,
    SideBarLeftModule,
    NavigationBarModule,
    ReactiveFormsModule,
    SvgIconsModule,
    FileUploadModule,
    StoreModule.forFeature(profileFeatureKey, userProfileSlice),
  ]
})
export class PreferencesModule { }
