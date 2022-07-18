import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataService } from 'src/app/shared/services/data-pass-service';
import { DetailsCollectedViewModalComponent } from '../details-collected-view-modal/details-collected-view-modal.component';
import { OrderConfirmedViewModalComponent } from '../order-confirmed-view-modal/order-confirmed-view-modal.component';
import { OrderPlaceViewLeaseModalComponent } from '../order-place-view-lease-modal/order-place-view-lease-modal.component';
import { OrderPlaceViewModalComponent } from '../order-place-view-modal/order-place-view-modal.component';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-trip-unsuccessfull',
  templateUrl: './trip-unsuccessfull.component.html',
  styleUrls: ['./trip-unsuccessfull.component.scss']
})
export class TripUnsuccessfullComponent implements OnInit {

  ordersBoardSub: Subscription;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = ['trip_id', 'name', 'status', 'created_date','action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private router: Router,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    private sharedDataService: DataService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TripUnsuccessfullComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.getTripData()
  }

  openDialog(value,element) {
    if(element.status=='ordersPlaced'){
      const dialogRef = this.dialog.open(OrderPlaceViewModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
    }else if(element.status=='detailsCollected'){
      const dialogRef = this.dialog.open(DetailsCollectedViewModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
    }else if(element.status=='orderConfirmed'){
      const dialogRef = this.dialog.open(OrderConfirmedViewModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
    }else if(element.status=='loadCompleted'){
      const dialogRef = this.dialog.open(OrderConfirmedViewModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
    }else if(element.status=='inTransit'){
      const dialogRef = this.dialog.open(OrderPlaceViewLeaseModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
    }else if(element.status=='unloadComplete'){
      const dialogRef = this.dialog.open(OrderPlaceViewLeaseModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
    }else{
      const dialogRef = this.dialog.open(OrderPlaceViewLeaseModalComponent, {
        width: '1200px',
        height: '1000px',
        data: element,
      });
    }
  }

  getTripData() {
    this.ordersBoardSub = this.orderService.getTrips().subscribe(
      (data) => {
        if (data && data.length) {
          data.map(data=>delete data['previous_status'])
          const finalData = []
          data.forEach((item)=>{
            if(item.status !== 'consignmentDone'){
              finalData.push(item)
            }
          })
          this.dataSource = new MatTableDataSource(finalData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        console.log(this.dataSource, "All trips")
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
