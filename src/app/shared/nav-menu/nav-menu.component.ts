import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common.service';
import { AsyncService } from '../services/async.service';
import { AccountService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { Auth } from 'aws-amplify';
import { Observable } from 'rxjs/Observable';
import { CustomerService } from 'src/app/customer/services/customer.service';
import { Subscription } from 'rxjs';
import { AuthGuard } from 'src/app/_helpers';

@Component({
  selector: 'nav-menu',
  templateUrl: 'nav-menu.component.html',
  styleUrls: ['nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnDestroy {
  user: User;
  username: string;
  outageCount = "hello"
  link: string;
  currentUserName:string;
  customerIdList: any = [];
  loadCustomerIdSub:Subscription;
  isLoggedIn$: Observable<boolean>;

  public isMenuOpen: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private commonService: CommonService,
    private asyncService: AsyncService,
   // public authGuard: AuthGuard
  //  private customerService: CustomerService,
  ) {
    //  this.accountService.user.subscribe((x) => (this.user = x));
   this.accountService.userName.subscribe((x) => (this.username = x));

    //i used amplify auth here
  //   Auth.currentUserInfo().then(async user => {
  //    await  user ;
  //    this.username=user.username

  //   })
  //     .catch(err => console.log(err));
  //
  }
  ngOnInit(): void {

    this.isLoggedIn$ = this.accountService.isLoggedIn;

    // Auth.currentUserInfo().then(async user => {
    //   this.username = user.attributes.email;
    //   console.log('currentUserInfousername', user);
    //   console.log('currentUserInfousername', user.attributes.email);
    // })

    //   .catch(err => console.log(err));

    Auth.currentUserInfo().then(async user => {
      this.username = user.attributes.email;
    })

 }
  // public onSidenavClick(): void {
  //   this.isMenuOpen = false;
  // }



  // truckAdd(){}
  // async getProfilePicture(){

  //   url:<string>await Storage.get(`${customer.customer_id}/Pictures/${customer.picture_name}`) }
 

  

  logout() {
    this.accountService.logout();
    this.commonService.showSuccessMsg('logout sucessfully');
  }
  ngOnDestroy() {
    // if(this.loadCustomerIdSub){
    //   this.loadCustomerIdSub.unsubscribe();

    // }
   }
}
