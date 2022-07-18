import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerAddModalComponent } from 'src/app/customer/customer-add-modal/customer-add-modal.component';
import { CustomerEditModalComponent } from 'src/app/customer/customer-edit-modal/customer-edit-modal.component';
import { CustomerService } from 'src/app/customer/services/customer.service';
import { OrderPdfService } from 'src/app/report/services/order-pdf.service';
import { OrderReportService } from 'src/app/report/services/order-report.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-new-customer-list',
  templateUrl: './new-customer-list.component.html',
  styleUrls: ['./new-customer-list.component.scss']
})
export class NewCustomerListComponent implements OnInit {
  customerListSub: Subscription;
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name',  'phone', 'email',"customerCornPersonName","customerCornPersonPhone", 'created_date','updated_date','Action'];

  constructor(
    public asyncService: AsyncService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCustomerList()
  }

  getCustomerList = () => {
    // this.asyncService.start();
    this.customerListSub = this.customerService
      .getCustomerList()
      .subscribe((data) => {
        const reversedData = data.sort(this.sortByDate)
        this.dataSource = new MatTableDataSource(reversedData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource)

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

  addCustomer(){
    const dialogRef = this.dialog.open(CustomerAddModalComponent, {
    width: '735px',
    height: '450px',
  });

  dialogRef.afterClosed().subscribe((result) => {});
}

back(){
  this.router.navigate(['/orders']);
}


editItem (data: any): void {
  const dialogRef = this.dialog.open(CustomerEditModalComponent, {
    width: '760px',
    height: '500px',
    data: data,
  });
  dialogRef.afterClosed().subscribe((result) => {
    console.log('The dialog was closed');
  });
}

ngOnDestroy(): void {
  if (this.customerListSub) {
    this.customerListSub.unsubscribe();
  }
  this.asyncService.finish();
}

}
