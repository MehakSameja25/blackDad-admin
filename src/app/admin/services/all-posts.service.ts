import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiCallWrapper } from './api.util';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class AllPostsService {
  userId: any = localStorage.getItem('userId');

  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  /** -------------------------------------------------------------------------------------------------
   * ------------------------------------FOR EPISODES -------------------------------------------------
   ---------------------------------------------------------------------------------------------------*/
  getEpisodes(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/get-song`, body),
      {
        notificationsService: this.notifications,
        action: 'Fecthing All Episodes',
      }
    );
  }

  getEpisodeDetails(id: any) {
    return apiCallWrapper(
      this.http.get<any>(`${environment.apiUrl}/get-songById?songId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Fecthing Episode Details',
      }
    );
  }
  addEpisode(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/add-song`, body),
      {
        notificationsService: this.notifications,
        action: 'Adding Episode',
      }
    );
  }
  deleteEpisode(id: any) {
    return apiCallWrapper(
      this.http.put<any>(
        `${environment.apiUrl}/delete-song?songId=${id}&userId=${this.userId}`,
        {}
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Episode',
      }
    );
  }
  updateEpisode(id: any, body: any) {
    return apiCallWrapper(
      this.http.put<any>(`${environment.apiUrl}/edit-song?songId=${id}`, body),
      {
        notificationsService: this.notifications,
        action: 'Updating Episode',
      }
    );
  }
  /** -------------------------------------------------------------------------------------------
   * ------------------------------------FOR ARTICLE --------------------------------------------
   ---------------------------------------------------------------------------------------------*/
  getArticles(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/get-article`, body),
      {
        notificationsService: this.notifications,
        action: 'Fecthing All Articles',
      }
    );
  }

  getArticlesDetails(id: any) {
    return apiCallWrapper(
      this.http.get<any>(
        `${environment.apiUrl}/get-articleById?articleId=${id}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Fecthing Article Details',
      }
    );
  }
  addArticle(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/add-article`, body),
      {
        notificationsService: this.notifications,
        action: 'Adding Article',
      }
    );
  }
  deleteArticle(id: any) {
    return apiCallWrapper(
      this.http.put<any>(
        `${environment.apiUrl}/delete-article?articleId=${id}&userId=${this.userId}`,
        {}
      ),
      {
        notificationsService: this.notifications,
        action: 'Deleting Article',
      }
    );
  }
  updateArticle(id: any, body: any) {
    return apiCallWrapper(
      this.http.put<any>(
        `${environment.apiUrl}/edit-article?articleId=${id}`,
        body
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Article',
      }
    );
  }
  /** -------------------------------------------------------------------------------------------
   * --------------------------------FOR STATUS AND FILTER----------------------------------------
   ---------------------------------------------------------------------------------------------*/

  updateIsblock(id: string | null, type: string) {
    return apiCallWrapper(
      this.http.get<any>(
        `${environment.apiUrl}/update-status?id=${id}&menu=${type}`
      ),
      {
        notificationsService: this.notifications,
        action: 'Updating Block Status',
      }
    );
  }
  updateIsApproved(id: any, type: any, approve: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/update-approval?id=${id}&menu=${type}&value=${approve}`
    );
  }
  updateIsPublished(id: any, type: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/update-publish?id=${id}&menu=${type}`
    );
  }

  //  ADD ADVERTISEMENT
  addAdvertisement(body: any) {
    return apiCallWrapper(
      this.http.post<any>(`${environment.apiUrl}/add-advertisement`, body),
      {
        notificationsService: this.notifications,
        action: 'Adding Advertisement',
      }
    );
  }

  /** --------------------------------------------------------------------------------------------
   * ------------------------------------------FOR DRAFT------------------------------------------
   ----------------------------------------------------------------------------------------------*/

  updateDraft(id: any, body: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/update-draft?draftId=${id}`,
      body
    );
  }

  getDraft(type: any) {
    return apiCallWrapper(
      this.http.get<any>(`${environment.apiUrl}/get-draft?type=${type}`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Draft',
      }
    );
  }

  deleteDraft(id: any) {
    return apiCallWrapper(
      this.http.put(`${environment.apiUrl}/delete-draft?draftId=${id}`, {}),
      {
        notificationsService: this.notifications,
        action: 'Deleting Draft',
      }
    );
  }

  getSingleDraft(id: any) {
    return apiCallWrapper(
      this.http.get<any>(`${environment.apiUrl}/get-draftById?draftId=${id}`),
      {
        notificationsService: this.notifications,
        action: 'Fetching Draft Detail',
      }
    );
  }

  getSeasons() {
    return this.http.get<any>(`${environment.apiUrl}/get-season`);
  }
}
