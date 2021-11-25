import { Component } from '@angular/core';
import { ImageCropperOptions } from './cropper/models/image-cropper.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  avatarUploaderOptions = new ImageCropperOptions();
}
