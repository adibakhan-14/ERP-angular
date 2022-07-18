// import { Component, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Inject } from '@angular/core';
// import { AsyncService } from 'src/app/shared/services/async.service';

// @Component({
//   selector: 'app-order-confirmed-view-modal',
//   templateUrl: './order-confirmed-view-modal.component.html',
//   styleUrls: ['./order-confirmed-view-modal.component.scss']
// })
// export class OrderConfirmedViewModalComponent implements OnInit {

//   constructor(
//     public asyncService: AsyncService,
//     public dialogRef: MatDialogRef<OrderConfirmedViewModalComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) { }

//   ngOnInit(): void {
//     console.log(this.data,'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU')
//   }

// }
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription } from 'rxjs';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-order-confirmed-view-modal',
  templateUrl: './order-confirmed-view-modal.component.html',
  styleUrls: ['./order-confirmed-view-modal.component.scss']
})
export class OrderConfirmedViewModalComponent implements OnInit {
  leaseSub: Subscription;
  leaseData = [];
  finalData:any
  inTransitSub: Subscription;
  inProgress=[];

  constructor(
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderConfirmedViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data,'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU');
    this.leaseSub = this.orderService
    .getLease(this.data.order_id)
    .subscribe((data) => {
      this.leaseData = data;
      // this.finalData=this.leaseData[0].information
      // console.log(this.leaseData = data,'llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll')
    });
  }

  

}
