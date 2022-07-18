import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Order } from 'src/app/orders/models/order.model';
import { TruckList } from 'src/app/orders/models/truck.model';
import { OrderService } from 'src/app/orders/services/orders.service';
import { OrderReportService } from 'src/app/report/services/order-report.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-ordercancel-list',
  templateUrl: './ordercancel-list.component.html',
  styleUrls: ['./ordercancel-list.component.scss']
})
export class OrdercancelListComponent implements OnInit {




  customerListObserver: Observable<Customer[]>;
  orderCancelListObserver: Observable<Order[]>;
  truckListObserver: Observable<TruckList[]>;
  customerListSub: Subscription;
  orderCancelListSub: Subscription;
  orderCancelUndoSub: Subscription;
  customerList: any;
  orderCancelList: any;
  dataSource: MatTableDataSource<Customer>;
  orderDataSource: MatTableDataSource<Order>;

  isCheckOrderCancelList: boolean = false;
  isCheckTruckList: boolean = false;
  isCheckCustomerList: boolean = false;
  isCheckOrderHistoryList: boolean = false;
  isCHeckVendorHistoryList = false;

  reportSub: Subscription;
  reportData: any[];

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private customerService: CustomerService,
    private orderService: OrderService,
    //will be removed in future
    private reportServices: OrderReportService,
  ) { }

  ngOnInit(): void {
    
 this.getOrderCancelList();
  }

  getOrderCancelList = () => {
    this.asyncService.start();
    this.orderCancelListSub = this.orderService
      .getOrderCancelList()
      .subscribe((data) => {
        this.orderCancelList = data;
        console.log(this.orderCancelList);
        this.asyncService.finish();
        this.orderDataSource = new MatTableDataSource<Order>(this.orderCancelList);
        this.orderCancelListObserver = this.orderDataSource.connect();
      });
  };



  orderCancelUndo(id): void {
    console.log('iddddd', id);
    const order = this.orderCancelList.find((item) => item.order_id === id);
    console.log(order);

    let mapData = [];
    mapData.push({
      pk: order.order_id,
      sk: order.customer_id,
      status: order.previous_status,
      previous_status: 'orderCancelled',
      updated_by: order.updated_by

    });
    console.log('maopppdata', mapData);

    this.asyncService.start();
    this.orderCancelUndoSub = this.orderService
      .updateStatus(mapData)
      .subscribe(
        (data) => {
          if (data) {
            this.asyncService.finish();
            this.commonService.showSuccessMsg('Order Undo to Previous status!!!');
            this.getOrderCancelList();
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Not Updated!!');
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Not Updated!!');
        }
      );
  }



  ngOnDestroy(): void {
    if (this.orderCancelListSub) {
      this.orderCancelListSub.unsubscribe();
    }
  }
}

