import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  list() {
    return this.http.get(`${environment.apiUrl}/get-faq`);
  }

  get(id: string | number | null) {
    return this.http.get(`${environment.apiUrl}/get-faq?faqId=${id}`);
  }

  add(data: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/add-faq`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding FAQ',
      }
    );
  }

  delete(id: string | number | null) {
    return apiCallWrapper(
      this.http.delete(`${environment.apiUrl}/delete-faq?faqId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Deleting FAQ',
      }
    );
  }

  update(id: string | null, data: any) {
    return apiCallWrapper(
      this.http.put(`${environment.apiUrl}/edit-faq?faqId=${id}`, data),
      {
        notificationsService: this.notifications,
        action: 'Updating FAQ',
      }
    );
  }
}
