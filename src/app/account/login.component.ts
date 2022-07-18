import { Component, OnInit,NgZone,HostListener  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AsyncService } from 'src/app/shared/services/async.service';
import { AccountService } from '../_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../shared/services/common.service';
import { from } from 'rxjs';
import { Auth } from 'aws-amplify';
import { BehaviorSubject,  } from 'rxjs';
@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  screenHeight: number;
  screenwidth: number;
  isConfirmedUser = false;
  checkForgetPassword = false;
  private emailData: BehaviorSubject<any>;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private commonService: CommonService,
    public snackBar: MatSnackBar,
    public asyncService: AsyncService,
    private zone: NgZone
  ) {
   this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])

  
  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenwidth = window.innerWidth;

    console.log(this.screenHeight,"hhhh");
    


  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

 //edata: BehaviorSubject<any> = new BehaviorSubject(this.username.value);


//   public get emailValue(): any {
//     return this.edata.value;
// }
  // get username() {
  //   return this.form.get('username');
  // }
  // toVerifyEmail: boolean = false;

  // onVerify(verifycode: HTMLInputElement) {
  //   // After retrieving the confirmation code from the user
  //   Auth.confirmSignUp(this.username.value, verifycode.value, {
  //     // Optional. Force user confirmation irrespective of existing alias. By default set to True.
  //     forceAliasCreation: true
  //     }).then(data => {
  //       console.log(data)
  //       this.toVerifyEmail = false;

  //     })
  //       .catch(err => console.log(err));
  // }

  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    const user = {
      username: this.username.value,///email
      password: this.password.value,

    }
    this.accountService.changeMessage(user);

    this.asyncService.start();
    const subscription = from(
      Auth.signIn(user)
        .then(data => {
          console.log(data);
          this.accountService.sessionHandle();
          this.asyncService.finish();
          this.router.navigate(['/dashboard']);
        })
        .catch(err => {
          this.asyncService.finish();
          console.log(err);
          if(err.code == "UserNotConfirmedException"){
          this.accountService.UserNotConfirmed().subscribe(res=>{
          })
          this.checkForgetPassword=true;
        }

    else if(err.code == "NotAuthorizedException"){
      this.accountService.WrongPassword().subscribe(res=>{
      })
      this.commonService.showErrorMsg('Incorrect password!');
        }

        else if(err.code == "UserNotFoundException"){
          this.accountService.userNotExist().subscribe(res=>{
          })
          this.commonService.showErrorMsg('User Not Found!');
            }
          // console.log('bal er log', err.code);
          // if (err.code == "UserNotConfirmedException") {
          //   console.log('is something comming here');

          //   this.isConfirmedUser = true;
          //   this.zone.run(() =>   this.router.navigate(['/verify-user']));
          // // this.router.navigate(['/verify-user']);

          // }
        })
        );
   //  subscription.subscribe((data) => {

    // },
    //   (error) => {
    //    this.commonService.showErrorMsg(err);
       // this.asyncService.finish();

        this.loading = false;
        // this.commonService.showErrorMsg(
        //   'Error! Order board data is not loaded.'
        // );
    //   });
  }


  // this.accountService
  //   .login(this.f.username.value, this.f.password.value)
  //   .pipe(first())
  //   .subscribe(
  //     (data) => {
  //       this.commonService.showSuccessMsg('You Login successfully!');
  //       // this.router.navigate([this.returnUrl]);
  //       this.router.navigate(['/dashboard']);
  //     },
  //     (error) => {
  //       // this.snackBar.open('Username of Password Incorrect', '×', {
  //       //   panelClass: 'success',
  //       //   verticalPosition: 'top',
  //       //   horizontalPosition: 'right',
  //       //   duration: 3000,
  //       // });
  //       this.commonService.showErrorMsg('Username of Password Incorrect');
  //       this.loading = false;
  //     }
  //   );

}
