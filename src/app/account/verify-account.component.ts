import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,NavigationStart, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter,map} from 'rxjs/operators'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services';
import { CommonService } from '../shared/services/common.service';
import { AsyncService } from '../shared/services/async.service';
import { Auth } from 'aws-amplify';
import { LoginComponent } from './login.component';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {
  private state$: Observable<object>;
  form: FormGroup;
  loading = false;
  submitted = false;
  emailValue:any;
  cognitoUser:any;
  constructor(public activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private loginComponent: LoginComponent,
    ) {
     
     }

  ngOnInit(): void {
    this.accountService.verifyUser.subscribe(user => {this.cognitoUser = user;
    console.log(this.cognitoUser,'pppppppppppppppppppppppppppppppppppp');
    })
   // this.loginComponent.emailValue.subscribe((x) => (this.emailValue = x));
  //  this.emailValue=this.loginComponent.email;
  console.log('email',this.emailValue);
   
    this.form = this.formBuilder.group({
     // email: ['', Validators.required],
      verficationCode: ['', Validators.required],
    });

    this.state$ = this.activatedRoute.paramMap
    .pipe(map(() => window.history.state))
   // console.log('plzzzzzzzzzzzzz emil value',this.emailValue);
    
  }

  get f() {
    return this.form.controls;
  }
  // get email () {
  //   return this.form.get('email');
  // }
  get verficationCode () {
    return this.form.get('verficationCode');
  }


  onVerify() {
 
    this.asyncService.start();
    this.submitted = true;
    // After retrieving the confirmation code from the user
    Auth.confirmSignUp(this.cognitoUser.username, this.verficationCode.value, {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true    
      }).then(data => {
        console.log("verifyy",data);
        // this.toVerifyEmail = false;
        // this.signstatus = 'signin'
       // this.accountService.sessionHandle();
       Auth.signIn(this.cognitoUser)
       .then(data => {
         console.log(data);
         this.accountService.sessionHandle();
         this.asyncService.finish();
         this.router.navigate(['/dashboard']);
       })
       .catch(err=>{ 
        console.log(err);
      this.commonService.showErrorMsg(err)})
       
        this.asyncService.finish();
       // this.commonService.showSuccessMsg('You are successfully verified! Please login again as a verfied user');
        this.router.navigate(['/dashboard']);
      })
        .catch(err=>{ 
          console.log(err);
        this.commonService.showErrorMsg(err)})
      }
        
}
