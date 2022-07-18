import { Component, OnInit } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { MatDialog } from '@angular/material/dialog';
import { TargetValueAddModalComponent } from '../target-value-add-modal/target-value-add-modal.component';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/customer/services/customer.service';
import { Customer } from 'src/app/customer/models/customer.model';
import { Storage } from "aws-amplify";
import { Router, ActivatedRoute } from '@angular/router';
// import { OrdersBoardItem, MovingItem } from '/models/orders-board-item.model';

@Component({
  selector: 'app-component-dashboard',
  templateUrl: './component-dashboard.component.html',
  styleUrls: ['./component-dashboard.component.scss'],
})
export class ComponentDashboardComponent implements OnInit {
  Customerlogosx : any[] = [];

  // Overalllist: boolean = false;
  customerListSub:Subscription;
  customerList: Customer[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private asyncService: AsyncService,
    private customerService : CustomerService,
  ) { }

  backButton() {
    console.log("call hose mamu")
    this.router.navigateByUrl('/dashboard');
};


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('customerrrrrrrrrrrrr jdfijefijefjiejijijiroute',id);

    this.getCustomerList();


  }

  getCustomerList = () => {
    this.asyncService.start();
    this.customerListSub = this.customerService
      .getCustomerList()
      .subscribe((data) => {
        if(data){
          this.customerList = data;
          this.customerListExtrac(this.customerList)
          this.asyncService.finish();
        }
        else{
          this.asyncService.finish();
        }
      });


  };


async customerListExtrac(data){
    for(let customer of this.customerList){
    var x =
    { name:customer.name,
      url:<string>await Storage.get(`${customer.customer_id}/Pictures/${customer.picture_name}`)}
      if(customer.picture_name)
      {
      this.Customerlogosx.push(x)
      }
      else
      {
       x.url= "/assets/images/avatar_square_blue.png"
       this.Customerlogosx.push(x)

      }
    }

   //console.log(this.Customerlogosx)
}



  // targetValueAdd(): void {
  //   const dialogRef = this.dialog.open(TargetValueAddModalComponent, {

  //     width: '600px',
  //     height: '450px',
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('The dialog was closed');
  //   });
  // }

//   Overall(){

//     this.getCustomerList();

//     this.Overalllist = true;
// }


}
