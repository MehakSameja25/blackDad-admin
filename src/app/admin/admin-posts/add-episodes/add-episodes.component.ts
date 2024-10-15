import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { urlValidator } from '../../urlValidator';
import { Category } from '../../model/category.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-episodes',
  templateUrl: './add-episodes.component.html',
})
export class AddEpisodesComponent implements OnInit {
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
  draftId!: string | number;
  fileType!: string;
  editor = ClassicEditor;
  dropdownSettings = {};
  firstKeyPress: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private postsService: AllPostsService,
    private router: Router,
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
    this.episodeForm = this.fb.group({
      episodeName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      episodeNumber: ['', [Validators.required]],
      seasonNumber: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subType1: ['', [Validators.required]],
      // fileType: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      url: ['', [Validators.required]],
      bannerImage: ['', [Validators.required]],
      thumbnailImage: ['', [Validators.required]],
    });
    this.inputChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.updateDraft();
    });
  }

  ngOnInit(): void {
    this.episodeForm.get('subType1')?.valueChanges.subscribe((subType) => {
      this.updateUrlValidators(subType);
    });
    this.getCategories(); // Fetch categories
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    this.callAddDraft();
  }
  
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    this.callAddDraft();
  }
  
  private callAddDraft(): void {
    if (!this.firstKeyPress) {
      this.addEpisodeDraft();
      this.firstKeyPress = true;
    }
  }

  getCategories() {
    this.categoryService
      .unblockedCategories()
      .subscribe((response: Category) => {
        if (response) {
          this.allcategories = response.data;
        }
      });
  }

  addEpisodeDraft() {
    const formData = this.createEpisodeFormData();
    formData.append('isDraft', '1');
    this.postsService.addEpisode(formData).subscribe((res) => {
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

  getType(type: string) {
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
    formData.append('file', '');
    formData.append('reason', '');
    formData.append('url', this.episodeForm.value.url);
    formData.append('isBlock', '0');
    formData.append('isApproved', '0');
    formData.append('isPublished', '0');
    return formData;
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

  // Banner image variables
  bannerImageChangedEvent!: Event;
  croppedBannerImage: string | null = null;
  showBannerCropper = false;
  IsBannerImage = false;

  // Thumbnail image variables
  thumbnailImageChangedEvent!: Event;
  croppedThumbnailImage: string | null = null;
  showThumbnailCropper = false;
  IsThumbnailImage = false;

  handleBannerImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.bannerImageChangedEvent = event;
      this.showBannerCropper = true;
      this.IsBannerImage = true;
      this.inputChanged.next('');
      this.episodeForm.patchValue({ bannerImage: file });
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
      this.showBannerCropper = false;
      this.inputChanged.next('');
    }
  }
  handleThumbnailImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.IsThumbnailImage = true;
      this.thumbnailImageChangedEvent = event;
      this.showThumbnailCropper = true;
      this.inputChanged.next('');
      this.episodeForm.patchValue({ thumbnailImage: file });
    }
  }

  updateUrlValidators(subType: string): void {
    const urlControl = this.episodeForm.get('url');

    urlControl?.clearValidators();

    urlControl?.addValidators(urlValidator(subType));

    urlControl?.updateValueAndValidity();
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
    const index = this.selectedCategories.findIndex(
      (cat) => cat === item.toString()
    );
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
    this.inputChanged.next('');
    console.log('Deselected Category:', this.selectedCategories);
  }
}
