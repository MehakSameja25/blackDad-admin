import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Menu } from '../model/menu.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainNavService {
  constructor(private http: HttpClient) {}

  getMenu() : Observable<Menu> {
    const UserId = localStorage.getItem('userId');
    return this.http.get<Menu>(
      `${environment.apiUrl}/get-menu?userId=${UserId}`
    );
  }
}
