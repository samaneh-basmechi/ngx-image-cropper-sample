import { ImageCropperInterface, ImageCropperUploadedInfoInterface } from './image-cropper';

export class ImageCropperOptions implements ImageCropperInterface{
  additionalTitle = '';
  description = 'sample';
  imageQuality = 100;
  resizeTo = 400;
  aspectRatio = 1 / 1;
}
export class ImageCropperUploadedInfo implements ImageCropperUploadedInfoInterface {
  id = 0;
  image = '';
  description = '';
}

export class ImageCropperReference {
  uploader;
  constructor() {
    const self: any = this;
    self.uploader = {
      uploadedInfo: new ImageCropperUploadedInfo(),
      cropping: false
    };
  }
}
