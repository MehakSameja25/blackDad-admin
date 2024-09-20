import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../../../services/products.service';

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
    { title: 'Stock Quantity' },
    { title: 'Price' },
    { title: 'Details' },
  ];

  constructor(private orderService: ProductsService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe((res: any) => {
      if (res) {
        this.tableData = res.data[0]?.products?.map((item: any) => [
          `<div class="table-img"><img src="${item.productImage}" alt="Thumbnail" style="width: 34px; height: auto;"></div>`,
          item.product_name,
          item.stock_quantity,
          item.price,
          `<ul> ${item.cart_items
            .map(
              (detail: any) =>
                `<li>[ Color: ${detail.product_color?.color} ], [Size: ${detail.product_size?.size}] ,[ Quantity: ${detail.quantity}] </li>`
            )
            .join('')} </ul>`,
        ]);
      }
    });
  }
}
