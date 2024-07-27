import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class CategoiesService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  getCategory() {
    return apiCallWrapper(
      this.http.get(`${environment.apiUrl}/get-category?type=all`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Categories',
      }
    );
  }

  getCategoryById(id: any) {
    return apiCallWrapper(
      this.http.get(`${environment.apiUrl}/get-categoryById?categoryId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Category Detail',
      }
    );
  }

  addCategory(body: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-category`, body),
      {
        notificationsService: this.notifications,
        action: 'Adding Category',
      }
    );
  }

  editCategory(body: any, id: any) {
    return apiCallWrapper(
      this.http.put(
        `${environment.apiUrl}/update-category?categoryId=${id}`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Category',
      }
    );
  }
  unblockedCategories() {
    return apiCallWrapper(
      this.http.get(`${environment.apiUrl}/get-category?type=onlyUnblock`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Category',
      }
    );
  }
  deleteCategory(id: any) {
    return apiCallWrapper(
      this.http.delete(
        `${environment.apiUrl}/delete-category?categoryId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Category',
      }
    );
  }
}
