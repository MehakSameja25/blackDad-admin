import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCategoryService } from '../../services/product-category.service';
import { Menu } from '../../model/menu.model';
import { MainNavService } from '../../services/main-nav.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css'],
})
export class ProductCategoriesComponent implements OnInit {
  addCategoryForm!: FormGroup;
  editCategoryForm!: FormGroup;
  editId!: string | null;
  deleteId!: string | null;

  /** --Modal Declarations-- **/
  @ViewChild('contentt')
  public deleteModel!: ElementRef;

  @ViewChild('edit')
  public editModel!: ElementRef;

  /** --Table Declarations **/
  @ViewChild('dataTable', { static: false })
  public table!: ElementRef;
  public tableData = [];
  public tableColumns: { title: string }[] = [
    { title: 'Name' },
    { title: 'Created At' },
    { title: 'Action' },
  ];

  constructor(
    private modalService: NgbModal,
    private formB: FormBuilder,
    private _categoryService: ProductCategoryService,
    private renderer: Renderer2,
    private navService: MainNavService
  ) {
    this.addCategoryForm = this.formB.group({
      name: ['', [Validators.required]],
    });

    this.editCategoryForm = this.formB.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getList();
  }

  /**----- For listing Category -----**/

  getList() {
    this._categoryService.list().subscribe((res: any) => {
      if (res) {
        this.tableData = res.data.map((item: any) => [
          item.category,
          item.created_at.split('T')[0],
          `<div class="actions d-flex align-items-center gap-2">
          <a class="btn-action-icon" data-id="${item.id}" data-action="open">
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
          </a>
          <a class="btn-action-icon" data-id="${item.id}" data-action="edit">
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
                   </a>
        </div>`,
        ]);

        setTimeout(() => this.bindEvents(), 0);
      }
    });
  }

  bindEvents(): void {
    const tableElement = this.table.nativeElement;
    const actionButtons = tableElement.querySelectorAll(
      '.btn-action-icon, .btn-danger'
    );

    actionButtons.forEach((button: HTMLElement) => {
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      switch (action) {
        case 'open':
          this.renderer.listen(button, 'click', () =>
            this.open(this.deleteModel, id)
          );
          break;
        case 'edit':
          this.renderer.listen(button, 'click', () =>
            this.openEdit(this.editModel, id)
          );
          break;
        default:
          break;
      }
    });
  }

  /**----- For Adding Category -----**/
  openAdd(content: TemplateRef<unknown>) {
    this.addCategoryForm.reset();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-md',
    });
  }

  addCategory() {
    if (this.addCategoryForm.invalid) {
      this.addCategoryForm.markAllAsTouched();
    } else {
      const body = {
        category: this.addCategoryForm.value.name,
      };
      this._categoryService.add(body).subscribe((res) => {
        if (res) {
          this.modalService.dismissAll();
          this.getList();
        }
      });
    }
  }

  /**----- For Updating Category -----**/

  openEdit(content: ElementRef<unknown>, id: string | null) {
    this.editId = id;
    this.editCategoryForm.reset();
    this._categoryService.get(id).subscribe((Response: any) => {
      if (Response) {
        this.editCategoryForm.patchValue({
          name: Response.data.category,
        });
        this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
          windowClass: 'share-modal',
          modalDialogClass: 'modal-dialog-centered modal-md',
        });
      }
    });
  }

  editCategory() {
    if (this.editCategoryForm.invalid) {
      this.editCategoryForm.markAllAsTouched();
    } else {
      const body = {
        category: this.editCategoryForm.value.name,
      };
      this._categoryService.update(this.editId, body).subscribe((res) => {
        if (res) {
          this.modalService.dismissAll();
          this.getList();
        }
      });
    }
  }

  /**----- For deleting Category -----**/
  open(content: ElementRef<unknown>, id: string | null) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-md',
    });
  }

  delete() {
    this._categoryService.delete(this.deleteId).subscribe((res) => {
      if (res) {
        this.modalService.dismissAll();
        this.getList();
      }
    });
  }
  addPermission!: boolean;
  editPermission!: boolean;
  deletePermission!: boolean;
  checkPermissions() {
    this.navService.getMenu().subscribe((res: Menu) => {
      if (res && res.data) {
        for (let permission of res.data[0].role_accesses) {
          if ((permission.menu_bar.title == 'Product Categories') === true) {
            this.addPermission = permission.status.includes('add');
            this.editPermission = permission.status.includes('edit');
            this.deletePermission = permission.status.includes('delete');
          }
        }
        this.getList();
      }
    });
  }
}
