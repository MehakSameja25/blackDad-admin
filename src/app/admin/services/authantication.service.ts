import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthanticationService {
  constructor(private http: HttpClient) {}

  AdminAuthantication(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/login`, data);
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('nkt');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('nkt');
  }

  updateProfile(body: any) {
    return this.http.put<any>(`${environment.apiUrl}/update-user?type=editUser`, body);
  }
  getUserById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/get-userById?userId=${id}`);
  }
}
