import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerAddModalComponent } from '../customer-add-modal/customer-add-modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { Order } from 'src/app/orders/models/order.model';
import { OrderService } from 'src/app/orders/services/orders.service';
import { TruckList } from 'src/app/orders/models/truck.model';
import { MatTableDataSource } from '@angular/material/table';
import { OrderReportService } from 'src/app/report/services/order-report.service';
import { OrderPdfService } from 'src/app/report/services/order-pdf.service';
import { OrderReportComponent } from 'src/app/report/order-report/order-report.component';
import { CustomerEditModalComponent } from '../customer-edit-modal/customer-edit-modal.component';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Observable } from 'rxjs/Observable';
import { forkJoin, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  customerListObserver: Observable<Customer[]>;
  orderCancelListObserver: Observable<Order[]>;
  truckListObserver: Observable<TruckList[]>;
  customerListSub: Subscription;
  orderCancelListSub: Subscription;
  orderCancelUndoSub: Subscription;
  customerList: any;
  orderCancelList: any;
  orderDataSource: MatTableDataSource<Order>;

  isCheckOrderCancelList: boolean = false;
  isCheckTruckList: boolean = false;
  isCheckCustomerList: boolean = false;
  isCheckOrderHistoryList: boolean = false;
  isCHeckVendorHistoryList = false;

  reportSub: Subscription;
  reportData: any[];

  displayedColumns: string[] = ['Name',  'Phone', 'Email', 'Updated Date'];



  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private reportServices: OrderReportService,
    private pdfService: OrderPdfService
  ) { }

  dataSource = new MatTableDataSource<Customer>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

 this.getCustomerList()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource2.paginator = this.paginator2;
  }

  getCustomerList = () => {
    this.asyncService.start();
    this.customerListSub = this.customerService
      .getCustomerList()
      .subscribe((data) => {
        this.customerList = data;
        console.log(this.customerList);

        this.asyncService.finish();
        //this.dataSource = new MatTableDataSource<Customer>(this.customerList);
        //this.changeDetectorRef.detectChanges();
        //    this.dataSource.paginator = this.paginator;
        //this.customerListObserver = this.dataSource.connect();
        this.dataSource.data =  this.customerList;
      });
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  customerAdd(): void {
    const dialogRef = this.dialog.open(CustomerAddModalComponent, {
      width: '730px',
      height: '405px',
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  customerAddAndEdit(data: any): void {
    const dialogRef = this.dialog.open(CustomerEditModalComponent, {
      width: '730px',
      height: '405px',
      data: data,
    }

    );

    dialogRef.afterClosed().subscribe((result) => {
      this.getCustomerList()
    });
  }






  ngOnDestroy(): void {
    if (this.customerListSub) {
      this.customerListSub.unsubscribe();
    }
  }
}
