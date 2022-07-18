import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';
import { TripChallanModalComponent } from '../trip-challan-modal/trip-challan-modal.component';

@Component({
  selector: 'app-product-truck-successfull-modal',
  templateUrl: './product-truck-successfull-modal.component.html',
  styleUrls: ['./product-truck-successfull-modal.component.scss']
})
export class ProductTruckSuccessfullModalComponent implements OnInit {
  leaseSub: Subscription;
  leaseData = [];
  finalData:any
  inTransitSub: Subscription;
  inProgress=[];

  constructor(
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialog: MatDialog,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log(this.data )
    // this.leaseSub = this.orderService
    // .getLease(this.data.order_id)
    // .subscribe((data) => {
    //   this.leaseData = data;
    //   this.finalData=this.leaseData[0].information
    //   console.log(this.leaseData,'llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll')
    // });
  }

  challan(id,index) {
    const dialogRef = this.dialog.open(TripChallanModalComponent, {
      width: '500px',
      data: {
        data_by_orderId : this.leaseData,
        trip_id: id,
        table_index: index
      },
    });
  }
}
