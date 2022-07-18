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



@Component({
  selector: 'app-truck-list-modal',
  templateUrl: './truck-list-modal.component.html',
  styleUrls: ['./truck-list-modal.component.scss']
})
export class TruckListModalComponent implements OnInit {

  constructor(
    private orderService: OrderService,
    private asyncService:AsyncService,
    public dialog: MatDialog,


  ) { }

  truckInfo: TruckList[] = [];
  coverTypeTruck = [];
  openTypeTruck = [];

  displayedColumns: string[] = ['Truck Registration No', 'Truck Length','Truck capacity','Truck Status','Truck Type'];
  //displayedColumns2: string[] = ['Vendor Name', 'Truck Registration No', 'Truck Length','Truck capacity','Action'];

  dataSource = new MatTableDataSource<any>()
  //dataSource2 = new MatTableDataSource<any>()



  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatPaginator) paginator2: MatPaginator;



  ngOnInit(): void {
    this.getTruckList() 

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource2.paginator = this.paginator2;



  }

  editItem(data: any): void {
    const dialogRef = this.dialog.open(TruckAddModalComponent, {
      width: '800px',
      height: '500px',
      data: data,
    }

    );
     
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getTruckList() {
    let getOwnTruck = this.orderService.ownTruck();
    let getOtherTruck = this.orderService.otherTruck();

    forkJoin([getOwnTruck, getOtherTruck]).subscribe((results) => {
      this.truckInfo = [...results[0], ...results[1]]

      this.dataSource.data = this.truckInfo;

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
