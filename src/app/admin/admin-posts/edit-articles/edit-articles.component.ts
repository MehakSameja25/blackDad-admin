import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-articles',
  templateUrl: './edit-articles.component.html',
  styleUrls: ['./edit-articles.component.css'],
})
export class EditArticlesComponent {
  articleForm!: FormGroup;
  allcategories: any;
  selectedCategories: any[] = [];
  singleArticle: any;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private posts: AllPostsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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

    const articleId = this.route.snapshot.paramMap.get('id');
    this.posts.getArticlesDetails(articleId).subscribe((res) => {
      if (res) {
        console.log('Article data', res);
        this.singleArticle = res;
      }
    });
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response) => {
      this.allcategories = response;
      console.log(this.allcategories);
    });
  }

  onSubmit() {
    if (this.articleForm.invalid) {
      this.markFormGroupTouched(this.articleForm);
    }
    const formData = new FormData();
    formData.append('name', this.articleForm.value.articleName);
    formData.append('type', 'articles');
    formData.append(
      'categoryId',
      JSON.stringify(this.singleArticle.data.categoryId)
    );
    formData.append('description', this.articleForm.value.description);
    formData.append('thumbnail', this.articleForm.value.bannerImage);
    formData.append('image', this.articleForm.value.thumbnailImage);
    formData.append('meta_description', this.articleForm.value.meta);
    formData.append('slug', this.articleForm.value.slug);
    formData.append('reason', '');
    formData.append('url', this.articleForm.value.url);
    formData.append('isBlock', this.singleArticle.data.isBlock);
    formData.append('isApproved', this.singleArticle.data.isApproved);
    formData.append('isPublished', this.singleArticle.data.isPublished);

    console.log(formData);
    this.posts
      .updateArticle(this.singleArticle.data.id, formData)
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/admin/articles']);
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
      this.articleForm.patchValue({ bannerImage: file });
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
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  isCategorySelected(categoryId: number): boolean {
    if (!this.singleArticle || !this.singleArticle.data.categories) {
      return false;
    }

    return this.singleArticle.data.categories.some(
      (category: any) => category.id === categoryId
    );
  }

  toggleCategory(categoryId: number): void {
    if (!this.singleArticle.data.categoryId) {
      this.singleArticle.data.categoryId = [];
    }

    const categoryIdString = categoryId.toString();

    const index = this.singleArticle.data.categoryId.findIndex(
      (id: string) => id === categoryIdString
    );

    if (index === -1) {
      this.singleArticle.data.categoryId.push(categoryIdString);
    } else {
      this.singleArticle.data.categoryId.splice(index, 1);
    }

    console.log(this.singleArticle.data.categoryId);
  }
}
