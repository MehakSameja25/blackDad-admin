import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  list() {
    return apiCallWrapper(
      this.http.get(`${environment.apiUrl}/get-product?type=admin`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Product',
      }
    );
  }

  get(id: string | number | null) {
    return apiCallWrapper(
      this.http.get(`${environment.apiUrl}/get-productById?productId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Product Details',
      }
    );
  }

  add(data: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-product`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding Product',
      }
    );
  }

  delete(id: string | number | null) {
    return apiCallWrapper(
      this.http.delete(`${environment.apiUrl}/delete-product?productId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Deleting Product',
      }
    );
  }

  update(id: string | null, data: any) {
    return apiCallWrapper(
      this.http.put(
        `${environment.apiUrl}/update-product?productId=${id}`,
        data
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Product',
      }
    );
  }

  deleteProductImage(data: {
    productImageId: string | number | null;
    isMatched: boolean;
  }) {
    return this.http.post(`${environment.apiUrl}/delete-product-image`, data);
  }

  reOrderImage(data: any, id: string | null) {
    return this.http.put(
      `${environment.apiUrl}/reorder-product-image?productId=${id}`,
      data
    );
  }

  getOrders() {
    return apiCallWrapper(
      this.http.get(`${environment.apiUrl}/manufacturer-order`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Orders',
      }
    );
  }
  getOrderDetails(id: string | null) {
    return apiCallWrapper(
      this.http.get(
        `${environment.apiUrl}/manufacturer-orderById?cartItemId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Fetching Order Details',
      }
    );
  }
}
