import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class AuthanticationService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  AdminAuthantication(data: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/login`, data),
      {
        notificationsService: this.notifications,
        action: 'Login-in',
      }
    );
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('nkt');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('nkt');
  }

  updateProfile(body: any) {
    return apiCallWrapper(
      this.http.put<any>(
        `${environment.apiUrl}/update-user?type=editUser`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Profile',
      }
    );
  }
  getUserById(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-userById?userId=${id}`
    );
  }
  resetPassword(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/forget-password`, body),
      {
        notificationsService: this.notifications,
        action: 'Sending reset link',
      }
    );
  }
}
