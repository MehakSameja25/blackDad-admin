import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';

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
  dropdownSettings: {};
  editor = ClassicEditor;
  nullImagePath = environment.nullImagePath;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private posts: AllPostsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
      unSelectAllText: false,
      maxWidth: 300,
      // itemsShowLimit: 3,
      searchPlaceholderText: 'Search Categories!',
      closeDropDownOnSelection: true,
    };
  }

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      articleName: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      category: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      bannerImage: ['', []],
      thumbnailImage: ['', []],
    });
    if (this.singleArticle) {
      if (!this.singleArticle.data.image) {
        this.articleForm = this.fb.group({
          bannerImage: ['', [Validators.required]],
        });
      }

      if (!this.singleArticle.data.thumbnail) {
        this.articleForm = this.fb.group({
          thumbnailImage: ['', [Validators.required]],
        });
      }
    }

    const articleId = this.route.snapshot.paramMap.get('id');
    this.posts.getArticlesDetails(articleId).subscribe((res) => {
      if (res) {
        console.log('Article data', res);
        this.singleArticle = res;
        this.getCategories();
        this.setFormValues();
      }
    });
  }

  getCategories() {
    this.categoryService.unblockedCategories().subscribe((response: any) => {
      this.allcategories = response.data;
      console.log(this.allcategories);
    });
  }
  IsThumbnailImage = false;
  onSubmit() {
    if (this.articleForm.invalid) {
      this.markFormGroupTouched(this.articleForm);
    } else {
      const formData = new FormData();
      formData.append('name', this.articleForm.value.articleName);
      formData.append('type', 'articles');
      formData.append('categoryId', JSON.stringify(this.selectedCategories));
      formData.append('description', this.articleForm.value.description);
      formData.append('meta_description', this.articleForm.value.meta);
      formData.append('slug', this.articleForm.value.slug);
      formData.append('reason', '');
      formData.append('isBlock', this.singleArticle.data.isBlock);
      formData.append('isApproved', this.singleArticle.data.isApproved);
      formData.append('isPublished', this.singleArticle.data.isPublished);
      if (this.articleForm.value.bannerImage instanceof File) {
        formData.append('image', this.articleForm.value.bannerImage);
      } else {
        formData.delete('image');
      }

      if (this.articleForm.value.thumbnailImage instanceof File) {
        formData.append('thumbnail', this.articleForm.value.thumbnailImage);
      } else {
        formData.delete('thumbnail');
      }
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
  }
  setFormValues(): void {
    this.articleForm.patchValue({
      articleName: this.singleArticle.data.name,
      date: this.singleArticle.data.date,
      description: this.singleArticle.data.description,
      meta: this.singleArticle.data.meta_description,
      slug: this.singleArticle.data.slug,
      category: this.singleArticle.data.categories,
    });
    this.singleArticle.data.categories.map((category: any) => {
      this.selectedCategories.push(category.id);
    });
  }

  // handleBannerImageInput(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       document
  //         .getElementById('bannerPreview')!
  //         .setAttribute('src', e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //     this.articleForm.patchValue({ bannerImage: file });
  //   }
  // }

  // handleThumbnailImageInput(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       document
  //         .getElementById('thumbnailPreview')!
  //         .setAttribute('src', e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //     this.articleForm.patchValue({ thumbnailImage: file });
  //   }
  // }

  // getCategoryId(id: any) {
  //   const index = this.selectedCategories.indexOf(id);
  //   if (index === -1) {
  //     this.selectedCategories.push(id);
  //   } else {
  //     this.selectedCategories.splice(index, 1);
  //   }
  //   console.log(this.selectedCategories);
  // }
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

  // Banner image variables
  bannerImageChangedEvent: any = '';
  croppedBannerImage: string | null = null;
  showBannerCropper = false;

  // Thumbnail image variables
  thumbnailImageChangedEvent: any = '';
  croppedThumbnailImage: string | null = null;
  showThumbnailCropper = false;

  handleBannerImageInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.IsBannerImage = true;
      this.bannerImageChangedEvent = event;
      this.showBannerCropper = true;
      this.articleForm.patchValue({ bannerImage: file });
    }
  }

  bannerImageCropped(event: any) {
    this.convertBlobToBase64(event.blob, (base64: string | null) => {
      this.croppedBannerImage = base64;
    });
  }

  saveCroppedBannerImage() {
    if (this.croppedBannerImage) {
      const bannerPreview = document.getElementById('bannerPreview');
      if (bannerPreview) {
        bannerPreview.setAttribute('src', this.croppedBannerImage);
      }
      const bannerFile = this.base64ToFile(
        this.croppedBannerImage,
        'banner-image.png'
      );
      this.articleForm.patchValue({ bannerImage: bannerFile });
      this.showThumbnailCropper = false;
      this.showBannerCropper = false;
    }
  }

  handleThumbnailImageInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.IsThumbnailImage = true;
      this.thumbnailImageChangedEvent = event;
      this.showThumbnailCropper = true;
      this.articleForm.patchValue({ thumbnailImage: file });
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
      this.articleForm.patchValue({ thumbnailImage: thumbnailFile });
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
  IsBannerImage = false;
  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
    });
  }
  onCategorySelect(item: any) {
    const index = this.selectedCategories.indexOf(item.id);
    if (index === -1) {
      this.selectedCategories.push(item.id);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    console.log('Selected Category:', this.selectedCategories);
  }

  onCategoryDeSelect(item: any) {
    const index = this.selectedCategories.findIndex((cat) => cat === item.id);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
    console.log('Deselected Category:', this.selectedCategories);
  }
}
