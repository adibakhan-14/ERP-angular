import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Auth } from 'aws-amplify';
import { AccountService } from 'src/app/_services';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  formId = 'Form';
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    public asyncService: AsyncService,
    public accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      emailVerify: ['', [Validators.required,]],
    
    });
  }

  get emailVerify() {
    return this.form.get('emailVerify');
  }

  async onVerifyEmail()
  {
    this.accountService.getEmailForgetPassword(this.emailVerify.value);
    try {
      await Auth.forgotPassword(this.emailVerify.value).then(data=>{
        this.commonService.showSuccessMsg('Verfication code send to email!');
        this.router.navigate(['/account/forget-confirm-password']);
      });
  
    } catch (error) {
      this.commonService.showErrorMsg('Can\'t send code!!');
    }
  this.emailVerify.patchValue('');
  }

}
