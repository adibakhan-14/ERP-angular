import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { CommonModule } from '@angular/common';
import { VerifyAccountComponent } from './verify-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ForgetConfirmPasswordComponent } from './forget-confirm-password/forget-confirm-password.component';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule, AccountRoutingModule],
  declarations: [LayoutComponent, LoginComponent, RegisterComponent, VerifyAccountComponent, ChangePasswordComponent, ForgetPasswordComponent, ForgetConfirmPasswordComponent],
  providers: [LoginComponent,],
})
export class AccountModule {}
