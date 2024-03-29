import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (token) {
        const cloned = request.clone({
            headers: request.headers.set("Authorization",
                "Bearer " + token)
        });

        return next.handle(cloned).pipe( 
          tap({
            error: (err: any) => {
              if (err instanceof HttpErrorResponse) {
                if (err.status !== 401) {
                  return;
                }
                localStorage.clear();
                this.router.navigate(['/login']);
              }
            }
          })
        );
    }
    else {
        return next.handle(request).pipe( 
          tap({
            error: (err: any) => {
              if (err instanceof HttpErrorResponse) {
                if (err.status !== 401) {
                  return;
                }
                this.router.navigate(['/login']);
              }
            }
          })
        );
    }
  }
}
