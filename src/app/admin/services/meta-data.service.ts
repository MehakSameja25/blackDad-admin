import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  constructor(private http: HttpClient) {}

  getMeta() {
    return this.http.get(`${environment.apiUrl}/getMetas`);
  }

  getAdvertisements() {
    return this.http.get(`${environment.apiUrl}/get-advertisement`);
  }
  deleteAdvertisements(id: any) {
    return this.http.delete(
      `${environment.apiUrl}/delete-advertisement?advertisementId=${id}`
    );
  }
  UpdateAdvertisements(id: any, body: any) {
    return this.http.put(
      `${environment.apiUrl}/update-advertisement?advertisementId=${id}`,
      body
    );
  }
  getAdvertisementsByid(id: any) {
    return this.http.get(
      `${environment.apiUrl}/get-advertismentById?advertisementId=${id}`
    );
  }
  filterAdvertisement(search: any) {
    return this.http.get(
      `${environment.apiUrl}/get-advertisement?search=${search}`
    );
  }

  getMetaDetail(metaFor: any) {
    return this.http.get(`${environment.apiUrl}/get-meta?meta_for=${metaFor}`);
  }
  updateMeta(body: any) {
    return this.http.put(`${environment.apiUrl}/update-meta`, body);
  }
}
