import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Storage } from "aws-amplify";
import { Router, NavigationExtras } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { items } from 'fusioncharts';
import { map } from 'rxjs-compat/operator/map';
@Component({
  selector: 'app-order-detail-show',
  templateUrl: './order-detail-show.component.html',
  styleUrls: ['./order-detail-show.component.scss']
})


export class OrderDetailShowComponent implements OnInit {


  fileName = this.data.fileName;
  customerId = this.data.customer_id;
  orderDate = this.data.order_date;
  boardItem: OrdersBoardItem;


  message:any;
  subscription: Subscription;
  panelOpenState = false;
  constructor(
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderDetailShowComponent>,
    private router: Router,

    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) { }



  async ngOnInit(): Promise<void> {
    this.boardItem = this.data;

    this.subscription = this.commonService.currentMessage.subscribe(message => this.message = message)

    if (this.fileName) {
      this.boardItem.url = <string>await Storage.get(`${this.customerId}/Files/${this.fileName}`)
    }
    //this.boardItem.order_date = <string> await Storage.get(`${this.orderDate}/Date/ ${this.fileName}`)
  }


  newMessage(item,i) {
    this.commonService.changeOrderData([item,i]);
  }

  orderEdit(item: any, i: any) {
    const index = i

    console.log("adibaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": JSON.stringify(item)
      }
    };

 //   this.commonService.FromReload([i, this.boardItem])

 this.newMessage(this.data,index);
    this.router.navigate(['/orders/orderEdit', item]);

  }

}



