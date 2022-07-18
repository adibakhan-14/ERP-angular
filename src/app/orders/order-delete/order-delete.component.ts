import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersBoardItem } from '../models/orders-board-item.model';
@Component({
  selector: 'app-order-delete',
  templateUrl: './order-delete.component.html',
  styleUrls: ['./order-delete.component.scss']
})
export class OrderDeleteComponent implements OnInit, OnDestroy {

  constructor(
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) { }

  orderDeleteSub: Subscription;
  ngOnInit(): void {
  }
  orderConfirmDelete(): void {
   // console.log('ordersbaord',this.data);

    let mapData = [];
    mapData.push({
      loading_point: " ",
      order_id: this.data.order_id,  
      prev_rent_status: "n/a",
      pk: this.data.order_id,
      sk: this.data.customer_id,
      status: 'orderCancelled',
      previous_status: this.data.status,
      updated_by: this.data.updated_by,
      rent_time: " ",
      round_trip: " ",
      unloading_point: " "


    });

    this.asyncService.start();
    this.orderDeleteSub = this.orderService
      .updateStatus(mapData)
      .subscribe(
        (data) => {
          if (data) {
            this.asyncService.finish();
            this.commonService.showSuccessMsg('Deleted!');
            this.close();
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Not Updated!');
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Not Updated!');
        }
      );
  }


  close = (): void => {
    this.dialogRef.close();
  };
  ngOnDestroy(): void {
    if (this.orderDeleteSub) {
      this.orderDeleteSub.unsubscribe();
    }
  }
}
