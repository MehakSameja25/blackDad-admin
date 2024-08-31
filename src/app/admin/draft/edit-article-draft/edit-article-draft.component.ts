import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';
import { Category } from '../../model/category.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SingleDraft } from '../../model/article.model';

@Component({
  selector: 'app-edit-article-draft',
  templateUrl: './edit-article-draft.component.html',
  styleUrls: ['./edit-article-draft.component.css'],
})
export class EditArticleDraftComponent {
  articleForm!: FormGroup;
  allcategories!: [
    {
      id: number | null;
      name: string;
      image: string;
      isblock: string;
      description: string;
    }
  ];
  selectedCategories: String[] = [];
  draftId!: string | null;
  inputText: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  singleDraft!: SingleDraft;
  draftData!: {
    name: string | null;
    type: string | null;
    categoryId: string | null | any;
    description: string | null;
    filetype: string | null;
    meta_description: string | null;
    subtype: string | null;
    episodeNo: string | null;
    seasonNo: string | null;
    slug: string | null;
    reason: string | null;
    url: string | null;
    isBlock: string | null;
    isApproved: string | null;
    isPublished: string | null;
    isDraft: string | null;
  };
  editor = ClassicEditor;
  dropdownSettings: {};
  nullImagePath = environment.nullImagePath;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private postsService: AllPostsService,
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
    this.inputChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.updateDraft();
    });
  }

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      articleName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      category: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      bannerImage: [''],
      thumbnailImage: [''],
    });
    this.getCategories();
    this.getSingleArticle();
  }

  setFormValues(): void {
    this.articleForm.patchValue({
      articleName: this.draftData.name,
      description: this.draftData.description,
      meta: this.draftData.meta_description,
      slug: this.draftData.slug,
      category: this.singleDraft.data.category,
    });
    this.singleDraft.data.category.map((category: { id: String }) => {
      this.selectedCategories.push(category.id);
    });
  }

  getCategories() {
    this.categoryService
      .unblockedCategories()
      .subscribe((response: Category) => {
        this.allcategories = response.data;
        console.log(this.allcategories);
      });
  }
  getSingleArticle() {
    this.draftId = this.route.snapshot.paramMap.get('id');
    this.postsService
      .getSingleDraft(this.draftId)
      .subscribe((res: SingleDraft) => {
        if (res) {
          this.singleDraft = res;
          this.draftData = res.data.draft;
          this.setFormValues();
          this.updateValidators();
        }
      });
  }
  onSubmit() {
    if (this.articleForm.invalid) {
      this.markFormGroupTouched(this.articleForm);
    } else {
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
  }

  updateValidators(): void {
    const bannerImageControl = this.articleForm.get('bannerImage');
    const thumbnailImageControl = this.articleForm.get('thumbnailImage');

    // Adjust validators based on draft data
    if (
      this.singleDraft &&
      this.singleDraft.data &&
      this.singleDraft.data.image != this.nullImagePath
    ) {
      bannerImageControl?.clearValidators();
    } else {
      bannerImageControl?.addValidators(Validators.required);
    }
    bannerImageControl?.updateValueAndValidity();

    if (
      this.singleDraft &&
      this.singleDraft.data &&
      this.singleDraft.data.thumbnail != this.nullImagePath
    ) {
      thumbnailImageControl?.clearValidators();
    } else {
      thumbnailImageControl?.addValidators(Validators.required);
    }
    thumbnailImageControl?.updateValueAndValidity();
  }

  updateDraft() {
    if (this.draftId) {
      const formData = this.createArticleFormData();
      formData.append('isDraft', '1');
      this.postsService.updateDraft(this.draftId, formData).subscribe();
    }
  }

  private createArticleFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.articleForm.value.articleName);
    formData.append('type', 'articles');
    formData.append('categoryId', JSON.stringify(this.selectedCategories));
    formData.append('description', this.articleForm.value.description);
    // formData.append('thumbnail', this.articleForm.value.bannerImage);
    // formData.append('image', this.articleForm.value.thumbnailImage);
    formData.append('meta_description', this.articleForm.value.meta);
    formData.append('slug', this.articleForm.value.slug);
    formData.append('reason', '');
    formData.append('isBlock', '0');
    formData.append('isApproved', '0');
    formData.append('isPublished', '0');
    if (this.articleForm.value.bannerImage instanceof File) {
      formData.append('image', this.articleForm.value.bannerImage);
    } else {
      formData.append('image', this.singleDraft.data.image.split('/v1')[1]);
    }

    if (this.articleForm.value.thumbnailImage instanceof File) {
      formData.append('thumbnail', this.articleForm.value.thumbnailImage);
    } else {
      formData.append(
        'thumbnail',
        this.singleDraft.data.thumbnail.split('/v1')[1]
      );
    }
    return formData;
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

  // Banner image variables
  bannerImageChangedEvent!: Event;
  croppedBannerImage: string | null = null;
  showBannerCropper = false;

  // Thumbnail image variables
  thumbnailImageChangedEvent!: Event;
  croppedThumbnailImage: string | null = null;
  showThumbnailCropper = false;
  IsThumbnailImage = false;
  handleBannerImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.IsBannerImage = true;
      this.bannerImageChangedEvent = event;
      this.showBannerCropper = true;
      this.articleForm.patchValue({ bannerImage: file });
      this.inputChanged.next('');
    }
  }

  bannerImageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.convertBlobToBase64(event.blob, (base64: string | null) => {
        this.croppedBannerImage = base64;
      });
    }
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
      this.showBannerCropper = false;
      this.inputChanged.next('');
    }
  }

  handleThumbnailImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.IsThumbnailImage = true;
      this.thumbnailImageChangedEvent = event;
      this.showThumbnailCropper = true;
      this.articleForm.patchValue({ thumbnailImage: file });
      this.inputChanged.next('');
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
      this.articleForm.patchValue({ thumbnailImage: thumbnailFile });
      this.showThumbnailCropper = false;
      this.inputChanged.next('');
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
  open(content: TemplateRef<unknown>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
    });
  }
  onCategorySelect(item: String | number) {
    const index = this.selectedCategories.indexOf(item.toString());
    if (index === -1) {
      this.selectedCategories.push(item.toString());
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.inputChanged.next('');
    console.log('Selected Category:', this.selectedCategories);
  }

  onCategoryDeSelect(item: String | number) {
    const index = this.selectedCategories.findIndex((cat) => cat === item);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
    this.inputChanged.next('');
    console.log('Deselected Category:', this.selectedCategories);
  }
}
