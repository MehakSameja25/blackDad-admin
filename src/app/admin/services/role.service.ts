import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  getRoles() {
    return apiCallWrapper(this.http.get(`${environment.apiUrl}/get-role`), {
      notificationsService: this.notifications,
      action: 'Fetching Roles',
    });
  }

  addMember(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/add-user-with-role`, body),
      {
        notificationsService: this.notifications,
        action: 'Adding Member',
      }
    );
  }

  getMember() {
    return apiCallWrapper(
      this.http.get<any>(`${environment.apiUrl}/get-user`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Members',
      }
    );
  }

  assignRole(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/assign-role`, body),
      {
        notificationsService: this.notifications,
        action: 'Assigning Role',
      }
    );
  }

  delteMember(id: any) {
    return apiCallWrapper(
      this.http.delete<any>(`${environment.apiUrl}/delete-user?userId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Deleting Member',
      }
    );
  }

  delteRole(id: any) {
    return apiCallWrapper(
      this.http.delete<any>(`${environment.apiUrl}/delete-role?roleId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Deleting Role',
      }
    );
  }

  addRole(data: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/add-role`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding Role',
      }
    );
  }

  editRole(data: any, roleId: number) {
    return apiCallWrapper(
      this.http.put<any>(
        `${environment.apiUrl}/edit-role?roleId=${roleId}`,
        data
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Role',
      }
    );
  }

  updateUser(type: any, id: any, body: any) {
    return apiCallWrapper(
      this.http.put<any>(
        `${environment.apiUrl}/update-user?type=${type}&userId=${id}`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Member',
      }
    );
  }

  getMemberById(id: any) {
    return apiCallWrapper(
      this.http.get<any>(`${environment.apiUrl}/get-userById?userId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Member Details',
      }
    );
  }

  getRoleWithId(id: any) {
    return apiCallWrapper(
      this.http.get<any>(`${environment.apiUrl}/get-roleById?roleId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Role Details',
      }
    );
  }

  updatePassword(proof: string, body: { password: string }) {
    return apiCallWrapper(
      this.http.put<any>(
        `${environment.apiUrl}/set-password?proof=${proof}`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Setting Password',
      }
    );
  }
}
