import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';

@Injectable({
  providedIn: 'root',
})
export class ArticlePopupService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  add(data: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-article-popup`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding Pop-up',
      }
    );
  }

  get(data: any) {
    return this.http.get(
      `${environment.apiUrl}/get-article-popup?type=${data}`
    );
  }
}
