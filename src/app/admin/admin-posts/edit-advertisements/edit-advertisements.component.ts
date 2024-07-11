import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { MetaDataService } from '../../services/meta-data.service';

@Component({
  selector: 'app-edit-advertisements',
  templateUrl: './edit-advertisements.component.html',
})
export class EditAdvertisementsComponent {
  advertisementForm!: FormGroup;
  selectedFile!: File;
  singleAdData: any;

  constructor(
    private fb: FormBuilder,
    private postsService: AllPostsService,
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
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const maxFileSize = 50 * 1024 * 1024;
    console.log(file);
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
      reader.onload = (e: any) => {
        document
          .getElementById('thumbnailPreview')!
          .setAttribute('src', e.target.result);
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
      formData.append('isBlock', this.singleAdData.isBlock);
      this.metaService
        .UpdateAdvertisements(this.singleAdData.id, formData)
        .subscribe((res) => {
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

  getAdbyId() {
    const adId = this.route.snapshot.paramMap.get('id');
    this.metaService.getAdvertisementsByid(adId).subscribe((res: any) => {
      this.singleAdData = res.data;
    });
  }
}
