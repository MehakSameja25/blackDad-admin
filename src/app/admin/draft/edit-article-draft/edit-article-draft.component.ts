import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-article-draft',
  templateUrl: './edit-article-draft.component.html',
  styleUrls: ['./edit-article-draft.component.css'],
})
export class EditArticleDraftComponent {
  articleForm!: FormGroup;
  allcategories: any;
  selectedCategories: any[] = [];
  draftId: any;
  inputText: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  singleDraft: any;
  draftData: any;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private postsService: AllPostsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inputChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.updateDraft();
    });
  }

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      articleName: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      category: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      bannerImage: ['', [Validators.required]],
      thumbnailImage: ['', [Validators.required]],
    });
    this.getCategories();
    this.getSingleArticle();
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
      console.log(this.allcategories);
    });
  }
  getSingleArticle() {
    this.draftId = this.route.snapshot.paramMap.get('id');
    this.postsService.getSingleDraft(this.draftId).subscribe((res: any) => {
      this.singleDraft = res;
      this.draftData = JSON.parse(res.data.draft);
      console.log('DATA', this.draftData);
    });
  }
  onSubmit() {
    if (this.articleForm.invalid) {
      this.markFormGroupTouched(this.articleForm);
    }
    const formData = this.createArticleFormData();
    formData.append('isDraft', '0');
    this.postsService.addArticle(formData).subscribe((res) => {
      if (res) {
        this.deleteDraft();
        console.log('Article added:', res);
        this.router.navigate(['/admin/articles']);
      }
    });
  }
  updateDraft() {
    if (this.draftId) {
      const formData = this.createArticleFormData();
      formData.append('isDraft', '1');
      this.postsService
        .updateDraft(this.draftId, formData)
        .subscribe((res: any) => {
          console.log('Draft updated:', res);
        });
    }
  }

  private createArticleFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.articleForm.value.articleName);
    formData.append('type', 'articles');
    formData.append('categoryId', JSON.stringify(this.selectedCategories));
    formData.append('description', this.articleForm.value.description);
    formData.append('thumbnail', this.articleForm.value.bannerImage);
    formData.append('image', this.articleForm.value.thumbnailImage);
    formData.append('meta_description', this.articleForm.value.meta);
    formData.append('slug', this.articleForm.value.slug);
    formData.append('reason', '');
    formData.append('url', this.articleForm.value.url);
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
      this.articleForm.patchValue({ bannerImage: file });
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
      this.articleForm.patchValue({ thumbnailImage: file });
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
    console.log(this.selectedCategories);
    this.inputChanged.next('');
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  deleteDraft() {
    this.postsService.deleteDraft(this.draftId).subscribe();
  }
}
