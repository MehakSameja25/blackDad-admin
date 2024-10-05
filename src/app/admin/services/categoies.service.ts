import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { Category, SingleCategory } from '../model/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoiesService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  getCategory(): Observable<Category> {
    return this.http.get<Category>(
      `${environment.apiUrl}/get-category?type=all`
    );
  }

  getCategoryById(id: string | null): Observable<SingleCategory> {
    return this.http.get<SingleCategory>(
      `${environment.apiUrl}/get-categoryById?categoryId=${id}`
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
  unblockedCategories(): Observable<Category> {
    return this.http.get<Category>(
      `${environment.apiUrl}/get-category?type=onlyUnblock`
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
