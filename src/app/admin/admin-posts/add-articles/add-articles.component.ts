import {
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoiesService } from '../../services/categoies.service';
import { Router } from '@angular/router';
import { AllPostsService } from '../../services/all-posts.service';
import { Subject, debounceTime } from 'rxjs';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../model/category.model';
import { EditorConfig } from '@ckeditor/ckeditor5-core';
import { ArticalCategoiesService } from '../../services/articalCategory.service';

declare var $: { summernote: { ui: any } };

@Component({
  selector: 'app-add-articles',
  templateUrl: './add-articles.component.html',
  styleUrls: ['./add-articles.component.css'],
})
export class AddArticlesComponent {
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
  draftId!: null | string;
  inputText: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  editor = ClassicEditor;
  dropdownSettings: {};

  public editorConfig: EditorConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      'blockQuote',
      '|',
      'insertTable',
      'mediaEmbed',
      'link',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
      ],
    },
  };

  public config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      image: [
        ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeMedia']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['customButtons', ['testBtn']],
      ['view', ['fullscreen', 'codeview', 'help']],
    ],
    fontSizes: [
      '8',
      '9',
      '10',
      '11',
      '12',
      '14',
      '18',
      '24',
      '36',
      '44',
      '56',
      '64',
      '76',
      '84',
      '96',
    ],
    fontNames: [
      'Arial',
      'Times New Roman',
      'Inter',
      'Comic Sans MS',
      'Courier New',
      'Roboto',
      'Times',
      'MangCau',
      'BayBuomHep',
      'BaiSau',
      'BaiHoc',
      'CoDien',
      'BucThu',
      'KeChuyen',
      'MayChu',
      'ThoiDai',
      'ThuPhap-Ivy',
      'ThuPhap-ThienAn',
    ],
    buttons: {
      testBtn: customButton,
    },
    codeviewFilter: true,
    codeviewFilterRegex:
      /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };
  editorDisabled: boolean = false;
  articleCategoryData!: any;
  subCategories: any[] = [];
  selectedCategoryId: number | null = null;

  public enableEditor() {
    this.editorDisabled = false;
  }

  public disableEditor() {
    this.editorDisabled = true;
  }

  public onBlur() {
    console.log('Blur');
  }

  public onDelete(file: { url: any }) {
    console.log('Delete file', file.url);
  }

  public summernoteInit(event: any) {
    console.log(event);
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoiesService,
    private postsService: AllPostsService,
    private router: Router,
    private modalService: NgbModal,
    private articleCategory: ArticalCategoiesService
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
  onCategorySelect(item: number | String) {
    console.log(typeof this.selectedCategories, this.selectedCategories);
    const index = this.selectedCategories.indexOf(item.toString());
    if (index === -1) {
      this.selectedCategories.push(item.toString());
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.inputChanged.next('');
    console.log('Selected Category:', this.selectedCategories);
  }

  onCategoryDeSelect(item: number | String) {
    const index = this.selectedCategories.findIndex(
      (cat) => cat === item.toString()
    );
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
    console.log('Deselected Category:', this.selectedCategories);
  }
  ngOnInit(): void {
    this.articleForm = this.fb.group({
      articleName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      category: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      bannerImage: ['', [Validators.required]],
      thumbnailImage: ['', [Validators.required]],
    });
    this.getCategories();
    this.getCategoryArticle();
    // this.addArticleDraft();
  }

  getCategoryArticle() {
    this.articleCategory.getArticalCategory().subscribe((res: any) => {
      if (res) {
        this.articleCategoryData = res.data?.filter(
          (category: { isParent: null }) => category.isParent === null
        );
      }
    });
  }
  selectedSubCategoryId: any;
  onCategoryChange() {
    this.subCategories = this.articleCategoryData.filter(
      (category: { isParent: number | null }) =>
        category.isParent === this.selectedCategoryId
    );
    this.selectedSubCategoryId = null;
  }

  firstKeyPress: boolean = false;
  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    if (!this.firstKeyPress) {
      this.addArticleDraft();
      this.firstKeyPress = true;
    }
  }

  getCategories() {
    this.categoryService
      .unblockedCategories()
      .subscribe((response: Category) => {
        this.allcategories = response.data;
        console.log(this.allcategories);
      });
  }
  addArticleDraft() {
    const formData = this.createArticleFormData();
    formData.append('isDraft', '1');
    this.postsService.addArticle(formData).subscribe((res) => {
      if (res) {
        this.draftId = res.data.id;
        console.log('Draft added:', res);
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
  updateDraft() {
    if (this.draftId) {
      const formData = this.createArticleFormData();
      formData.append('isDraft', '1');
      this.postsService.updateDraft(this.draftId, formData).subscribe((res) => {
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
    formData.append('meta_description', this.articleForm.value.meta);
    formData.append('slug', this.articleForm.value.slug);
    formData.append('reason', '');
    formData.append('isBlock', '0');
    formData.append('isApproved', '0');
    formData.append('isPublished', '0');
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
  bannerImageChangedEvent?: Event;
  croppedBannerImage: string | null = null;
  showBannerCropper = false;

  // Thumbnail image variables
  thumbnailImageChangedEvent!: Event;
  croppedThumbnailImage: string | null = null;
  showThumbnailCropper = false;
  IsThumbnailImage = false;

  handleBannerImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.IsBannerImage = true;
      this.bannerImageChangedEvent = event;
      this.showBannerCropper = true;
      this.articleForm.patchValue({ bannerImage: file });
    }
  }

  bannerImageCropped(event: ImageCroppedEvent): void {
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
      // this.showThumbnailCropper = false;
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
      this.articleForm.patchValue({ thumbnailImage: file });
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
}

function customButton(context: {
  invoke: (arg0: string, arg1: string) => void;
}) {
  const ui = $.summernote.ui;
  const button = ui.button({
    contents: '<i class="note-icon-magic"></i> Hello',
    tooltip: 'Custom button',
    container: '.note-editor',
    className: 'note-btn',
    click: function () {
      context.invoke('editor.insertText', 'Hello from test btn!!!');
    },
  });
  return button.render();
}
