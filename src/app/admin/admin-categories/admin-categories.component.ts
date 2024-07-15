import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CategoiesService } from '../services/categoies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllPostsService } from '../services/all-posts.service';
import { MainNavService } from '../services/main-nav.service';
import 'datatables.net';
import 'datatables.net-dt';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import DataTable from 'datatables.net-dt';
import DataTables from 'datatables.net';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
  allCategories: any;
  editId: any;
  successalertClass: any = 'd-none';
  successMessage: any = '';

  addCategoryForm!: FormGroup;
  editCategoryForm!: FormGroup;

  errormessage: string = '';
  singleCategoryData: any;
  deleteId: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private categoriesService: CategoiesService,
    private modalService: NgbModal,
    private formB: FormBuilder,
    private allPost: AllPostsService,
    private navService: MainNavService
  ) {
    this.addCategoryForm = this.formB.group({
      name: ['', [Validators.required, Validators.email]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.editCategoryForm = this.formB.group({
      name: ['', [Validators.required, Validators.email]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
  // dtOptions: any = {};
  // dtTrigger: Subject<any> = new Subject<any>();
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.categoriesService.getCategory().subscribe((res) => {
      this.allCategories = res;
      this.dtTrigger.next(this.dtOptions);
    });
    this.checkPermissions();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  openAdd(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }
  //  renderer(): void {
  //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       // Access DataTables API here
  //     });
  //   }
  categoryId: any;
  openEdit(content: any, id: any) {
    this.categoryId = id;
    this.categoriesService.getCategoryById(id).subscribe((Response: any) => {
      this.singleCategoryData = Response.data;
      if (this.singleCategoryData) {
        this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
          windowClass: 'share-modal',
        });
        console.log(this.singleCategoryData);
      }
    });
  }
  openDelete(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }

  addCategory() {
    const formData = new FormData();
    formData.append('name', this.addCategoryForm.value.name);
    formData.append('image', this.fileName);
    formData.append('description', this.addCategoryForm.value.description);
    this.categoriesService.addCategory(formData).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          console.log(res);
          this.successMessage = 'Category Added';
          this.successalertClass = '';
          this.ngOnInit();
          this.addCategoryForm.reset();
          this.modalService.dismissAll();
        }, 1000);
        setTimeout(() => {
          this.successMessage = '';
          this.successalertClass = 'd-none';
        }, 5000);
      }
    });
  }

  editCategory() {
    const formData = new FormData();
    formData.append('name', this.editCategoryForm.value.name);
    formData.append('image', this.fileName);
    formData.append('description', this.editCategoryForm.value.description);
    formData.append('isblock', this.singleCategoryData.isblock);
    setTimeout(() => {
      console.log(formData);
    }, 1000);
    this.categoriesService
      .editCategory(formData, this.categoryId)
      .subscribe((res) => {
        if (res) {
          setTimeout(() => {
            console.log(res);
            this.successMessage = 'Category Updated';
            this.successalertClass = '';
            this.ngOnInit();
            this.editCategoryForm.reset();
            this.modalService.dismissAll();
          }, 1000);
          setTimeout(() => {
            this.successMessage = '';
            this.successalertClass = 'd-none';
          }, 5000);
        }
      });
  }

  checkIsBlock(categoryData: any, type: any) {
    this.allPost.updateIsblock(categoryData.id, type).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          if (categoryData.isblock == false) {
            this.successMessage = 'Category Blocked';
            this.successalertClass = '';
          } else if (categoryData.isblock == true) {
            this.successMessage = 'Category Unblocked';
            this.successalertClass = '';
          }

          this.ngOnInit();
          console.log(res);
        }, 1000);
        setTimeout(() => {
          this.successMessage = '';
          this.successalertClass = 'd-none';
        }, 5000);
      }
    });
  }

  fileName: string = '';

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file;
      console.log(this.fileName);
    }
  }
  deleteCategory() {
    this.categoriesService.deleteCategory(this.deleteId).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.successMessage = 'Category Deleted';
          this.successalertClass = '';
          this.ngOnInit();
          this.modalService.dismissAll();
        }, 1000);
        setTimeout(() => {
          this.successMessage = '';
          this.successalertClass = 'd-none';
        }, 5000);
      }
    });
  }
  addPermission: any;
  editPermission: any;
  deletePermission: any;
  checkPermissions() {
    this.navService.getMenu().subscribe((res: any) => {
      if (res && res.data) {
        for (let permission of res.data[0].role_accesses) {
          if ((permission.menu_bar.title == 'Categories') === true) {
            this.addPermission = permission.status.includes('add');
            this.editPermission = permission.status.includes('edit');
            this.deletePermission = permission.status.includes('delete');
            //  console check
            console.log('add permission', this.addPermission);
            console.log('edit permission', this.editPermission);
            console.log('delete permission', this.deletePermission);
          }
        }
      }
    });
  }
}
