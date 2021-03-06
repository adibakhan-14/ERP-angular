import { Injectable,Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services';
import { environment } from 'src/environments/environment';

// import { environment } from '@environments/environment';
// import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService,
        @Inject("BASE_API_URL") private baseUrl: string,
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        // const user = this.accountService.userValue;
        // const isLoggedIn = user && user.token;
        // const isApiUrl = request.url.startsWith(environment.apiUrl);
        // if (isLoggedIn && isApiUrl) {
        //     request = request.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${user.token}`
        //         }
        //     });
        // }

        request = request.clone({ url: `${this.baseUrl}${request.url}` });
        return next.handle(request);
    }
}
