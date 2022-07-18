import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/orders/services/orders.service';
import { OrderPdfService } from 'src/app/report/services/order-pdf.service';
import { OrderReportService } from 'src/app/report/services/order-report.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AddDriverComponent } from '../add-driver/add-driver.component';
import { DriverService } from '../driver.service';

//import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss']
})
export class DriverListComponent implements OnInit {

  driverListSub: Subscription;
  driverList: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private commonService: CommonService,
    public asyncService: AsyncService,
    private driverService: DriverService,
    private orderService: OrderService,
    public dialog: MatDialog,
    public router: Router) { }

  ngOnInit(): void {
    this.getDriverList()

  }

  displayedColumns = ['name', 'phone', 'driver_id', 'license_number', 'status', 'created_date', 'updated_date' ,'Action'];
  dataSource = new MatTableDataSource<any>();

  back(){
    this.router.navigate(['/orders']);
  }

  addDriver(){
     const dialogRef = this.dialog.open(AddDriverComponent, {
      width: '730px',
      height: '325px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  editItem (data: any): void {
    const dialogRef = this.dialog.open(AddDriverComponent, {
      width: '760px',
      height: '500px',
       data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getDriverList();

    });
  }

  getDriverList = () => {
    this.asyncService.start();
    this.driverListSub = this.driverService
      .getDriverList()
      .subscribe((data) => {
        this.driverList = data.sort(this.sortByDate)
        this.driverList.map(data=>delete data['previous_status'])
        this.asyncService.finish();
        this.dataSource.data =  this.driverList;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.data, 'here is the driver list');
      });
  };

  sortByDate(a, b) {
    if (a.created_at < b.created_at) {
        return 1;
    }
    if (a.created_at > b.created_at) {
        return -1;
    }
    return 0;
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
