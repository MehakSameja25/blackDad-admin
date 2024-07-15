import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';

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
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private posts: AllPostsService,
    private router: Router
  ) {
    this.inputChanged.pipe(debounceTime(3000)).subscribe((value) => {
      console.log(value);
    });
  }

  onInputChange(value: string): void {
    this.inputChanged.next(value);
    const formData = new FormData();
    formData.append('name', value);
    formData.append('type', 'episodes');
    formData.append('categoryId', JSON.stringify(this.selectedCategories));
    formData.append('description', this.episodeForm.value.description);
    formData.append('thumbnail', this.episodeForm.value.bannerImage); // by mistake name replaced
    formData.append('image', this.episodeForm.value.thumbnailImage); // by mistake name replaced
    formData.append('filetype', this.episodeForm.value.fileType);
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
    formData.append('isDraft', '1');
    this.posts.addEpisode(formData).subscribe((res: any) => {
      if (res) {
        console.log(res);
      }
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
      category: ['', [Validators.required]],
      subType1: ['', [Validators.required]],
      fileType: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      url: ['', [Validators.required]],
      bannerImage: ['', [Validators.required]],
      thumbnailImage: ['', [Validators.required]],
    });
    this.getCategories();
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
      console.log(this.allcategories);
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.episodeForm.value.episodeName);
    formData.append('type', 'episodes');
    formData.append('categoryId', JSON.stringify(this.selectedCategories));
    formData.append('description', this.episodeForm.value.description);
    formData.append('thumbnail', this.episodeForm.value.bannerImage); // by mistake name replaced
    formData.append('image', this.episodeForm.value.thumbnailImage); // by mistake name replaced
    formData.append('filetype', this.episodeForm.value.fileType);
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
    formData.append('isDraft', '0');

    console.log(formData);
    this.posts.addEpisode(formData).subscribe((res) => {
      if (res) {
        this.router.navigate(['/admin/episodes']);
      }
      console.log(res);
    });
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
  getCategoryId(id: any) {
    const index = this.selectedCategories.indexOf(id);
    if (index === -1) {
      this.selectedCategories.push(id);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    console.log(JSON.stringify(this.selectedCategories));
  }

  getData(data: any) {
    console.log(data);
  }
}
