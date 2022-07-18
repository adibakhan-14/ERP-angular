import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from 'aws-amplify';
import { AccountService } from 'src/app/_services';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';

@Component({
  selector: 'app-forget-confirm-password',
  templateUrl: './forget-confirm-password.component.html',
  styleUrls: ['./forget-confirm-password.component.scss']
})
export class ForgetConfirmPasswordComponent implements OnInit {
  formId = 'Form';
  form: FormGroup;
  cognitoUser:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {

    this.accountService.verifyUser.subscribe(user => {this.cognitoUser = user;
      console.log(this.cognitoUser,'pppppppppppppppppppppppppppppppppppp');
    })
    this.form = this.fb.group({
      verificationCode: ['', [Validators.required,]],
      newPassword: ['', [Validators.required,]],
      confirmPassword: ['', [Validators.required,]],
    
    });
  }

  get verificationCode() {
    return this.form.get('verificationCode');
  }
  get newPassword() {
    return this.form.get('newPassword');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
  async forgotPasswordSubmit()
  {
    try {
      await Auth.forgotPasswordSubmit(
        this.cognitoUser,
        this.verificationCode.value,
        this.confirmPassword.value
      ).then(data=>{
        this.commonService.showSuccessMsg('Password changed!');
        this.router.navigate(['/account/login']);
      });
  
    } catch (error) {
      this.commonService.showErrorMsg('Can\'t send code!');
    }
  this.verificationCode.patchValue('');
  this.newPassword.patchValue('');
  this.confirmPassword.patchValue('');
  }

}
