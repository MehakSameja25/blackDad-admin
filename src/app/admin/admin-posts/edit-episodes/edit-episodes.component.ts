import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-episodes',
  templateUrl: './edit-episodes.component.html',
  styleUrls: ['./edit-episodes.component.css'],
})
export class EditEpisodesComponent {
  episodeForm!: FormGroup;
  allcategories: any;
  episodeDetails: any;
  selectedCategories: any[] = [];
  isLoading: any = true;
  fileType!: string;
  subType: any;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private postsService: AllPostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.episodeForm = this.fb.group({
      episodeName: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      episodeNumber: ['', [Validators.required]],
      seasonNumber: ['', [Validators.required]],
      // category: ['', [Validators.required]],
      subType1: ['', [Validators.required]],
      fileType: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      url: ['', [Validators.required]],
      bannerImage: ['', [Validators.required]],
      thumbnailImage: ['', [Validators.required]],
    });
    this.getCategories();
    const id = this.route.snapshot.paramMap.get('id');
    this.postsService.getEpisodeDetails(id).subscribe((response) => {
      if (response) {
        this.episodeDetails = response;
        this.subType = this.episodeDetails?.data?.subtype;
        console.log(this.subType);
        if (this.subType === 'youtube') {
          this.fileType = 'video';
        } else if (this.subType === 'podcast') {
          this.fileType = 'audio';
        }
        this.isLoading = false;
      }

      console.log('CALLLED');
      this.setFormValues();
    });
  }
  setFormValues(): void {
    this.episodeForm.patchValue({
      episodeName: this.episodeDetails.data.name,
      date: this.episodeDetails.data.date,
      description: this.episodeDetails.data.description,
      meta: this.episodeDetails.data.meta_description,
      episodeNumber: this.episodeDetails.data.episodeNo,
      seasonNumber: this.episodeDetails.data.seasonNo,
      slug: this.episodeDetails.data.slug,
      url: this.episodeDetails.data.url,
      bannerImage: '',
      thumbnailImage: '',
    });
  }
  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
      console.log(this.allcategories);
    });
  }
  getType(type: any) {
    if (type === 'youtube') {
      this.fileType = 'video';
      this.subType = 'youtube';
    }
    if (type === 'podcast') {
      this.fileType = 'audio';
      this.subType = 'podcast';
    }
  }
  onSubmit() {
    if (this.episodeForm.valid) {
      if (this.fileType !== undefined) {
        const formData = this.buildFormData();

        //  Selecting the images if selected
        if (this.episodeForm.value.bannerImage instanceof File) {
          formData.append('image', this.episodeForm.value.bannerImage);
        } else {
          formData.delete('image');
        }

        if (this.episodeForm.value.thumbnailImage instanceof File) {
          formData.append('thumbnail', this.episodeForm.value.thumbnailImage);
        } else {
          formData.delete('thumbnail');
        }
        console.log(formData);
        this.postsService
          .updateEpisode(this.episodeDetails.data.id, formData)
          .subscribe((res) => {
            if (res) {
              this.router.navigate(['/admin/episodes']);
            }
            console.log(res);
          });
      }
    } else {
      this.validateAllFormFields(this.episodeForm);
    }
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.episodeForm.value.episodeName);
    formData.append('type', 'episodes');
    formData.append('categoryId', this.episodeDetails.data.categoryId);
    formData.append('description', this.episodeForm.value.description);
    formData.append('filetype', this.fileType);
    formData.append('meta_description', this.episodeForm.value.meta);
    formData.append('subtype', this.subType);
    formData.append('episodeNo', this.episodeForm.value.episodeNumber);
    formData.append('seasonNo', this.episodeForm.value.seasonNumber);
    formData.append('slug', this.episodeForm.value.slug);
    formData.append('file', this.episodeForm.value.url);
    formData.append('reason', '');
    formData.append('url', this.episodeForm.value.url);
    formData.append('isBlock', this.episodeDetails.data.isBlock);
    formData.append('isApproved', this.episodeDetails.data.isApproved);
    formData.append('isPublished', this.episodeDetails.data.isPublished);
    return formData;
  }

  handleBannerImageInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        document
          .getElementById('bannerPreview')!
          .setAttribute('src', e.target.result);
      };
      reader.readAsDataURL(file);
      this.episodeForm.patchValue({ bannerImage: file });
    }
  }

  handleThumbnailImageInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        document
          .getElementById('thumbnailPreview')!
          .setAttribute('src', e.target.result);
      };
      reader.readAsDataURL(file);
      this.episodeForm.patchValue({ thumbnailImage: file });
    }
  }
  isCategorySelected(categoryId: number): boolean {
    if (!this.episodeDetails || !this.episodeDetails.data.categories) {
      return false;
    }

    return this.episodeDetails.data.categories.some(
      (category: any) => category.id === categoryId
    );
  }

  toggleCategory(categoryId: number): void {
    if (!this.episodeDetails.data.categoryId) {
      this.episodeDetails.data.categoryId = [];
    }

    const categoryIdString = categoryId.toString();

    const index = this.episodeDetails.data.categoryId.findIndex(
      (id: string) => id === categoryIdString
    );

    if (index === -1) {
      this.episodeDetails.data.categoryId.push(categoryIdString);
    } else {
      this.episodeDetails.data.categoryId.splice(index, 1);
    }

    console.log(this.episodeDetails.data.categoryId);
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control!.markAsTouched({ onlySelf: true });
      }
    });
  }
}
