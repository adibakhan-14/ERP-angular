import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth } from 'aws-amplify';
import { CommonService } from '../../shared/services/common.service';
import { AsyncService } from '../../shared/services/async.service';


import { CustomValidators } from 'src/app/shared/helpers/custom.validators';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  formId = 'Form';
  form: FormGroup;
  hideOldPassword = true;
  hideCurrentPassword = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    public asyncService: AsyncService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required, CustomValidators.removeSpaces]],
      currentPassword: ['', [Validators.required, CustomValidators.removeSpaces]]
    });
  }

  get oldPassword() {
    return this.form.get('oldPassword');
  }
  get currentPassword() {
    return this.form.get('currentPassword');
  }


  async onChangePassword(data:any){
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        this.oldPassword.value,
        this.currentPassword.value
      ).then(data=>{
        this.commonService.showSuccessMsg('Password successfully changed!!');
      })
    
    } catch (error) {
      this.commonService.showErrorMsg('Password doesn\'t changed!!');
    }
    this.oldPassword.patchValue('');
    this.currentPassword.patchValue('');
  }


}
