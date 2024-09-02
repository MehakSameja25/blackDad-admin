import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { AllPostsService } from '../../services/all-posts.service';
import { CategoiesService } from '../../services/categoies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { urlValidator } from '../../urlValidator';
import { environment } from 'src/environments/environment';
import { SingleDraft } from '../../model/article.model';
import { Category } from '../../model/category.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-draft',
  templateUrl: './edit-draft.component.html',
  styleUrls: ['./edit-draft.component.css'],
})
export class EditDraftComponent {
  episodeForm!: FormGroup;
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
  inputText: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  draftId!: string | null;
  fileType!: string;
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
  dropdownSettings: {};
  editor = ClassicEditor;
  subtype!: string;
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
    this.episodeForm = this.fb.group({
      episodeName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      episodeNumber: ['', [Validators.required]],
      seasonNumber: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subType1: [''],
      // fileType: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      url: ['', [Validators.required]],
      bannerImage: [''],
      thumbnailImage: [''],
    });
    this.getCategories(); // Fetch categories
    this.getSingleEpisode(); // Initial draft save
  }

  getCategories() {
    this.categoryService
      .unblockedCategories()
      .subscribe((response: Category) => {
        this.allcategories = response.data;
      });
  }
  getSingleEpisode() {
    this.draftId = this.route.snapshot.paramMap.get('id');
    this.postsService
      .getSingleDraft(this.draftId)
      .subscribe((res: SingleDraft) => {
        if (res) {
          this.singleDraft = res;
          this.draftData = res.data.draft;

          if (this.draftData && this.draftData.subtype) {
            if (this.draftData.subtype === 'podcast') {
              this.fileType = 'audio';
              this.subtype = 'podcast';
              this.setFormValues();
              this.episodeForm
                .get('subType1')
                ?.valueChanges.subscribe((subType) => {
                  this.updateUrlValidators(subType);
                });
            } else {
              this.fileType = 'video';
              this.subtype = 'youtube';
              this.setFormValues();
              this.episodeForm
                .get('subType1')
                ?.valueChanges.subscribe((subType) => {
                  this.updateUrlValidators(subType);
                });
            }
          }
        }
        this.updateValidators();
      });
  }

  onSubmit() {
    if (this.episodeForm.valid) {
      const formData = this.createEpisodeFormData();

      this.postsService.addEpisode(formData).subscribe((res) => {
        if (res) {
          console.log('Episode added:', res);
          this.deleteDraft();
          this.router.navigate(['/admin/episodes']);
        }
      });
    } else {
      console.log('INVALID', this.episodeForm.value);
      this.validateAllFormFields(this.episodeForm);
    }
  }

  updateValidators(): void {
    const bannerImageControl = this.episodeForm.get('bannerImage');
    const thumbnailImageControl = this.episodeForm.get('thumbnailImage');

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
      const formData = this.createEpisodeFormData();
      formData.append('isDraft', '1');
      this.postsService.updateDraft(this.draftId, formData).subscribe((res) => {
        console.log('Draft updated:', res);
      });
    }
  }
  updateUrlValidators(subType: string): void {
    const urlControl = this.episodeForm.get('url');

    urlControl?.clearValidators();

    urlControl?.addValidators(urlValidator(subType));

    urlControl?.updateValueAndValidity();
  }

  getType(type: string) {
    if (type === 'youtube') {
      this.fileType = 'video';
      this.subtype = 'youtube';
    }
    if (type === 'podcast') {
      this.fileType = 'audio';
      this.subtype = 'podcast';
    }
  }

  private createEpisodeFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.episodeForm.value.episodeName);
    formData.append('type', 'episodes');
    formData.append('categoryId', JSON.stringify(this.selectedCategories));
    formData.append('description', this.episodeForm.value.description);
    formData.append('subtype', this.subtype);
    formData.append('filetype', this.fileType);

    // formData.append('thumbnail', this.episodeForm.value.bannerImage); // Replaced
    //     formData.append('image', this.episodeForm.value.thumbnailImage); // Replaced
    formData.append('meta_description', this.episodeForm.value.meta);
    formData.append('episodeNo', this.episodeForm.value.episodeNumber);
    formData.append('seasonNo', this.episodeForm.value.seasonNumber);
    formData.append('slug', this.episodeForm.value.slug);
    formData.append('file', '');
    formData.append('reason', '');
    formData.append('url', this.episodeForm.value.url);
    formData.append('isBlock', '0');
    formData.append('isApproved', '0');
    formData.append('isPublished', '0');
    if (this.episodeForm.value.bannerImage instanceof File) {
      formData.append('image', this.episodeForm.value.bannerImage);
    } else {
      formData.append('image', this.singleDraft.data.image.split('/v1')[1]);
    }

    if (this.episodeForm.value.thumbnailImage instanceof File) {
      formData.append('thumbnail', this.episodeForm.value.thumbnailImage);
    } else {
      formData.append(
        'thumbnail',
        this.singleDraft.data.thumbnail.split('/v1')[1]
      );
    }
    // if (this.episodeForm.value.subType1) {
    //   formData.append('subtype', this.episodeForm.value.subType1);
    //   formData.append('filetype', this.fileType);
    // } else {
    //   formData.delete('subtype');
    //   formData.delete('filetype');
    // }

    return formData;
  }

  deleteDraft() {
    this.postsService.deleteDraft(this.draftId).subscribe();
  }
  isCategorySelected(categoryId: number): boolean {
    if (!this.singleDraft || !this.singleDraft.data.category) {
      return false;
    }

    return this.singleDraft.data.category.some(
      (category: { id: number }) => category.id === categoryId
    );
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

  setFormValues(): void {
    this.episodeForm.patchValue({
      episodeName: this.draftData.name,
      description: this.draftData.description,
      meta: this.draftData.meta_description,
      episodeNumber: this.draftData.episodeNo,
      seasonNumber: this.draftData.seasonNo,
      category: this.singleDraft.data.category,
      slug: this.draftData.slug,
      subtype1: this.subtype,
      filetype: this.fileType,
      url: this.draftData.url,
      bannerImage: '',
      thumbnailImage: '',
    });
    if (
      this.singleDraft &&
      this.singleDraft.data &&
      this.singleDraft.data.category
    ) {
      this.singleDraft.data.category.map((category: { id: String }) => {
        this.selectedCategories.push(category.id);
      });
    }
  }
  // Banner image variables
  bannerImageChangedEvent!: Event;
  croppedBannerImage: string | null = null;
  showBannerCropper = false;

  // Thumbnail image variables
  thumbnailImageChangedEvent!: Event;
  croppedThumbnailImage: string | null = null;
  showThumbnailCropper = false;

  handleBannerImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.IsBannerImage = true;
      this.bannerImageChangedEvent = event;
      this.showBannerCropper = true;
      this.episodeForm.patchValue({ bannerImage: file });
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
      this.episodeForm.patchValue({ bannerImage: bannerFile });
      this.showThumbnailCropper = false;
      this.showBannerCropper = false;
      this.inputChanged.next('');
    }
  }
  IsThumbnailImage = false;
  handleThumbnailImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.IsThumbnailImage = true;
      this.thumbnailImageChangedEvent = event;
      this.showThumbnailCropper = true;
      this.episodeForm.patchValue({ thumbnailImage: file });
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
      this.episodeForm.patchValue({ thumbnailImage: thumbnailFile });
      this.inputChanged.next('');
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
