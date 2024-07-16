import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllPostsService {
  userId: any = localStorage.getItem('userId');

  constructor(private http: HttpClient) {}

  /** -------------------------------------------------------------------------------------------------
   * ------------------------------------FOR EPISODES -------------------------------------------------
   ---------------------------------------------------------------------------------------------------*/
  getEpisodes() {
    return this.http.get<any>(`${environment.apiUrl}/get-song`);
  }

  getEpisodeDetails(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-songById?songId=${id}`
    );
  }
  addEpisode(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/add-song`, body);
  }
  deleteEpisode(id: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/delete-song?songId=${id}&userId=${this.userId}`,
      {}
    );
  }
  updateEpisode(id: any, body: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/edit-song?songId=${id}`,
      body
    );
  }
  /** -------------------------------------------------------------------------------------------
   * ------------------------------------FOR ARTICLE --------------------------------------------
   ---------------------------------------------------------------------------------------------*/
  getArticles() {
    return this.http.get<any>(
      `${environment.apiUrl}/get-article?pageSize=100&pageNumber=1`
    );
  }

  getArticlesDetails(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-articleById?articleId=${id}`
    );
  }
  addArticle(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/add-article`, body);
  }
  deleteArticle(id: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/delete-article?articleId=${id}&userId=${this.userId}`,
      {}
    );
  }
  updateArticle(id: any, body: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/edit-article?articleId=${id}`,
      body
    );
  }
  /** -------------------------------------------------------------------------------------------
   * --------------------------------FOR STATUS AND FILTER----------------------------------------
   ---------------------------------------------------------------------------------------------*/

  updateIsblock(id: any, type: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/update-status?id=${id}&menu=${type}`
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

  filterPostByFileType(type: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-song?fileType=${type}`
    );
  }
  filterPostByCategory(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-song?categoryId=${id}`
    );
  }
  filterArticleByCategory(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-article?categoryId=${id}`
    );
  }

  //  ADD ADVERTISEMENT
  addAdvertisement(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/add-advertisement`, body);
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
    return this.http.get<any>(`${environment.apiUrl}/get-draft?type=${type}`);
  }

  deleteDraft(id: any) {
    return this.http.put(
      `${environment.apiUrl}/delete-draft?draftId=${id}`,
      {}
    );
  }

  getSingleDraft(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-draftById?draftId=${id}`
    );
  }
}
