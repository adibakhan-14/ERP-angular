import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription } from 'rxjs';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-order-place-view-lease-modal',
  templateUrl: './order-place-view-lease-modal.component.html',
  styleUrls: ['./order-place-view-lease-modal.component.scss']
})
export class OrderPlaceViewLeaseModalComponent implements OnInit {
  leaseSub: Subscription;
  leaseData = [];
  finalData:any
  inTransitSub: Subscription;
  inProgress=[];

  constructor(
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderPlaceViewLeaseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data,'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU');
    this.leaseSub = this.orderService
    .getLease(this.data.order_id)
    .subscribe((data) => {
      this.leaseData = data;
    });
  }

  

}
