import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { MatDialog } from '@angular/material/dialog';
import { TargetValueAddModalComponent } from '../target-value-add-modal/target-value-add-modal.component';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/customer/services/customer.service';
import { Customer } from 'src/app/customer/models/customer.model';
import { DashboardService } from '../services/dashboard.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Storage } from "aws-amplify";
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { Console } from 'console';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import {statusDictionary} from 'src/app/orders/data/orders-board.constant';
import { OrdersBoardItem } from 'src/app/orders/models/orders-board-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private mediaSub: Subscription;
  customerControl = new FormControl();
  filteredStates: Observable<Customer[]>;

  Customerlogos : any[] = [];
  showCustomerList: boolean = true;
  customerListSub: Subscription;
  customerListSubAll: Subscription;
  customerList: Customer[];
  customers: Customer[] = [];
  customerId:string;
  check : Boolean = true;
  chartObj:any
  handler:any
  status = statusDictionary;
  ordersPlaced: OrdersBoardItem[] = [];
  detailsCollected : OrdersBoardItem[] = [];
  consignmentDone: OrdersBoardItem[] = [];
  inProgress: OrdersBoardItem[] = [];
  loadPoint : OrdersBoardItem[] = [];
  orderConfirmed: OrdersBoardItem[] = [];
  unloadPoint : OrdersBoardItem[] = [];




  constructor(
    private router: Router,
    private cdRef:ChangeDetectorRef,
    private mediaObserver:MediaObserver,
    private zone: NgZone,
    public dialog: MatDialog,
    private dashBoardService: DashboardService,
    public asyncService: AsyncService,
    private commonService: CommonService,
    private customerService: CustomerService,
  ) {
    this.loadCustomerSub = this.customerService.getCustomerList().subscribe(
      (data) => {
        if (data) {
          this.customers = data;
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Customers could not found');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! Customers could not found');
      }
    );
  }

  totalDashboardPercentageCountSub: Subscription;
  onProgress:string;
  totalCancelled:string;
  totalCompleted:string;
  loadCustomerSub: Subscription;


  ngOnInit(): void {

    this.mediaSub = this.mediaObserver.media$.subscribe(
      (change:MediaChange)=>{
       console.log(change.mqAlias);
        console.log(change.mediaQuery);
      });
    this.totalDashboardPercentageCount();
    //console.log(this.options);




    this.filteredStates = this.customerControl.valueChanges.pipe(
      startWith(''),
      map((state) =>
        state ? this._filterStates(state) : this.customers.slice()
      )
    );

  }


  private _filterStates(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(
      (state) =>
        state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }


  private totalDashboardPercentageCount = (): void => {
    this.asyncService.start();
    this.totalDashboardPercentageCountSub = this.dashBoardService.Allorderstatus().subscribe(
      (data) => {
        if (data) {
          console.log(data, 'this is all orders status data')
             this.ordersPlaced     =    data[0].value;
             this.detailsCollected =    data[1].value;
             this.orderConfirmed   =    data[2].value;
             this.loadPoint        =    data[3].value;
             this.inProgress       =    data[4].value;
             this.unloadPoint      =    data[5].value;
             this.consignmentDone  =    data[6].value;
        console.log("rtd",data )
        }
        this.asyncService.finish();
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg(
          'Error! Percentage data is not loaded.'
        );
      }
    );
  }

//   getCustomerList = () => {
//     this.asyncService.start();
//     this.customerListSub = this.customerService
//       .getCustomerId(this.customerId)
//       .subscribe((data) => {
//         if (data) {
//           this.customerList = data;
//           //this.getCustomerName(this.customerList);
//           this.customerListExtrac(this.customerList)
//           this.asyncService.finish();
//         }
//         else {
//           this.asyncService.finish();
//         }
//       });


//   };

//   getcustomerId(customerId){

//     this.customerId =customerId;
//     console.log(customerId);
//     this.getCustomerList();
//   }

//  //myVar = setInterval(showAllCustomer(), 1000);

  showAllCustomer(){
    this.Customerlogos.splice(-this.Customerlogos.length);

    if(this.check){
      this.asyncService.start();
      this.customerListSubAll = this.customerService.
      getCustomerList()
        .subscribe((data) => {
          if (data) {
            this.customerList = data;
            //this.getCustomerName(this.customerList);
            this.customerListExtrac(this.customerList)
            //this.Customerlogos.push(data)
          //   for (let i = 0; i < this.customerList.length; i++) {
          //   this.Customerlogos.slice(i);
          // }

            this.asyncService.finish();
            //this.check = false;

          }
          else {
            this.asyncService.finish();
          }
        });
    }

      //setTimeout(this.call, 100)

};
 call()
{
  this.check = true;
}



// //  getCustomerName(data){

// //     for(let customers of this.customerList)
// //     {

// //       let customerName: [] ;
// //       customers.name


// //     }
// //   }


  async customerListExtrac(data){
    for(let customer of this.customerList){
    var x =
    { name:customer.name,
      url:<string>await Storage.get(`${customer.customer_id}/Pictures/${customer.picture_name}`),
      customerId:customer.customer_id
    }

      if(customer.picture_name)
      {
      this.Customerlogos.push(x)
      }
      else
      {
       x.url= "/assets/images/avatar_square_blue.png"
       this.Customerlogos.push(x)

      }
    }
 //  console.log(this.Customerlogos)
}

// showAllCustomer(){

// }

 getcustomerId(customerId){
  console.log("###############################pppppppppppp33333333333333333",customerId);




  this.Customerlogos.splice(-this.Customerlogos.length);

  this.Customerlogos.pop();

  this.customerId =customerId

  this.asyncService.start();
    this.customerListSub = this.customerService
      .getCustomerId(this.customerId)
      .subscribe(async(data) => {
        if (data) {
          console.log(data)

          var x =
          { name:data[0].name,
            url:<string> await Storage.get(`${data[0].customer_id}/Pictures/${data[0].picture_name}`),
            customerId:data[0].customer_id
          }

          this.Customerlogos.pop();

          this.Customerlogos.push(x);


          console.log(this.Customerlogos)

          this.asyncService.finish();
        }
        else {
          this.asyncService.finish();
        }
      });

}


  targetValueAdd(): void {
    const dialogRef = this.dialog.open(TargetValueAddModalComponent, {
      width: '450px',
      height: '300px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy(): void {
    if (this.totalDashboardPercentageCountSub) {
      this.totalDashboardPercentageCountSub.unsubscribe();
    }
    if (this.customerListSub) {
      this.customerListSub.unsubscribe();
    }
    this.asyncService.finish();
  }

//   initialized($event) {
//     this.chartObj = $event.chart;
//     this.handler = this.dataplotClickHandler.bind(this);
//     this.chartObj.addEventListener('dataplotClick', this.handler);

// }


  dataplotClickHandler(eventObj, dataObj) {
    this.zone.run(() => {
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',dataObj);

    });
}

goToOrders(){
  this.router.navigate(['/orders']);
}

}



