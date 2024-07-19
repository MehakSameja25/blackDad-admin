import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CategoiesService } from '../services/categoies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllPostsService } from '../services/all-posts.service';
import { MainNavService } from '../services/main-nav.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

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

  addPermission: any;
  editPermission: any;
  deletePermission: any;
  selectedFile: any;

  constructor(
    private categoriesService: CategoiesService,
    private modalService: NgbModal,
    private formB: FormBuilder,
    private allPost: AllPostsService,
    private navService: MainNavService
  ) {
    this.addCategoryForm = this.formB.group({
      name: ['', [Validators.required]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.editCategoryForm = this.formB.group({
      name: ['', [Validators.required]],
      image: ['', []],
      description: ['', [Validators.required]],
    });
  }

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
    this.addCategoryForm.reset();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
    });
  }

  openEdit(content: any, id: any) {
    this.editCategoryForm.reset();
    this.categoriesService.getCategoryById(id).subscribe((Response: any) => {
      this.singleCategoryData = Response.data;
      // this.selectedFile = this.singleCategoryData.image;
      if (this.singleCategoryData) {
        this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
          windowClass: 'share-modal',
        });
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
    if (this.addCategoryForm.invalid) {
      console.log('Form is invalid');
      this.validateAllFormFields(this.addCategoryForm);
      return;
    }

    console.log('Form is valid. Submitting...');

    const formData = this.prepareFormData(this.addCategoryForm);

    this.categoriesService.addCategory(formData).subscribe(
      (res) => {
        console.log('API Response:', res);

        if (res) {
          this.successMessage = 'Category Added';
          this.successalertClass = '';
          this.ngOnInit();
          this.addCategoryForm.reset();
          this.modalService.dismissAll();

          setTimeout(() => {
            this.successMessage = '';
            this.successalertClass = 'd-none';
          }, 5000);
        }
      },
      (error) => {
        alert(`API Error:, ${error}`);
      }
    );
  }

  editCategory() {
    if (this.editCategoryForm.invalid) {
      console.log('Form is invalid');
      this.validateAllFormFields(this.editCategoryForm);
      return;
    }

    console.log('Form is valid. Submitting...');

    const formData = this.prepareFormData(this.editCategoryForm);

    formData.append('isblock', this.singleCategoryData.isblock);

    this.categoriesService
      .editCategory(formData, this.singleCategoryData.id)
      .subscribe(
        (res) => {
          if (res) {
            console.log(res);
            this.successMessage = 'Category Updated';
            this.successalertClass = '';
            this.ngOnInit();
            this.editCategoryForm.reset();
            this.modalService.dismissAll();

            setTimeout(() => {
              this.successMessage = '';
              this.successalertClass = 'd-none';
            }, 5000);
          }
        },
        (error) => {
          console.error('API Error:', error);
          // Handle API error if needed
        }
      );
  }

  deleteCategory() {
    this.categoriesService.deleteCategory(this.deleteId).subscribe((res) => {
      if (res) {
        this.successMessage = 'Category Deleted';
        this.successalertClass = '';
        this.ngOnInit();
        this.modalService.dismissAll();

        setTimeout(() => {
          this.successMessage = '';
          this.successalertClass = 'd-none';
        }, 5000);
      }
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

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

  prepareFormData(form: FormGroup): FormData {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('image', this.fileName);
    formData.append('description', form.value.description);
    return formData;
  }

  fileName: any = '';

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          document
            .getElementById('thumbnailPreview')!
            .setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(file);
        this.editCategoryForm.patchValue({ thumbnailImage: file });
        console.log(this.fileName);
      }
    }
  }
  isCheckBlock(categoryData: any, type: any) {
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
}
