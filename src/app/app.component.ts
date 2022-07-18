import { Component,OnInit } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from './shared/services/common.service';
import { Auth } from 'aws-amplify';
import { AuthGuard } from './_helpers';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'truckload';
  user: User;
  username: string;
  constructor(
    private accountService: AccountService,
    private commonService: CommonService,
    public snackBar: MatSnackBar,
    public authGuard: AuthGuard
  
  ) {
    // this.accountService.user.subscribe((x) => (this.user = x));
    this.accountService.userName.subscribe((x) => (this.username = x));
  //  console.log('loggggg....this.username not ',this.username );
    
   //have used amplify auth 
    // Auth.currentUserInfo().then(async user => {
    //   this.username = user.username;
    // })
    //   .catch(err => console.log(err));
  }
  ngOnInit() {

    
  }
 


  logout() {
    this.accountService.logout();
    this.commonService.showSuccessMsg('logout sucessfully');
    // this.snackBar.open('Logout successfully!', '×', { panelClass: 'success', verticalPosition: 'top',horizontalPosition:'right', duration: 3000 });
  }
}
