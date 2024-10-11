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

  constructor(
    private formB: FormBuilder,
    private modalService: NgbModal,
    private articalCategory: ArticalCategoiesService,
    private navService: MainNavService
  ) {
    this.addCategoryForm = this.formB.group({
      name: ['', [Validators.required]],
      parent: [0],
    });
    this.activeParentId = null;
  }

  ngOnInit() {
    this.checkPermissions();
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
        console.log('hello000000000000');
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
    }
  }

  fetchSubcategories(id: number) {
    return this.subcategories.filter((data) => data.isParent == id);
  }

  toggleActive(parentId: number) {
    if (this.activeParentId === parentId) {
      this.activeParentId = null; // Deactivate if already active
    } else {
      this.activeParentId = parentId; // Set the clicked parent as active
    }
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

        // Set the active parent to the deleted child's parent
        if (parentId) {
          this.activeParentId = parentId;
        }
      });
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
}
