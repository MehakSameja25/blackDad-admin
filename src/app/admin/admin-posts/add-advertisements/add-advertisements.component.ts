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
}
