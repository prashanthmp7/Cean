import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authenticationService.isLoggedIn && this.authenticationService.currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authenticationService.currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}
