import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersBoardItem } from '../models/orders-board-item.model';
@Component({
  selector: 'app-order-delete-mod',
  templateUrl: './order-delete-mod.component.html',
  styleUrls: ['./order-delete-mod.component.scss']
})
export class OrderDeleteModComponent implements OnInit, OnDestroy {

  constructor(
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderDeleteModComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) { }

  orderDeleteSub: Subscription;
  ngOnInit(): void {
  }
  orderConfirmDelete(): void {
    
  
    this.commonService.FromReload("plzCall")
    
   

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
