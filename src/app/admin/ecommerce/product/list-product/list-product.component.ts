import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from 'src/app/admin/model/menu.model';
import { MainNavService } from 'src/app/admin/services/main-nav.service';
import { ProductsService } from 'src/app/admin/services/products.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
})
export class ListProductComponent implements OnInit {
  deleteId!: string | null;

  /** --Table Declarations **/
  @ViewChild('dataTable', { static: false })
  public table!: ElementRef;
  public tableData = [];
  public tableColumns: { title: string }[] = [
    { title: 'Image' },
    { title: 'Product Name' },
    { title: 'Price' },
    { title: 'Status' },
    { title: 'Action' },
  ];

  /** --Modal Declarations-- **/
  @ViewChild('contentt')
  public deleteModel!: ElementRef;

  constructor(
    private _productsService: ProductsService,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private router: Router,
    private navService: MainNavService
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
  }

  getList() {
    this._productsService.list().subscribe((response: any) => {
      if (response) {
        this.tableData = response.data.product.map((item: any) => [
          `<img src="${
            item.product_images.length ? item.product_images[0].image : ''
          }" alt="Thumbnail" style="border-radius: 10px; width: 60px; height: 60px;">`,
          item.product_name,
          item.price,
          this.getStatus(item.is_stock_available),
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
    <a class="btn-action-icon" data-id="${item.id}" data-action="details">
       <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="16"
                        height="16"
                        x="0"
                        y="0"
                        viewBox="0 0 511.999 511.999"
                        style="enable-background: new 0 0 512 512"
                        xml:space="preserve"
                        class=""
                      >
                        <g>
                          <path
                            d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035a16.896 16.896 0 0 0 0 19.923c4.569 6.257 113.557 153.206 252.748 153.206s248.174-146.95 252.748-153.201a16.875 16.875 0 0 0 0-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.253 31.912-114.868 129.395-217.617 129.395z"
                            fill="#000000"
                            opacity="1"
                            data-original="#000000"
                          ></path>
                          <path
                            d="M255.997 154.725c-55.842 0-101.275 45.433-101.275 101.275s45.433 101.275 101.275 101.275S357.272 311.842 357.272 256s-45.433-101.275-101.275-101.275zm0 168.791c-37.23 0-67.516-30.287-67.516-67.516s30.287-67.516 67.516-67.516 67.516 30.287 67.516 67.516-30.286 67.516-67.516 67.516z"
                            fill="#000000"
                            opacity="1"
                            data-original="#000000"
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
          this.renderer.listen(button, 'click', () => this.toEdit(id));
          break;
        case 'details':
          this.renderer.listen(button, 'click', () => this.toDetails(id));
          break;
        default:
          break;
      }
    });
  }

  toDetails(id: string | null) {
    this.router.navigate([`/details-product/${id}`]);
  }
  toEdit(id: string | null) {
    this.router.navigate([`/edit-product/${id}`]);
  }

  open(content: ElementRef<unknown>, id: string | null) {
    this.deleteId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'share-modal',
      modalDialogClass: 'modal-dialog-centered modal-md',
    });
  }

  delete() {
    this._productsService.delete(this.deleteId).subscribe((res) => {
      if (res) {
        this.getList();
        this.modalService.dismissAll();
      }
    });
  }

  getStatus(status: string | boolean): string {
    console.log(status);
    if (status == true) {
      return `<span class="badge rounded-pill text-bg-success">In Stock</span>`;
    } else if (status == false) {
      return `<span class="badge rounded-pill text-bg-danger">Out of Stock</span>`;
    } else {
      return '';
    }
  }
  addPermission!: boolean;
  editPermission!: boolean;
  deletePermission!: boolean;
  checkPermissions() {
    this.navService.getMenu().subscribe((res: Menu) => {
      if (res && res.data) {
        if (localStorage.getItem('userId') !== '1') {
          for (let permission of res.data[0].role_accesses) {
            if ((permission.menu_bar.title == 'Product') === true) {
              this.addPermission = permission.status.includes('add');
              this.editPermission = permission.status.includes('edit');
              this.deletePermission = permission.status.includes('delete');
              console.log(
                this.addPermission,
                this.editPermission,
                this.deletePermission
              );
              this.getList();
            }
          }
        } else {
          this.getList();
        }
      }
    });
  }
}
