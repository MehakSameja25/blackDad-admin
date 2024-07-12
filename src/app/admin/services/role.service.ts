import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get(`${environment.apiUrl}/get-role`);
  }

  addMember(body: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/add-user-with-role`,
      body
    );
  }

  getMember() {
    return this.http.get<any>(`${environment.apiUrl}/get-user`);
  }

  assignRole(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/assign-role`, body);
  }

  delteMember(id: any) {
    return this.http.delete<any>(
      `${environment.apiUrl}/delete-user?userId=${id}`
    );
  }

  delteRole(id: any) {
    return this.http.delete<any>(
      `${environment.apiUrl}/delete-role?roleId=${id}`
    );
  }

  addRole(data: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/add-role`,
      data
    );
  }
  

  updateUser(type: any , body: any) {
    return this.http.put<any>(`${environment.apiUrl}/update-user?type=${type}`, body);
  }
  getMemberById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/get-userById?userId=${id}`);
  }
}
