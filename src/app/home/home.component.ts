import { Component } from '@angular/core';
import { User } from '../_models';
import { AccountService } from '../_services';
import { Auth } from 'aws-amplify';
@Component({ templateUrl: 'home.component.html',styleUrls: ['./home.component.scss'] },)
export class HomeComponent {
    user: User;
    color = 'sucess';
    mode = 'indeterminate';
    value = 50;
    bufferValue = 75;
   username:String;
    constructor(private accountService: AccountService) {
       this.username = this.accountService.userValue;

        
       Auth.currentUserInfo().then(async user => {
        this.username = user.attributes.email;
     

    })
        .catch(err => console.log(err));
    
        
    }
}
