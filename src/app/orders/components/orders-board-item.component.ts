import { NgModule, OnDestroy } from '@angular/core';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription, Observable } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { OrderService } from '../services/orders.service';

// @NgModule({
// providers: [DatePipe],
// })

@Component({
  selector: 'orders-board-item',
  template: `

  <div *ngIf=" order?.status == 'consignmentDone'; else elseBlock">  
  <div style="cursor: pointer;height:200px;margin-top:10px">
  <p>Customer Name: {{ order?.name }} <span style="padding-left:10px"><mat-checkbox (change)="setAll(order)" >Copy</mat-checkbox></span> </p>
  <p>Email: {{ order?.email }}</p>
  <p>Phone: {{ order?.phone }}</p>
  <p>Status : {{ order?.status }}</p>
  <p>Order ID : {{ order?.order_id }}</p>
  <p>Order Confirm : {{ order.Confirm }}</p>
  <p>Order Created : {{ order.created_date }}</p>
  </div></div>
  <ng-template #elseBlock>    
  <div style="cursor: pointer;height:200px;margin-top:10px">
  <p>Customer Name: {{ order?.name }}</p>
  <p>Email: {{ order?.email }}</p>
  <p>Phone: {{ order?.phone }}</p>
  <p>Status : {{ order?.status }}</p>
  <p>Order ID : {{ order?.order_id }}</p>
  <p>Order Confirm : {{ order.Confirm }}</p>
  <p>Order Created : {{ order.created_date }}</p>
  </div>
  </ng-template>




  `,
  styles: [
    `
      p {
        line-height: 25px;
        border-bottom: 2px solid #f7f5f5;
        font-size: 12px;
        font-family: Lato;
      }
    `,
  ],
})
export class OrdersBoardItemComponent implements OnInit, OnDestroy {
  constructor(private router: Router, public orderBoard: OrderService, public asyncService: AsyncService, public commonService: CommonService) { }
  OrderDuplicate: Subscription

  dateFormat: Subscription;
  @Input() order: OrdersBoardItem;
  date: string;


  setAll(order) {

    order.status = "ordersPlaced"
    order.created_date = moment().format(
      'YYYY-MM-DD'
    );
    console.log(order)
    this.asyncService.start();
    this.OrderDuplicate = this.orderBoard.addOrder(order).subscribe(
      (data) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Order Duplicate successfully');

      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Order Duplicate failed');
      },
      () => {
        this.commonService.FromReload("plzCall")
      }
    )
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.OrderDuplicate
  }

}
