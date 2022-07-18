import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Subscription } from 'rxjs';
import { OrderPlaceViewLeaseModalComponent } from 'src/app/orders/order-place-view-lease-modal/order-place-view-lease-modal.component';
import { OrderPlaceViewModalComponent } from 'src/app/orders/order-place-view-modal/order-place-view-modal.component';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CustomerService } from '../services/customer.service';



@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})

export class OrderHistoryComponent implements AfterViewInit {

  constructor(
    public asyncService: AsyncService,
    public customerService: CustomerService,
    public dialog: MatDialog

  ) {




  }
  allOrderList:Subscription
  allOrderArray =[]
  allOrderArrayPush = []

  displayedColumns: string[] = ['Name', 'Order Id', 'Loading Date','Status','view'];
  orderHistory = new MatTableDataSource<any>()


  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getOrderHistory()



   console.log(this.orderHistory,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
}

  ngAfterViewInit() {
    this.orderHistory.paginator = this.paginator;


  }


  openDialog(value, element) {
    if (value === 'view') {
      const dialogRef = this.dialog.open(OrderPlaceViewModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('helloooooooooo  detailsCollected poreeeeee ');

        } else {
          console.log(result, 'The dialog was closed');
        }
      });
    }
    if (value === 'leaseview') {
      const dialogRef = this.dialog.open(OrderPlaceViewLeaseModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('helloooooooooo  detailsCollected poreeeeee ');

        } else {
          console.log(result, 'The dialog was closed');
        }
      });
    }
  }

getOrderHistory = () => {
    this.asyncService.start();
    this.allOrderList = this.customerService
      .getAllOrderList()
      .subscribe((data) => {
       this.allOrderArray = data;

       this.asyncService.finish();

       this.allOrderArray.forEach(((i) => {



        if(i.status === "consignmentDone"){


          this.allOrderArrayPush.push(i);


         }

        this.orderHistory.data = this.allOrderArrayPush;

       })

      )});
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.orderHistory.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy(): void {
      if (this.allOrderList) {
        this.allOrderList.unsubscribe();
      }
    }


}




