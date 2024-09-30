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
    });
  }

  openAdd(
    content: TemplateRef<unknown>,
    isSubCategory = false,
    id: number | null = null
  ) {
    this.addCategoryForm.reset();
    this.isSubCategory = isSubCategory;
    this.parentId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
    });
  }

  addCategory() {
    if (!this.addCategoryForm.invalid) {
      this.addCategoryForm.patchValue({
        parent: this.parentId,
      });
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
          });
      } else {
        this.articalCategory
          .addArticalCategory(this.addCategoryForm.value)
          .subscribe((res) => {
            this.fetchCategory();
            this.modalService.dismissAll();
            this.addCategoryForm.reset();
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

  deleteCategory(id: number) {
    this.articalCategory.deleteArticalCategory(id).subscribe((res) => {
      this.fetchCategory();
    });
  }

  editCategory(data: any) {
    this.editData = data;
    this.addCategoryForm.patchValue({ name: this.editData.name });
    this.modalService.open(this.catModel, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
    });
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
