import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CategoiesService } from '../services/categoies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllPostsService } from '../services/all-posts.service';
import { MainNavService } from '../services/main-nav.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  allCategories: any;
  editId: any;
  // successalertClass: any = 'd-none';
  // successMessage: any = '';

  addCategoryForm!: FormGroup;
  editCategoryForm!: FormGroup;

  errormessage: string = '';
  singleCategoryData: any;
  deleteId: any;

  addPermission: any;
  editPermission: any;
  deletePermission: any;
  selectedFile: any;
  tableData = [];

  tableColumns = [
    { title: 'Image' },
    { title: 'Category Name' },
    { title: 'Description' },
    { title: 'Action' },
  ];

  constructor(
    private categoriesService: CategoiesService,
    private modalService: NgbModal,
    private formB: FormBuilder,
    private allPost: AllPostsService,
    private navService: MainNavService,
    private renderer: Renderer2
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
    this.checkPermissions();
  }
  @ViewChild('dataTable', { static: false }) table!: ElementRef;

  getCategory() {
    this.categoriesService.getCategory().subscribe((res: any) => {
      this.allCategories = res;

      this.tableData = res.data.map((item: any) => [
        `<div class="table-img"><img src="${item.image}" alt="Thumbnail" style="width: 34px; height: auto;"></div>`,
        item.name,
        item.description.length > 25
          ? ` ${this.truncateDescription(item.description)}  <span
                          class="badge rounded-pill text-bg-violet"
                          style="cursor: pointer"
                          data-id="${item.id}" data-action="description"
                          >Read more</span
                        >`
          : item.description,
        ` <div class="actions d-flex align-items-center gap-2">
        ${this.editPermission === true
          ? `<a
                            data-id="${item.id}" data-action="edit"
                            class="btn-action-icon"
                            *ngIf="editPermission == true"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 401.523 401"
                              style="enable-background: new 0 0 512 512"
                              xml:space="preserve"
                              class=""
                            >
                              <g>
                                <path
                                  d="M370.59 250.973c-5.524 0-10 4.476-10 10v88.789c-.02 16.562-13.438 29.984-30 30H50c-16.563-.016-29.98-13.438-30-30V89.172c.02-16.559 13.438-29.98 30-30h88.79c5.523 0 10-4.477 10-10 0-5.52-4.477-10-10-10H50c-27.602.031-49.969 22.398-50 50v260.594c.031 27.601 22.398 49.968 50 50h280.59c27.601-.032 49.969-22.399 50-50v-88.793c0-5.524-4.477-10-10-10zm0 0"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                                <path
                                  d="M376.629 13.441c-17.574-17.574-46.067-17.574-63.64 0L134.581 191.848a9.997 9.997 0 0 0-2.566 4.402l-23.461 84.7a9.997 9.997 0 0 0 12.304 12.308l84.7-23.465a9.997 9.997 0 0 0 4.402-2.566l178.402-178.41c17.547-17.587 17.547-46.055 0-63.641zM156.37 198.348 302.383 52.332l47.09 47.09-146.016 146.016zm-9.406 18.875 37.62 37.625-52.038 14.418zM374.223 74.676 363.617 85.28l-47.094-47.094 10.61-10.605c9.762-9.762 25.59-9.762 35.351 0l11.739 11.734c9.746 9.774 9.746 25.59 0 35.36zm0 0"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                              </g>
                            </svg>
                          </a>`
          : ''
        }
                          
                           <a class="btn-action-icon" data-id="${item.id
        }" data-action="block">
        ${item.isblock == 1
          ? `
        <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 34 34"
                              style="enable-background: new 0 0 16 16"
                              xml:space="preserve"
                              class=""
                            >
                              <g>
                                <path
                                  d="M17 1c-5 0-9 4-9 9v4c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3h18c1.7 0 3-1.3 3-3V17c0-1.7-1.3-3-3-3v-4c0-5-4-9-9-9zm10 16v13c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V17c0-.6.4-1 1-1h18c.6 0 1 .4 1 1zm-17-3v-4c0-3.9 3.1-7 7-7s7 3.1 7 7v4z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                                <path
                                  d="M17 19c-1.7 0-3 1.3-3 3 0 1.3.8 2.4 2 2.8V27c0 .6.4 1 1 1s1-.4 1-1v-2.2c1.2-.4 2-1.5 2-2.8 0-1.7-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                  class=""
                                ></path>
                              </g>
                            </svg>
        `
          : `
       <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 512 512"
                              style="enable-background: new 0 0 512 512"
                              xml:space="preserve"
                              class=""
                            >
                              <g>
                                <path
                                  d="M331.312 256c0-16.638-13.487-30.125-30.125-30.125h-241c-16.638 0-30.125 13.487-30.125 30.125v210.875C30.063 483.513 43.55 497 60.188 497h241c16.638 0 30.125-13.487 30.125-30.125V256zM240.938 135.5v90.375h60.25V135.5c0-33.275 26.975-60.25 60.25-60.25s60.25 26.975 60.25 60.25v30.125h60.25V135.5c0-66.55-53.95-120.5-120.5-120.5-66.551 0-120.5 53.95-120.5 120.5z"
                                  style="
                                    stroke-width: 30;
                                    stroke-linejoin: round;
                                    stroke-miterlimit: 10;
                                  "
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="30"
                                  stroke-linejoin="round"
                                  stroke-miterlimit="10"
                                  data-original="#000000"
                                  class=""
                                ></path>
                                <circle
                                  cx="180.688"
                                  cy="346.375"
                                  r="30.125"
                                  style="
                                    stroke-width: 30;
                                    stroke-linejoin: round;
                                    stroke-miterlimit: 10;
                                  "
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="30"
                                  stroke-linejoin="round"
                                  stroke-miterlimit="10"
                                  data-original="#000000"
                                  class=""
                                ></circle>
                                <path
                                  d="M180.688 376.5v30.125"
                                  style="
                                    stroke-width: 30;
                                    stroke-linecap: round;
                                    stroke-linejoin: round;
                                    stroke-miterlimit: 10;
                                  "
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="30"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-miterlimit="10"
                                  data-original="#000000"
                                  class=""
                                ></path>
                              </g>
                            </svg>
        `
        }
          </a>
                        ${this.deletePermission === true
          ? `<a
                            class="btn-action-icon"
                            data-id="${item.id}" data-action="delete"
                            *ngIf="deletePermission == true"
                            (click)="openDelete(deletee, category.id)"
                          >
                            <svg
                              xmlns=" http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 512 512"
                              style="enable-background: new 0 0 512 512"
                              xml:space="preserve"
                            >
                              <g>
                                <path
                                  d="M436 60h-75V45c0-24.813-20.187-45-45-45H196c-24.813 0-45 20.187-45 45v15H76c-24.813 0-45 20.187-45 45 0 19.928 13.025 36.861 31.005 42.761L88.76 470.736C90.687 493.875 110.385 512 133.604 512h244.792c23.22 0 42.918-18.125 44.846-41.271l26.753-322.969C467.975 141.861 481 124.928 481 105c0-24.813-20.187-45-45-45zM181 45c0-8.271 6.729-15 15-15h120c8.271 0 15 6.729 15 15v15H181V45zm212.344 423.246c-.643 7.712-7.208 13.754-14.948 13.754H133.604c-7.739 0-14.305-6.042-14.946-13.747L92.294 150h327.412l-26.362 318.246zM436 120H76c-8.271 0-15-6.729-15-15s6.729-15 15-15h360c8.271 0 15 6.729 15 15s-6.729 15-15 15z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                ></path>
                                <path
                                  d="m195.971 436.071-15-242c-.513-8.269-7.67-14.558-15.899-14.043-8.269.513-14.556 7.631-14.044 15.899l15 242.001c.493 7.953 7.097 14.072 14.957 14.072 8.687 0 15.519-7.316 14.986-15.929zM256 180c-8.284 0-15 6.716-15 15v242c0 8.284 6.716 15 15 15s15-6.716 15-15V195c0-8.284-6.716-15-15-15zM346.927 180.029c-8.25-.513-15.387 5.774-15.899 14.043l-15 242c-.511 8.268 5.776 15.386 14.044 15.899 8.273.512 15.387-5.778 15.899-14.043l15-242c.512-8.269-5.775-15.387-14.044-15.899z"
                                  fill="#000000"
                                  opacity="1"
                                  data-original="#000000"
                                ></path>
                              </g>
                            </svg>
                          </a>`
          : ''
        }  
                        </div>`,
      ]);

      setTimeout(() => this.bindEvents(), 0);
    });
  }

  @ViewChild('deletee')
  public deleteModel!: ElementRef;

  @ViewChild('edit')
  public editModel!: ElementRef;

  @ViewChild('add')
  public addModel!: ElementRef;

  @ViewChild('descriptionn')
  public descModel!: ElementRef;

  bindEvents(): void {
    const tableElement = this.table.nativeElement;
    const actionButtons = tableElement.querySelectorAll(
      '.btn-action-icon, .btn-danger, .badge, .rounded-pill, .text-bg-violet'
    );

    actionButtons.forEach((button: HTMLElement) => {
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      switch (action) {
        case 'delete':
          this.renderer.listen(button, 'click', () =>
            this.openDelete(this.deleteModel, id)
          );
          break;
        case 'edit':
          this.renderer.listen(button, 'click', () =>
            this.openEdit(this.editModel, id)
          );
          break;
        case 'description':
          this.renderer.listen(button, 'click', () =>
            this.openEdit(this.descModel, id)
          );
          break;
        case 'block':
          this.renderer.listen(button, 'click', () => this.isCheckBlock(id));
          break;
        default:
          break;
      }
    });
  }

  openAdd(content: any) {
    this.addCategoryForm.reset();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-lg',
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
          modalDialogClass: 'modal-dialog-centered modal-lg',
        });
      }
    });
  }

  openDelete(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered',
    });
  }

  addCategory() {
    if (this.addCategoryForm.invalid) {
      this.validateAllFormFields(this.addCategoryForm);
      return;
    } else {
      const formData = this.prepareFormData(this.addCategoryForm);

      this.categoriesService.addCategory(formData).subscribe(
        (res) => {
          if (res) {
            this.ngOnInit();
            this.addCategoryForm.reset();
            this.modalService.dismissAll();
          }
        },
        (error) => {
          alert(`API Error:, ${error}`);
        }
      );
    }
  }

  editCategory() {
    if (this.editCategoryForm.invalid) {
      this.validateAllFormFields(this.editCategoryForm);
      return;
    } else {
      const formData = this.prepareFormData(this.editCategoryForm);

      formData.append('isblock', this.singleCategoryData.isblock);

      this.categoriesService
        .editCategory(formData, this.singleCategoryData.id)
        .subscribe((res) => {
          if (res) {
            this.ngOnInit();
            this.editCategoryForm.reset();
            this.modalService.dismissAll();
          }
        });
    }
  }

  deleteCategory() {
    this.categoriesService.deleteCategory(this.deleteId).subscribe((res) => {
      if (res) {
        this.ngOnInit();
        this.modalService.dismissAll();
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
            this.getCategory();
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

  showImageRequired: boolean = true;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file) {
        this.showImageRequired = false;
        this.fileName = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          document
            .getElementById('thumbnailPreview')!
            .setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(file);
        this.editCategoryForm.patchValue({ thumbnailImage: file });
      }
    }
  }
  isCheckBlock(categoryData: any) {
    this.allPost.updateIsblock(categoryData, 'categories').subscribe((res) => {
      if (res) {
        this.ngOnInit();
      }
    });
  }
  truncateDescription(description: string): string {
    return description.length > 25
      ? `${description.slice(0, 25)}...`
      : description;
  }
}
