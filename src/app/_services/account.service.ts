import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,  } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { environment } from 'src/environments/environment';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs';
import {catchError} from 'rxjs/operators'
import {of,throwError} from 'rxjs'
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    private userNameSubject: BehaviorSubject<string>;
    public user: Observable<User>;
    public userName: Observable<string>;
    public userName1: string;
   public cognitouser:any;
    private loggedIn = new BehaviorSubject<boolean>(false);

    get isLoggedIn() {
        return this.loggedIn.asObservable(); // {2}
      }

      private cognitoUserPublish = new BehaviorSubject(this.cognitouser);
      verifyUser = this.cognitoUserPublish.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient,
        private commonService: CommonService,
        public asyncService: AsyncService,
    ) {

        Auth.currentUserInfo().then(async user => {
            this.userName1 = user.username;
          //   console.log('currentUserInfousername========finallyyyyyyyyyyy', user);
          //  console.log('currentUserInfousername', user.attributes.email);
            this.loggedIn.next(true);

        })
            .catch(err => console.log(err));

            Auth.currentAuthenticatedUser().then(async user=>{
              // console.log("=======currentAuthenticatedUser======",user);

             })
                .catch(err => console.log(err));

        this.userNameSubject = new BehaviorSubject<string>(sessionStorage.getItem('fakeAccessToken'));
        this.userName = this.userNameSubject.asObservable();
    }


    changeMessage(user: any) {
        this.cognitoUserPublish.next(user)
        }
        getEmailForgetPassword(user: any){
          this.cognitoUserPublish.next(user)
        }
    // public get userValue(): User {
    //     return this.userSubject.value;
    // }
    public get userValue(): any {
        return this.userNameSubject.value;
    }

    // login(username, password) {
    //     return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
    //         .pipe(map(user => {
    //             localStorage.setItem('user', JSON.stringify(user));
    //             this.userSubject.next(user);
    //             return user;
    //         }));
    // }

    sessionHandle(){
          Auth.currentUserInfo().then(async user => {
           //   console.log('authenticated login button',user);

            this.userName1 = user.username;
            this.loggedIn.next(true);
            this.commonService.showSuccessMsg('Login Successful!');

        })
            .catch(err => {
                this.commonService.showErrorMsg('Username or Password Incorrect');
             } );

    }
    logout() {
        this.asyncService.start();
        const subscription = from(
        Auth.signOut({ global: true })
        .then(data => {
        })
        .catch(err => console.log(err)));
        subscription.subscribe((data)=>
        {
            this.loggedIn.next(false);
            this.router.navigate(['/account/login']);
            this.asyncService.finish();
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg(
            'Error! Order board data is not loaded.'
          );
        }
      );

        // localStorage.removeItem('user');
        // this.userSubject.next(null);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update session storage
                    const user = { ...this.userValue, ...params };
                    sessionStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

    UserNotConfirmed()
    {
      return throwError({error:"UserNotConfirmedException"}).pipe(catchError(x=>{
        return this.error(x)
      }))

    }
    error(x):Observable<any>
    {
      console.log(x)
      this.router.navigate(['account/verify-user'],{ state: { error: x } })
      return of(null);
    }
    WrongPassword()
    {
      return throwError({error:"NotAuthorizedException"}).pipe(catchError(x=>{
        return this.errorWrongPassword(x)
      }))

    }
    errorWrongPassword(x):Observable<any>
    {
      console.log(x)
      this.router.navigate(['account/login'],{ state: { error: x } })
      return of(null);
    }
    userNotExist()
    {
      return throwError({error:"UserNotFoundException"}).pipe(catchError(x=>{
        return this. errorUserNotExist(x)
      }))

    }
    errorUserNotExist(x):Observable<any>
    {
      console.log(x)
      this.router.navigate(['account/login'],{ state: { error: x } })
      return of(null);
    }
}
