import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isUpdateDraftRequest = req.url.includes('/update-draft');

    if (isUpdateDraftRequest) {
      return next.handle(req).pipe(
        tap({
          next: (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.loaderService.hide(); 
            }
          },
          error: (error: HttpErrorResponse) => {
            this.loaderService.hide(); 
            return throwError(() => error);
          },
        })
      );
    } else {
      this.loaderService.show(); 

      return next.handle(req).pipe(
        tap({
          next: (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.loaderService.hide(); 
            }
          },
          error: (error: HttpErrorResponse) => {
            this.loaderService.hide();
            return throwError(() => error);
          },
        })
      );
    }
  }
}
