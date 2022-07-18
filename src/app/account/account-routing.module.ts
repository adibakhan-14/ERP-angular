import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import {VerifyAccountComponent} from './verify-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ForgetConfirmPasswordComponent } from './forget-confirm-password/forget-confirm-password.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'verify-user', component: VerifyAccountComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'forget-confirm-password', component: ForgetConfirmPasswordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
