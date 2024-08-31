import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { MetaDataService } from '../../services/meta-data.service';
import { SingleAdvertisement } from '../../model/ad.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-edit-advertisements',
  templateUrl: './edit-advertisements.component.html',
})
export class EditAdvertisementsComponent {
  advertisementForm!: FormGroup;
  selectedFile!: File;
  singleAdData!: {
    id: number | null;
    title: string;
    description: string;
    image: string;
    url: string;
    isBlock: string;
    clicks: number;
    page: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: null | string;
  };

  constructor(
    private fb: FormBuilder,
    private metaService: MetaDataService,
    private router: Router,
    private route: ActivatedRoute
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
    this.getAdbyId();
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
    const file = input.files?.[0];
    const maxFileSize = 50 * 1024 * 1024; // 50MB

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
        const imgElement = document.getElementById(
          'thumbnailPreview'
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = e.target?.result as string;
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
      // formData.append('image', this.selectedFile);
      formData.append('isBlock', this.singleAdData.isBlock);
      if (this.IsImage) {
        formData.append('image', this.selectedFile);
      } else {
        formData.delete('image');
      }
      this.metaService
        .UpdateAdvertisements(this.singleAdData.id, formData)
        .subscribe((res) => {
          if (res) {
            this.advertisementForm.reset();
            this.router.navigate(['/admin/advertisements']);
          }
        });
    } else {
      this.validateAllFormFields(this.advertisementForm);
    }
  }

  getAdbyId() {
    const adId = this.route.snapshot.paramMap.get('id');
    this.metaService
      .getAdvertisementsByid(adId)
      .subscribe((res: SingleAdvertisement) => {
        this.singleAdData = res.data;
      });
  }
  // Thumbnail image variables
  thumbnailImageChangedEvent!: Event;
  croppedThumbnailImage: string | null = null;
  showThumbnailCropper = false;
  IsImage = false;
  handleThumbnailImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.IsImage = true;
      this.thumbnailImageChangedEvent = event;
      this.showThumbnailCropper = true;
      this.selectedFile = file;
      this.advertisementForm.patchValue({ image: file });
    }
  }

  thumbnailImageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.convertBlobToBase64(event.blob, (base64: string | null) => {
        this.croppedThumbnailImage = base64;
      });
    }
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
