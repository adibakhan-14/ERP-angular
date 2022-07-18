// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-new-truck-listt',
//   templateUrl: './new-truck-listt.component.html',
//   styleUrls: ['./new-truck-listt.component.scss']
// })
// export class NewTruckListtComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }


import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { TruckList } from 'src/app/orders/models/truck.model';
import { OrderService } from 'src/app/orders/services/orders.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { MatDialog } from '@angular/material/dialog';
import { TruckAddModalComponent } from 'src/app/orders/truck-add-modal/truck-add-modal.component';
import { Router } from '@angular/router';
import { TruckEditModalComponent } from 'src/app/orders/truck-edit-modal/truck-edit-modal.component';
import { MatSort } from '@angular/material/sort';




@Component({
  selector: 'app-new-truck-listt',
  templateUrl: './new-truck-listt.component.html',
  styleUrls: ['./new-truck-listt.component.scss']
})
export class NewTruckListtComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService: OrderService,
    private asyncService:AsyncService,
    public dialog: MatDialog,
    private router: Router,

  ) { }

  truckInfo: TruckList[] = [];
  coverTypeTruck = [];
  openTypeTruck = [];

  displayedColumns: string[] = ['truck_reg','type', 'length','weight','status','created_date','updated_date', 'Action'];
  //displayedColumns2: string[] = ['Vendor Name', 'Truck Registration No', 'Truck Length','Truck capacity','Action'];

  dataSource = new MatTableDataSource<any>()
  //dataSource2 = new MatTableDataSource<any>()



  // @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatPaginator) paginator2: MatPaginator;



  ngOnInit(): void {
    this.getTruckList()

  }

  // ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    //this.dataSource2.paginator = this.paginator2;



  // }

  addTruck(){
    const dialogRef = this.dialog.open(TruckAddModalComponent, {
    width: '735px',
    height: '450px',
  });

  dialogRef.afterClosed().subscribe((result) => {});
}

  editItem(data: any): void {
    const dialogRef = this.dialog.open(TruckEditModalComponent, {
      width: '800px',
      height: '500px',
      data: data,
    }

    );

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  back(){
    this.router.navigate(['/orders']);
  }

  getTruckList() {
    let getOwnTruck = this.orderService.ownTruck();
    let getOtherTruck = this.orderService.otherTruck();

    forkJoin([getOwnTruck, getOtherTruck]).subscribe((results) => {
      this.truckInfo = [...results[0], ...results[1]]

      this.truckInfo.map(data=>delete data['previous_status'])

      const reversedData = this.truckInfo.sort(this.sortByDate)

      this.dataSource.data = reversedData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.truckInfo.forEach((i) => {
        if (i.type === 'covered') {
          this.coverTypeTruck.push(i)
          //this.dataSource.data = this.coverTypeTruck;
          console.log("##################coverTypeTruck####################",this.coverTypeTruck);



        }
        else if (i.type === 'open') {

          this.openTypeTruck.push(i);
          console.log(this.openTypeTruck);
          //this.dataSource2.data = this.openTypeTruck;



        }

      });

      if (this.truckInfo.length === 0) {
        this.asyncService.finish();
      }
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

}
