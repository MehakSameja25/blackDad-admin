import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-episodes',
  templateUrl: './add-episodes.component.html',
})
export class AddEpisodesComponent implements OnInit {
  episodeForm!: FormGroup;
  allcategories: any;
  selectedCategories: any[] = [];
  inputText: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  draftId: any;
  fileType: any;
  editor = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private postsService: AllPostsService,
    private router: Router
  ) {
    this.inputChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.updateDraft();
    });
  }

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
      // fileType: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      url: ['', [Validators.required]],
      bannerImage: ['', [Validators.required]],
      thumbnailImage: ['', [Validators.required]],
    });
    this.getCategories(); // Fetch categories
    this.addEpisodeDraft(); // Initial draft save
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
    });
  }

  addEpisodeDraft() {
    const formData = this.createEpisodeFormData();
    formData.append('isDraft', '1');
    this.postsService.addEpisode(formData).subscribe((res: any) => {
      if (res) {
        this.draftId = res.data.id;
        console.log('Draft added:', res);
      }
    });
  }

  onSubmit() {
    if (this.episodeForm.valid) {
      const formData = this.createEpisodeFormData();
      formData.append('isDraft', '0');
      this.postsService.addEpisode(formData).subscribe((res) => {
        if (res) {
          console.log('Episode added:', res);
          this.deleteDraft();
          this.router.navigate(['/admin/episodes']);
        }
      });
    } else {
      this.validateAllFormFields(this.episodeForm);
    }
  }

  updateDraft() {
    if (this.draftId) {
      const formData = this.createEpisodeFormData();
      formData.append('isDraft', '1');
      this.postsService.updateDraft(this.draftId, formData).subscribe((res) => {
        console.log('Draft updated:', res);
      });
    }
  }

  getType(type: any) {
    if (type === 'youtube') {
      this.fileType = 'video';
    }
    if (type === 'podcast') {
      this.fileType = 'audio';
    }
  }

  private createEpisodeFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.episodeForm.value.episodeName);
    formData.append('type', 'episodes');
    formData.append('categoryId', JSON.stringify(this.selectedCategories));
    formData.append('description', this.episodeForm.value.description);
    formData.append('thumbnail', this.episodeForm.value.thumbnailImage);
    formData.append('image', this.episodeForm.value.bannerImage);
    formData.append('filetype', this.fileType);
    formData.append('meta_description', this.episodeForm.value.meta);
    formData.append('subtype', this.episodeForm.value.subType1);
    formData.append('episodeNo', this.episodeForm.value.episodeNumber);
    formData.append('seasonNo', this.episodeForm.value.seasonNumber);
    formData.append('slug', this.episodeForm.value.slug);
    formData.append('file', this.episodeForm.value.url);
    formData.append('reason', '');
    formData.append('url', this.episodeForm.value.url);
    formData.append('isBlock', '0');
    formData.append('isApproved', '0');
    formData.append('isPublished', '0');
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
      this.inputChanged.next('');
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
      this.inputChanged.next('');
    }
  }

  getCategoryId(id: any) {
    const index = this.selectedCategories.indexOf(id);
    if (index === -1) {
      this.selectedCategories.push(id);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.inputChanged.next('');
  }
  deleteDraft() {
    this.postsService.deleteDraft(this.draftId).subscribe();
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
