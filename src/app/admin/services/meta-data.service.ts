import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';
import { MetaList, SingleMeta } from '../model/meta.model';
import { Observable } from 'rxjs';
import { Advertisement, SingleAdvertisement } from '../model/ad.model';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  getMeta(): Observable<MetaList> {
    return apiCallWrapper(
      this.http.get<MetaList>(`${environment.apiUrl}/getMetas`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Meta Data',
      }
    );
  }

  getAdvertisements(body: {}): Observable<Advertisement> {
    return apiCallWrapper(
      this.http.post<Advertisement>(
        `${environment.apiUrl}/getAdvertisment`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Fetching Advertisements',
      }
    );
  }
  deleteAdvertisements(id: any) {
    return apiCallWrapper(
      this.http.delete(
        `${environment.apiUrl}/delete-advertisement?advertisementId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Advertisement',
      }
    );
  }
  UpdateAdvertisements(id: any, body: any) {
    return apiCallWrapper(
      this.http.put(
        `${environment.apiUrl}/update-advertisement?advertisementId=${id}`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Advertisement',
      }
    );
  }
  getAdvertisementsByid(id: any) : Observable<SingleAdvertisement> {
    return apiCallWrapper(
      this.http.get<SingleAdvertisement>(
        `${environment.apiUrl}/get-advertismentById?advertisementId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Fetching Advertisement Detail',
      }
    );
  }
  filterAdvertisement(search: any) {
    return apiCallWrapper(
      this.http.post(`${environment.apiUrl}/get-advertisement`, search),
      {
        notificationsService: this.notifications,
        action: 'Filtering Advertisements',
      }
    );
  }

  getMetaDetail(metaFor: any): Observable<SingleMeta> {
    return apiCallWrapper(
      this.http.get<SingleMeta>(
        `${environment.apiUrl}/getMetas?meta_for=${metaFor}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Fetching Meta Details',
      }
    );
  }
  updateMeta(body: any) {
    return apiCallWrapper(
      this.http.put(`${environment.apiUrl}/update-meta`, body),
      {
        notificationsService: this.notifications,
        action: 'Updating Meta Data',
      }
    );
  }
}
