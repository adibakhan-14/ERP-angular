import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { CustomerAddModalComponent } from '../customer-add-modal/customer-add-modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
//import { MatTableDataSource } from '@angular/material/Table';
import { Order } from 'src/app/orders/models/order.model';
import { OrderService } from 'src/app/orders/services/orders.service';
import { TruckList } from 'src/app/orders/models/truck.model';
import { MatTableDataSource } from '@angular/material/table';
import { OrderReportService } from 'src/app/report/services/order-report.service';
import { OrderPdfService } from 'src/app/report/services/order-pdf.service';
import { OrderReportComponent } from 'src/app/report/order-report/order-report.component';
import { CustomerEditModalComponent } from '../customer-edit-modal/customer-edit-modal.component';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';


@Component({
  selector: 'app-component-customer',
  templateUrl: './component-customer.component.html',
  styleUrls: ['./component-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentCustomerComponent implements OnInit {
  truckInfo: TruckList[] = [];
  coverTypeTruck = [];
  openTypeTruck = [];
  customerListObserver: Observable<Customer[]>;
  driverListObserver: Observable<any>;
  orderCancelListObserver: Observable<Order[]>;
  truckListObserver: Observable<TruckList[]>;
  customerListSub: Subscription;
  driverListSub: Subscription;
  orderCancelListSub: Subscription;
  orderCancelUndoSub: Subscription;
  customerList: any;
  driverList: any;
  orderCancelList: any;
  dataSource: MatTableDataSource<Customer>;
  orderDataSource: MatTableDataSource<Order>;

  isCheckOrderCancelList: boolean = false;
  isCheckTruckList: boolean = false;
  isCheckCustomerList: boolean = false;
  isCheckDriverList: boolean= false;
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
    private pdfService: OrderPdfService
  ) { }

  ngOnInit(): void {



    // this.commonService.setUiInfo({
    //   // delete: `/item/delete/${this.id}`,
    //   title: "Item Details"
    // });
    // this.getCustomerList();
    // this.getOrderCancelList();
    // this.getTruckList();
    // this.getDriverList();

    //this.getVendorList();

  }

  getTruckList() {
    let getOwnTruck = this.orderService.ownTruck();
    let getOtherTruck = this.orderService.otherTruck();

    forkJoin([getOwnTruck, getOtherTruck]).subscribe((results) => {
      this.truckInfo = [...results[0], ...results[1]]
      this.truckInfo.forEach((i) => {
        if (i.type === 'covered') {
          this.coverTypeTruck.push(i)
          console.log(this.coverTypeTruck);

        }
        else if (i.type === 'open') {

          this.openTypeTruck.push(i);
          console.log(this.openTypeTruck);


        }

      });

      if (this.truckInfo.length === 0) {
        this.asyncService.finish();
      }
    });
  }

  // getVendorList = () => {
  //   this.asyncService.start();

  // }

  getCustomerList = () => {
    this.asyncService.start();
    this.customerListSub = this.customerService
      .getCustomerList()
      .subscribe((data) => {
        this.customerList = data;
        console.log(this.customerList);

        this.asyncService.finish();
        this.dataSource = new MatTableDataSource<Customer>(this.customerList);
        //this.changeDetectorRef.detectChanges();
        //    this.dataSource.paginator = this.paginator;
        this.customerListObserver = this.dataSource.connect();
      });
  };
  getDriverList = () => {
    this.asyncService.start();
    this.driverListSub = this.orderService
      .getDriverList()
      .subscribe((data) => {
        this.driverList = data;
        console.log(this.driverList);

        this.asyncService.finish();
        this.dataSource = new MatTableDataSource<Customer>(this.driverList);
        //this.changeDetectorRef.detectChanges();
        //    this.dataSource.paginator = this.paginator;
        this.driverListObserver = this.dataSource.connect();
      });
  };



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

  customerAdd(): void {
    const dialogRef = this.dialog.open(CustomerAddModalComponent, {
      width: '400px',
      height: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  customerAddAndEdit(data: any): void {
    const dialogRef = this.dialog.open(CustomerEditModalComponent, {
      width: '400px',
      height: '500px',
      data: data,
    }

    );

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  orderCancelUndo(id): void {
    // console.log('ordersbaord',this.data);

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

  downloadPDF() {
    this.dialog.open(OrderReportComponent, {
      width: '80%',
      height: '400px'

    });


  }



  showOrderCancelList() {

    console.log("called","showOrderCancelList()");

    this.isCheckOrderCancelList = true;
    this.isCheckTruckList = false;
    this.isCheckCustomerList = false;
    this.isCheckDriverList= false;
    this.isCheckOrderHistoryList = false;
    this.isCHeckVendorHistoryList = false;
  };

  showDriverList(){
    this.isCheckDriverList= true;
    this.isCheckOrderHistoryList = false;
    this.isCheckTruckList = false;
    this.isCheckCustomerList = false;
    this.isCheckOrderCancelList = false;
    this.isCHeckVendorHistoryList = false;

  }

  showCustomerList() {
    this.isCheckCustomerList = true;
    this.isCheckOrderCancelList = false;
    this.isCheckDriverList= false;
    this.isCheckTruckList = false;
    this.isCheckOrderHistoryList = false;
    this.isCHeckVendorHistoryList = false;

  }


  showTruckList() {
    this.isCheckTruckList = true;
    this.isCheckDriverList= false;
    this.isCheckCustomerList = false;
    this.isCheckOrderCancelList = false;
    this.isCheckOrderHistoryList = false;
    this.isCHeckVendorHistoryList = false;

  }

  // showVendorList(){
  //   this.isCHeckVendorHistoryList = true;
  //   this.isCheckDriverList= false;
  //   this.isCheckTruckList = false;
  //   this.isCheckCustomerList = false;
  //   this.isCheckOrderCancelList = false;
  //   this.isCheckOrderHistoryList = false;

  // }

  showOrderHistory() {
    this.isCheckOrderHistoryList = true;
    this.isCheckDriverList= false;
    this.isCheckTruckList = false;
    this.isCheckCustomerList = false;
    this.isCheckOrderCancelList = false;
    this.isCHeckVendorHistoryList = false;

  };


  openPDF() {
    let pdfFormatInfo = {
      // isLogo: this.isLogo,
      // isName: this.isName,
      // isAddress: this.isAddress,
      // isHeader: this.isHeader,
      // isFooter: this.isFooter,
      // isComma: this.isComma,
      // isLandscape: this.isLandscape,
      // dateFormat: this.dateFormatControl.value,
      // roundValue: this.roundNumberControl.value
    }

    this.pdfService.orderSummery({
      pdfFormatInfo,
      apiData: this.reportData,

    })
  }



  // reportTab(): void {
  //   const dialogRef = this.dialog.open(ReportComponent, {
  //     width: '1200px',
  //     height: '600px',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('The dialog was closed');
  //   });
  // }

  ngOnDestroy(): void {
    if (this.customerListSub) {
      this.customerListSub.unsubscribe();
    }
  }
}
