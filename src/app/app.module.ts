import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CropperComponent } from './cropper/cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    CropperComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ImageCropperModule,
    FileUploadModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
