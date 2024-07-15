import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllPostsService {
  userId: any = localStorage.getItem('userId');

  constructor(private http: HttpClient) {}
  getEpisodes() {
    return this.http.get<any>(`${environment.apiUrl}/get-song`);
  }
  getArticles() {
    return this.http.get<any>(
      `${environment.apiUrl}/get-article?pageSize=100&pageNumber=1`
    );
  }
  getEpisodeDetails(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-songById?songId=${id}`
    );
  }
  getArticlesDetails(id: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-articleById?articleId=${id}`
    );
  }

  addEpisode(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/add-song`, body);
  }
  addArticle(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/add-article`, body);
  }

  deleteEpisode(id: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/delete-song?songId=${id}&userId=${this.userId}`,
      {}
    );
  }
  deleteArticle(id: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/delete-article?articleId=${id}&userId=${this.userId}`,
      {}
    );
  }

  updateEpisode(id: any, body: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/edit-song?songId=${id}`,
      body
    );
  }
  updateArticle(id: any, body: any) {
    return this.http.put<any>(
      `${environment.apiUrl}/edit-article?articleId=${id}`,
      body
    );
  }

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

  addAdvertisement(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/add-advertisement`, body);
  }

  filterPostByFileType(type: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/get-song?fileType=${type}`
    );
  }
  filterPostByCategory(id: any) {
    return this.http.get<any>(
      `https://c8xqrpj6-4100.inc1.devtunnels.ms/api/v1/get-song?categoryId=${id}`
    );
  }
  filterArticleByCategory(id: any) {
    return this.http.get<any>(
      `https://c8xqrpj6-4100.inc1.devtunnels.ms/api/v1/get-article?categoryId=${id}`
    );
  }
}
