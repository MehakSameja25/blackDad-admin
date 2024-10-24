import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArticalCategoiesService } from '../services/articalCategory.service';
import { ArticalCategory } from '../model/articalCategory.model';
import { Menu } from '../model/menu.model';
import { MainNavService } from '../services/main-nav.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ArticlePopupService } from '../services/article-popup.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-artical-types',
  templateUrl: './artical-types.component.html',
  styleUrls: [],
})
export class ArticalTypesComponent implements OnInit {
  public addCategoryForm: FormGroup;
  public parentCategory: ArticalCategory[] = [];
  public subcategories: ArticalCategory[] = [];
  public isSubCategory: boolean = false;
  parentId!: number | null;
  activeParentId!: number | null;
  @ViewChild('addModel')
  public catModel!: ElementRef;
  editData: any;
  default: boolean = true;
  deleteId!: string | number;
  modalHeading!: string;
  modalReference: any;
  addCategoryFormGroup: FormGroup;
  popupType!: string;
  fileName: any;
  popupHeader!: string;

  constructor(
    private formB: FormBuilder,
    private modalService: NgbModal,
    private articalCategory: ArticalCategoiesService,
    private navService: MainNavService,
    private popUpService: ArticlePopupService
  ) {
    this.addCategoryForm = this.formB.group({
      name: ['', [Validators.required]],
      parent: [0],
    });
    this.activeParentId = null;

    this.addCategoryFormGroup = this.formB.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
      ctaButton: ['', Validators.required],
      timeout: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.checkPermissions();
  }

  addPermission: boolean = false;
  editPermission: boolean = false;
  deletePermission: boolean = false;

  checkPermissions() {
    this.navService.getMenu().subscribe((res: Menu) => {
      if (res && res.data) {
        for (let permission of res.data[0].role_accesses) {
          if ((permission.menu_bar.title == 'Article Categories') === true) {
            this.addPermission = permission.status.includes('add');
            this.editPermission = permission.status.includes('edit');
            this.deletePermission = permission.status.includes('delete');
            this.fetchCategory();
          }
        }
      }
    });
  }

  fetchCategory() {
    this.articalCategory.getArticalCategory().subscribe((res: any) => {
      this.parentCategory = res.data.filter(
        (category: any) => category.parent === null
      );
      this.subcategories = res.data.filter(
        (category: any) => category.parent !== null
      );

      if (this.parentCategory.length > 0 && this.default) {
        this.activeParentId = this.parentCategory[0].id;
      }
    });
  }

  fetchSubcategories(id: number) {
    return this.subcategories.filter((data) => data.isParent == id);
  }

