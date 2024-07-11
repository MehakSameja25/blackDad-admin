import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MainNavService {
  constructor(private http: HttpClient) {}

  getMenu() {
    const UserId = localStorage.getItem('userId');
    return this.http.get(`${environment.apiUrl}/get-menu?userId=${UserId}`);
  }
}
