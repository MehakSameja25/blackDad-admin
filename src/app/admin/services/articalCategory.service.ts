import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root',
})
export class ArticalCategoiesService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  getArticalCategory(): Observable<Category> {
    return this.http.get<Category>(`${environment.apiUrl}/get-article-type`);
  }

  addArticalCategory(body: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-article-type`, body),
      {
        notificationsService: this.notifications,
        action: 'Adding Category',
      }
    );
  }

  editArticalCategory(body: any, id: any) {
    return apiCallWrapper(
      this.http.put(
        `${environment.apiUrl}/update-article-type?articleTypeId=${id}`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Category',
      }
    );
  }

  deleteArticalCategory(id: any) {
    return apiCallWrapper(
      this.http.delete(
        `${environment.apiUrl}/delete-article-type?articleTypeId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Category',
      }
    );
  }

  reorder(data: any) {
    return this.http.put(`${environment.apiUrl}/reorder-parent-category`, data);
  }
}
