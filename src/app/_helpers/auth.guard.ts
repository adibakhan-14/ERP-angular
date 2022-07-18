import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../_services';
import {Auth} from 'aws-amplify';
import {  Subject } from 'rxjs';
import {pipe} from 'rxjs'
import { Observable,from } from 'rxjs';
import { map,  debounceTime} from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  public loader$ = new Subject<boolean>();
  public loader = false;
    constructor(
        private router: Router,
        private accountService: AccountService
        
    ) {
      this.loader$.pipe(debounceTime(200),)
      .subscribe(loader => {
        this.loader = loader;
    });
    }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //     const user = this.accountService.userValue;
    //     if (user==='jwt-token') {
    //         // authorised so return true
    //         return true;
    //     }
    //     // not logged in so redirect to login page with the return url
    //     this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    //     return false;
    // }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise < boolean > {

        return new Promise((resolve) => {
          Auth.currentAuthenticatedUser({
              bypassCache: false
            })
            .then((user) => {
              if(user){
                resolve(true);
              //   setTimeout(() => {
              //     this.loader$.next(false);
              // }, 2000);
    
              }
            })
            .catch(() => {
            this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
              resolve(false);
            });
        });
      }
    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    //   this.loader$.next(true);
    //   return from(Auth.currentAuthenticatedUser({
    //         bypassCache: false
    //       })).pipe(map(user => {
    //         if(user){
    //      setTimeout(() => {
    //    this.loader$.next(false);
    //    user.next(true);
    //    user.complete();
    //           }, 500);
    //         return true;
    //         }
    //     this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    //     return false;
    //       }));
      
    // }

    // Observable<boolean> {
    //   return this.authService.isLoggedIn.pipe(
    //     take(1),
    //     map((isLoggedIn: boolean) => {
    //       if (!isLoggedIn) {
    //         this.router.navigate(['/auth']);
    //         return false;
    //       }
    //       return true;
    //     })
    //   );
    // }
    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
    //   return 
    //     Auth.currentAuthenticatedUser.pipe({
    //         bypassCache: false
    //       })
    //       .map((user) => {
    //         if(user){
    //           true;
    //         }
    //       })
    //       .catch(() => {
    //       this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    //         false;
    //       });
    //   });
    
}
