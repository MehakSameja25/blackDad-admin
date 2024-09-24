import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoleList } from '../model/member.model';
import { apiCallWrapper } from './api.util';

@Injectable({
  providedIn: 'root',
})
export class ManufacturerRolesService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  list(): Observable<RoleList> {
    return apiCallWrapper(
      this.http.get<RoleList>(
        `${environment.apiUrl}/get-role?isManufacturer=true`
      ),
      {
        notificationsService: this.notifications,
        action: 'Fetching Manfacturer Roles',
      }
    );
  }
  assign(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/assign-role`, body),
      {
        notificationsService: this.notifications,
        action: 'Assigning Role',
      }
    );
  }
  delete(id: any) {
    return apiCallWrapper(
      this.http.delete<any>(`${environment.apiUrl}/delete-role?roleId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Deleting Role',
      }
    );
  }
  add(data: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/add-role`, data),
      {
        notificationsService: this.notifications,
        action: 'Adding Role',
      }
    );
  }
  edit(data: any, roleId: number) {
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

  get(id: any) {
    return apiCallWrapper(
      this.http.get<any>(`${environment.apiUrl}/get-roleById?roleId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Role Details',
      }
    );
  }
}
