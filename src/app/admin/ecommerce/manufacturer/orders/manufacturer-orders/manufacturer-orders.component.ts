import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ProductsService } from '../../../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manufacturer-orders',
  templateUrl: './manufacturer-orders.component.html',
  styleUrls: ['./manufacturer-orders.component.css'],
})
export class ManufacturerOrdersComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) table!: ElementRef;

  tableData: any[] = [];

  tableColumns = [
    { title: 'Image' },
    { title: 'Product Name' },
    { title: 'Gender' },
    { title: 'Quantity' },
    { title: 'Price' },
    { title: 'Created At' },
    { title: 'Details' },
  ];

  constructor(
    private orderService: ProductsService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe((res: any) => {
      if (res) {
        this.tableData = res.data[0]?.cartItem?.map((item: any) => [
          `<div class="table-img"><img src="${item.product?.productImage}" alt="Thumbnail" style="width: 34px; height: auto;"></div>`,
          item.product?.product_name,
          item.gender,
          item.quantity,
          '$' + item.price,
          item.created_at.split('T')[0],
          `<div class="actions d-flex align-items-center gap-2">
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
          </a></div>`,
        ]);
        setTimeout(() => this.bindEvents(), 0);
      }
    });
  }

  /**
   * @description  Attaches event listeners to action buttons within the table. Each button's action (e.g., open, edit, details, block, share) is handled based on its 'data-action' attribute, and the corresponding method is called with the button's 'data-id' as an argument.
   */
  bindEvents(): void {
    const tableElement = this.table.nativeElement;
    const actionButtons = tableElement.querySelectorAll(
      '.btn-action-icon, .btn-danger'
    );

    actionButtons.forEach((button: HTMLElement) => {
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      switch (action) {
        case 'details':
          this.renderer.listen(button, 'click', () => this.toDetails(id));
          break;

        default:
          break;
      }
    });
  }

  toDetails(id: string | null) {
    this.router.navigate([`/manufacturer/order/view/${id}`]);
  }
}
