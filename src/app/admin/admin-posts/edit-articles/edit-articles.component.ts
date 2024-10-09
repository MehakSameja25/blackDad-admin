import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoiesService } from '../../services/categoies.service';
import { AllPostsService } from '../../services/all-posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';
import { Category } from '../../model/category.model';
import { SingleArticle } from '../../model/article.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ArticalCategory } from '../../model/articalCategory.model';
import { ArticalCategoiesService } from '../../services/articalCategory.service';
declare var $: { summernote: { ui: any } };

@Component({
  selector: 'app-edit-articles',
  templateUrl: './edit-articles.component.html',
  styleUrls: ['./edit-articles.component.css'],
})
export class EditArticlesComponent {
  articleForm!: FormGroup;
  selectedCategories: string[] = [];
  singleArticle!: any;
  dropdownSettings: {};
  editor = ClassicEditor;
  nullImagePath = environment.nullImagePath;
  data: any;
  articleCategoryData: any;
  subCategories: any;
  selectedSubCategoryId: any;

  constructor(
    private fb: FormBuilder,
    private posts: AllPostsService,
    private router: Router,
    private route: ActivatedRoute,
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
  }

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      articleName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subCategory: ['', [Validators.required]],
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
        this.getCategoryArticle();
      }
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
      formData.append(
        'articleTypeId',
        JSON.stringify([this.articleForm.value.subCategory])
      );
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
      description: this.singleArticle.data.description,
      meta: this.singleArticle.data.meta_description,
      slug: this.singleArticle.data.slug,
      category:
        this.singleArticle.data.article_with_types[0]?.article_type.isParent,
      subCategory: this.singleArticle.data.article_with_types[0]?.articleTypeId,
    });

    this.subCategories = this.data.filter(
      (category: { isParent: number }) =>
        category.isParent ==
        this.singleArticle.data.article_with_types[0]?.article_type.isParent
    );
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
      (category: { id: number }) => category.id === categoryId
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
      this.articleForm.patchValue({ bannerImage: file });
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
      this.showThumbnailCropper = false;
      this.showBannerCropper = false;
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
  onCategorySelect(item: { id: String | number }) {
    const index = this.selectedCategories.indexOf(item.id.toString());
    if (index === -1) {
      this.selectedCategories.push(item.id.toString());
    } else {
      this.selectedCategories.splice(index, 1);
    }
    console.log('Selected Category:', this.selectedCategories);
  }

  getCategoryArticle() {
    this.articleCategory.getArticalCategory().subscribe((res: any) => {
      if (res) {
        this.data = res.data;
        this.articleCategoryData = this.data.filter(
          (category: { isParent: null }) => category.isParent === null
        );
        this.setFormValues();
      }
    });
  }

  onCategoryChange(id: any) {
    this.subCategories = this.data.filter(
      (category: { isParent: number }) => category.isParent == id
    );

    this.selectedSubCategoryId = null;
    this.articleForm.get('subCategory')?.setValue(null);
  }

  onCategoryDeSelect(item: { id: String | number }) {
    const index = this.selectedCategories.findIndex(
      (cat) => cat === item.id.toString()
    );
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
    console.log('Deselected Category:', this.selectedCategories);
  }

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

  public enableEditor() {
    this.editorDisabled = false;
  }

  public disableEditor() {
    this.editorDisabled = true;
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
