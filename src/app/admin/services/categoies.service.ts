import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoiesService {
  constructor(private http: HttpClient) {}

  getCategory() {
    return this.http.get(`${environment.apiUrl}/get-category?type=all`);
  }

  getCategoryById(id: any) {
    return this.http.get(
      `${environment.apiUrl}/get-categoryById?categoryId=${id}`
    );
  }

  addCategory(body: any) {
    return this.http.post(`${environment.apiUrl}/add-category`, body);
  }

  editCategory(body: any, id: any) {
    return this.http.put(
      `${environment.apiUrl}/update-category?categoryId=${id}`,
      body
    );
  }
  unblockedCategories() {
    return this.http.get(`${environment.apiUrl}/get-category?type=onlyUnblock`);
  }
  deleteCategory(id: any) {
    return this.http.delete(
      `${environment.apiUrl}/delete-category?categoryId=${id}`
    );
  }
}
