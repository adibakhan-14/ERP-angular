import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Subscription, Observable, from } from 'rxjs';
//import { Order } from 'src/app/orders/models/order.model';
//import { Truck } from 'src/app/orders/models/truck.model';
import { OrderService } from 'src/app/orders/services/orders.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Vendor } from 'src/app/customer/models/vendor.model'
import { MatDialog } from '@angular/material/dialog';
import { AddPartnerComponent } from '../add-partner/add-partner.component';
import { Router } from '@angular/router';
import { PartnerEditModalComponent } from '../partner-edit-modal/partner-edit-modal.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit {

  constructor(public asyncService: AsyncService,
    private router: Router,
    public orderService: OrderService,
    public dialog: MatDialog) { }

    vendorListSub:Subscription
    vendorList= [];
    vendorListObserver: Observable<Vendor[]>;
    dataSource: MatTableDataSource<any>;

    displayedColumns: string[] = ['vendor_name', 'vendor_id', 'email', 'phone', 'type', 'created_date','updated_date',  'Action'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    ngOnInit(): void {
      this.getVendorList();

    }
    back(){
      this.router.navigate(['/orders']);
    }

    addPartner(){
      const dialogRef = this.dialog.open(AddPartnerComponent, {
      width: '735px',
      height: '450px',
      backdropClass: 'gk',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

        getVendorList = () => {
          this.asyncService.start();
          this.vendorListSub = this.orderService
            .getVendorList()
            .subscribe((data) => {
              this.vendorList = data;
              console.log(this.vendorList, "list of vendors");
              const sortedData = this.vendorList.sort(this.sortByDate)
              this.asyncService.finish();
              this.dataSource = new MatTableDataSource(sortedData);
              this.vendorListObserver = this.dataSource.connect();

              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
        }

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

        editItem (data: any): void {
            const dialogRef = this.dialog.open(PartnerEditModalComponent, {
              width: '760px',
              height: '500px',
               data: data,
            });
            dialogRef.afterClosed().subscribe((result) => {
              console.log('The dialog was closed');
              this.getVendorList();

            });
          }

        ngOnDestroy(): void {
          if (this.vendorListSub) {
            this.vendorListSub.unsubscribe();
          }
          this.asyncService.finish();
        }


}
