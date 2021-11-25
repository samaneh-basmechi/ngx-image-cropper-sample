import { Component, Input, OnInit } from '@angular/core';
import { Utils } from '../utils/utils';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { FileItem, FileUploader } from 'ng2-file-upload';
import {
  ImageCropperOptions,
  ImageCropperReference, ImageCropperUploadedInfo,
} from './models/image-cropper.model';
import { OutputFormat } from 'ngx-image-cropper/lib/interfaces/cropper-options.interface';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {
  @Input() path = 'your path ...';
  @Input() options = new ImageCropperOptions();
  @Input() reference: ImageCropperReference;
  @Input() autoClick = false;
  @Input() hideLabels = false;
  @Input() isBase64 = false;
  @Input() roundCropper = true;
  @Input() isCanvas = true;
  @Input() fileFormats = 'image/png, image/jpeg';
  cropperFormat: OutputFormat = 'jpeg';
  cropping = false;
  croppedImage: any = '';
  baseUrl = '';
  imageChangedEvent: any = '';
  thisId = Utils.uuidv4();
  transform: ImageTransform = {};
  file: File = null;
  canvasRotation = 0;
  uploader: FileUploader;
  uploadedInfo = new ImageCropperUploadedInfo();
  loading = false;

  //you have to have these services to upload your image
  // constructor(private service: Service) {
  // }

  ngOnInit(): void {
   this.setUploadedInfoValues();
    this.initUploader();
  }

  fileChangeEvent(event: any): void {
    this.cropping = true;
    this.imageChangedEvent = event;
    this.cropperFormat = event.target.files[0].type.slice(6);
  }

  loadImageFailed() {
    alert('تصویر بارگذاری نشد');
  }

  imageCropped(event: ImageCroppedEvent) {
    if (!this.isCanvas) {
      this.croppedImage = event.base64;
      const name = Utils.dateString() + '.' + this.base64ToFile(event.base64).type.slice(6);
      this.file = new File([this.base64ToFile(event.base64)], name, { type: this.base64ToFile(event.base64).type });
      return;
    }
    const elem = document.createElement('canvas');
    elem.width = this.options.resizeTo * this.options.aspectRatio;
    elem.height = this.options.resizeTo;
    const ctx = elem.getContext('2d');
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0, elem.width, elem.height);
      this.croppedImage = elem.toDataURL('image/jpeg');
      if (!this.isBase64) {
        const name = Utils.dateString() + '.' + this.base64ToFile(event.base64).type.slice(6);
        this.file = new File([this.base64ToFile(this.croppedImage)], name, { type: this.imageChangedEvent.target.files[0].type });
      }
    };
    image.src = event.base64;
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  resetImage() {
    this.canvasRotation = 0;
    this.transform = {};
  }

  clickUploadInput() {
    document.getElementById(this.thisId).click();
  }

  cancel() {
    // @ts-ignore
    document.getElementById(this.thisId).value = '';
    this.cropping = false;
  }

  save() {
    if (!this.isBase64) {
      const fileItem = new FileItem(this.uploader, this.file, {});
      this.uploader.queue.push(fileItem);
      fileItem.upload();
      return;
    }
    this.cancel();
    this.uploadedInfo.image = this.croppedImage;
    this.uploadedInfo.id = this.croppedImage;
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  private setUploadedInfoValues(){
    if (this.reference && this.reference.uploader) {
      if (this.reference.uploader.uploadedInfo.id) {
        this.uploadedInfo.id = this.reference.uploader.uploadedInfo.id;
        this.uploadedInfo.image = this.reference.uploader.uploadedInfo.image;
      }
      this.reference.uploader = this;
    }
  }

  private base64ToFile(base64Image: string): Blob {
    const split = base64Image.split(',');
    const type = split[0].replace('data:', '').replace(';base64', '');
    const byteString = atob(split[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
  }

  initUploader() {
    this.uploader = new FileUploader({
      // url: this.service.baseUrl + this.path,
      // headers: [
      //   {
      //     name: 'Authorization',
      //     value: token
      //   }
      // ]
    });
    this.uploader.onBuildItemForm = (fileItem, form) => {
      form.append('description', this.options.description);
      return { fileItem, form };
    };

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const resp = JSON.parse(response);
      if (resp && resp.data) {
        this.cropping = false;
        this.uploader.clearQueue();
        this.uploadedInfo = resp.data;
      }
      this.loading = false;
    };
    this.uploader.onErrorItem = (item: any, err: any, status: any, headers: any) => {
      const errorMsg = 'بارگذاری فایل‌ها ناموفق بود';
      this.loading = false;
      this.uploader.clearQueue();
      this.uploader.isUploading = false;
      this.cancel();
    };
    if (this.autoClick && !this.uploadedInfo.id) {
      setTimeout(() => {
        this.clickUploadInput();
      }, 50);
    }
  }

}
