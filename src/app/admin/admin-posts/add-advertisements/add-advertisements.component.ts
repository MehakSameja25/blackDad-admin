import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllPostsService } from '../../services/all-posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-advertisements',
  templateUrl: './add-advertisements.component.html',
})
export class AddAdvertisementsComponent {
  advertisementForm!: FormGroup;
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private postsService: AllPostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.advertisementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      url: [
        '',
        [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      ],
      page: ['Home', Validators.required],
    });
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    const maxFileSize = 50 * 1024 * 1024;

    if (file) {
      if (file.size > maxFileSize) {
        alert('File size exceeds maximum limit (50MB)');
        return;
      }
      if (!file.type.match('image/*')) {
        alert('Invalid file type. Only images are allowed.');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target as FileReader;
        const previewElement = document.getElementById(
          'thumbnailPreview'
        ) as HTMLImageElement;
        if (target.result) {
          previewElement.setAttribute('src', target.result as string);
        }
      };
      reader.readAsDataURL(file);
      this.advertisementForm.patchValue({ thumbnailImage: file });
    }
  }

  onSubmit(): void {
    if (this.advertisementForm.valid) { 
      const formData = new FormData();
      formData.append('title', this.advertisementForm.value.title);
      formData.append('url', this.advertisementForm.value.url);
      formData.append('description', this.advertisementForm.value.description);
      formData.append('page', this.advertisementForm.value.page);
      formData.append('image', this.selectedFile);
      formData.append('isBlock', '0');
      this.postsService.addAdvertisement(formData).subscribe((res) => {
        if (res) {
          this.advertisementForm.reset();
          this.router.navigate(['/admin/advertisements']);
        }
      });

      console.log('Form submitted successfully');
      console.log('Form values:', formData);
    } else {
      alert('Form is invalid. Please check errors.');
      this.validateAllFormFields(this.advertisementForm);
    }
  }
  // Thumbnail image variables
  thumbnailImageChangedEvent!: Event;
  croppedThumbnailImage: string | null = null;
  showThumbnailCropper = false;
  IsBannerImage = false;
  handleThumbnailImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.thumbnailImageChangedEvent = event;
      this.showThumbnailCropper = true;
      this.selectedFile = file;
      this.advertisementForm.patchValue({ image: file });
    }
  }

  thumbnailImageCropped(event: any) {
    this.convertBlobToBase64(event.blob, (base64: string | null) => {
      this.croppedThumbnailImage = base64;
    });
  }

  saveCroppedThumbnailImage() {
    if (this.croppedThumbnailImage) {
      const thumbnailPreview = document.getElementById('thumbnailPreview');
      if (thumbnailPreview) {
        thumbnailPreview.setAttribute('src', this.croppedThumbnailImage);
      }
      const thumbnailFile = this.base64ToFile(
        this.croppedThumbnailImage,
        'thumbnail-image.png'
      );
      this.selectedFile = thumbnailFile;
      this.advertisementForm.patchValue({ image: thumbnailFile });
      this.showThumbnailCropper = false;
    }
  }

  convertBlobToBase64(
    blob: Blob,
    callback: (base64: string | null) => void
  ): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.onerror = () => {
      callback(null);
    };
    reader.readAsDataURL(blob);
  }

  base64ToFile(base64: string, fileName: string): File {
    if (!base64 || !fileName) {
      throw new Error('Invalid base64 string or fileName.');
    }
    const [header, data] = base64.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new File([uint8Array], fileName, { type: mime });
  }
}