  openAdd(
    content: TemplateRef<unknown>,
    type: string,
    isSubCategory = false,
    id: number | null = null
  ) {
    this.modalHeading = type;
    this.addCategoryForm.reset();
    this.isSubCategory = isSubCategory;
    this.parentId = id;
    console.log(isSubCategory, this.parentId, 'pppppppppp');
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
    });
    this.modalReference.result.then(
      (result: any) => {
        this.parentId = null;
        this.isSubCategory = false;
        this.editData = null;
      },
      (reason: any) => {
        this.parentId = null;
        this.isSubCategory = false;
        this.editData = null;
      }
    );
  }

  addCategory() {
    if (!this.addCategoryForm.invalid) {
      this.addCategoryForm.patchValue({
        parent: this.parentId,
      });
      this.default = false;
      if (this.editData) {
        const item = {
          id: this.editData.id,
          name: this.addCategoryForm.value.name,
        };
        this.articalCategory
          .editArticalCategory(item, item.id)
          .subscribe((res) => {
            this.fetchCategory();
            this.modalService.dismissAll();
            this.editData = null;
            this.addCategoryForm.reset();
            if (this.parentId) {
              this.activeParentId = this.parentId;
            }
          });
      } else {
        this.articalCategory
          .addArticalCategory(this.addCategoryForm.value)
          .subscribe((res) => {
            this.fetchCategory();
            this.modalService.dismissAll();
            this.addCategoryForm.reset();
            if (this.parentId) {
              this.activeParentId = this.parentId;
            }
          });
      }
    } else {
      this.addCategoryForm.markAllAsTouched();
    }
  }

  editCategory(data: any, type: string) {
    this.modalHeading = type;
    this.editData = data;
    this.addCategoryForm.patchValue({ name: this.editData.name });
    this.modalReference = this.modalService.open(this.catModel, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
    });
    this.modalReference.result.then(
      (result: any) => {
        this.parentId = null;
        this.isSubCategory = false;
        this.editData = null;
      },
      (reason: any) => {
        this.parentId = null;
        this.isSubCategory = false;
        this.editData = null;
      }
    );
  }

  open(content: TemplateRef<unknown>, id: string | number) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-md',
    });
  }

  deleteCategory() {
    this.default = false;
    const categoryToDelete = this.subcategories.find(
      (sub) => sub.id == this.deleteId
    );
    const parentId = categoryToDelete ? categoryToDelete.isParent : null;

    this.articalCategory
      .deleteArticalCategory(this.deleteId)
      .subscribe((res) => {
        this.fetchCategory();
        this.modalService.dismissAll();

        if (parentId) {
          this.activeParentId = parentId;
        }
      });
  }

  toggleActive(parentId: number) {
    if (this.activeParentId === parentId) {
      this.activeParentId = null;
    } else {
      this.activeParentId = parentId;
    }
  }

  drop(event: CdkDragDrop<ArticalCategory[]>) {
    moveItemInArray(
      this.parentCategory,
      event.previousIndex,
      event.currentIndex
    );
    this.reorder();
    this.activeParentId = null;
  }

  reorder() {
    const body = {
      articleType: this.parentCategory.map((category) => category.id),
    };

    this.articalCategory.reorder(body).subscribe((res) => {
      this.fetchCategory();
    });
  }

  dropSubcategory(event: CdkDragDrop<ArticalCategory[]>, parentId: number) {
    const subcategories = this.fetchSubcategories(parentId);
    moveItemInArray(subcategories, event.previousIndex, event.currentIndex);

    this.reorderSubcategories(subcategories.map((sub) => sub.id));
  }

  reorderSubcategories(subcategoryIds: number[]) {
    const body = {
      articleType: subcategoryIds,
    };

    this.articalCategory.reorder(body).subscribe((res) => {
      this.fetchCategory();
    });
  }

  showImageRequired: boolean = true;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file) {
        this.showImageRequired = false;
        this.fileName = file;
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          const previewElement = document.getElementById('thumbnailPreview');
          if (previewElement) {
            previewElement.setAttribute('src', result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  popModalOpen(
    content: TemplateRef<unknown>,
    articleType: string,
    type: string
  ) {
    this.addCategoryFormGroup.reset();
    this.popupType = articleType;
    this.popupHeader = type;
    this.categoryImage = null;
    this.addCategoryFormGroup
      .get('image')
      ?.setValidators([Validators.required]);

    if (type === 'Edit') {
      this.getPopUp();
    }

    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
    });
  }

  categoryImage: any;

  categoryPopUp(): void {
    if (this.addCategoryFormGroup.valid) {
      this.addPopup();
    } else {
      this.addCategoryFormGroup.markAllAsTouched();
    }
  }

  addPopup(id: number | null = null) {
    const formData = this.createFormData(
      this.addCategoryFormGroup.value.name,
      this.addCategoryFormGroup.value.ctaButton,
      this.addCategoryFormGroup.value.description,
      this.addCategoryFormGroup.value.timeout
    );

    this.popUpService.add(formData).subscribe(
      (response) => {
        this.modalService.dismissAll();
        this.addCategoryFormGroup.reset();
        this.categoryImage = null;
        this.checkPermissions();
      },
      (error) => {
        this.modalService.dismissAll();
      }
    );
  }

  createFormData(
    header: string,
    ctaButton: string,
    description: string,
    timeout: string
  ): FormData {
    const formData = new FormData();
    formData.append('header', header);
    formData.append('cta_button', ctaButton);
    formData.append('body', description);
    formData.append('type', this.popupType);
    formData.append('timeOut', timeout);

    if (this.fileName) {
      formData.append('image', this.fileName);
    }

    return formData;
  }

  getPopUp() {
    this.popUpService.get(this.popupType).subscribe((res: any) => {
      if (res) {
        this.setFormValues(res.data);
      }
    });
  }

  setFormValues(response: any) {
    this.addCategoryFormGroup.patchValue({
      name: response.header,
      description: response.body,
      ctaButton: response.cta_button,
      timeout: response.timeOut,
    });

    if (response.popup_image) {
      this.categoryImage = response.popup_image;
      this.showImageRequired = false;
      this.addCategoryFormGroup.get('image')?.clearValidators();
    } else {
      this.showImageRequired = true;
      this.addCategoryFormGroup
        .get('image')
        ?.setValidators([Validators.required]);
    }
    this.addCategoryFormGroup.get('image')?.updateValueAndValidity();

    const previewElement = document.getElementById('thumbnailPreview');
    if (previewElement) {
      previewElement.setAttribute('src', response.popup_image || '');
    }
  }
}
