import { SpinnerService } from '@app/shared/services/spinner.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class SpinnerIntercepor implements HttpInterceptor {

  constructor(
    private spinner: SpinnerService,
    private cookieService: CookieService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    const helper = new JwtHelperService();
    let token = this.cookieService.get('token') || null;
    const isExpired = helper.isTokenExpired(token!);
    if (isExpired) {
      token = '';
    }
    let request = req.clone({
      setHeaders: { Authorization: `${token}` },
    });
    return next.handle(request).pipe(
      finalize(() => this.spinner.hide()));
  }
}
