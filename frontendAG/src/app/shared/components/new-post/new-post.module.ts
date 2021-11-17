import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPostComponent } from './new-post.component';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from '@iplab/ngx-file-upload';

@NgModule({
  declarations: [NewPostComponent],
  imports: [
    CommonModule,
    RouterModule,
    SvgIconsModule,
    ReactiveFormsModule,
    FileUploadModule,
  ],
  exports: [
    NewPostComponent
  ]
})
export class NewPostModule { }
