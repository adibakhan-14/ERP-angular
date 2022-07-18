import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { Subscription } from 'rxjs';
import { TruckList } from '../models/truck.model';
import {
  statusDictionary,
  ordersBoardColors,
  statusList,
} from '../data/orders-board.constant';
import { TruckDeleteComponent } from '../truck-delete/truck-delete.component';
@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss']
})
export class InProgressComponent implements OnInit, OnDestroy {

  constructor(
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<InProgressComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) { }


  loadPendingDataSub: Subscription;
  truckStatusData = [];
  pending: TruckList[] = [];

  ordersBoardSub: Subscription;
  //pending=[];
  selectedItemsList = [];
  loadCompleted = [];
  inTransit = [];
  unloadComplete = [];

  updateTruckStatusSub: Subscription;

  pendingToLoadComplete = [];
  loadCompleteToInTransit = [];
  inTransitToUnLoadComplete = [];


  unLoadCompleteToInTransit = [];
  inTransitToLoadComplete=[];
  loadCompleteToPending=[];

  isPendingCheck: boolean = false;
  isLoadCompleteCheck: boolean = false;
  isInTransitCheck: boolean = false;
  isUnLoadCheck: boolean = false;

  ngOnInit(): void {
    this.loadTruckStatusTable();
  }

  private loadTruckStatusTable = (): void => {
    this.asyncService.start();
    this.loadPendingDataSub = this.orderService
      .getTruckStatus(this.data.order_id)
      .subscribe(
        (data) => {
          if (data) {

            this.truckStatusData = data;
            this.filterTruckStatusTable();
            this.asyncService.finish();
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg(
              'Error! No lease Data could not found'
            );
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Customers could not found');
        }
      );
  }

  checkPendingToLoadComplete() {

    this.selectedItemsList = this.pending.filter((value, index) => {
      return value.checked
    });
    this.pendingToLoadComplete = this.selectedItemsList;
    
    this.selectedItemsList = [];
    this.isPendingCheck = true;
  }

  checkLoadCompleteToInTransit() {
    this.selectedItemsList = this.loadCompleted.filter((value, index) => {
      return value.checked
    });
    this.loadCompleteToInTransit = this.selectedItemsList;
    this.loadCompleteToPending =  this.selectedItemsList;
   // this.inTransitToLoadComplete = this.selectedItemsList;
    this.selectedItemsList = [];

    this.isLoadCompleteCheck = true;
  }

  checkInTransitToUnLoadComplete() {
    this.selectedItemsList = this.inTransit.filter((value, index) => {
      return value.checked
    });
    this.inTransitToUnLoadComplete = this.selectedItemsList;
    this.inTransitToLoadComplete = this.selectedItemsList;
   // this.unLoadCompleteToInTransit = this.selectedItemsList;
    this.selectedItemsList = [];
    this.isInTransitCheck = true;
  }
  ///delha lagbe have to check logic
  checkUnloadCompelete() {
    this.selectedItemsList = this.unloadComplete.filter((value, index) => {
      return value.checked
    });
    this.unLoadCompleteToInTransit = this.selectedItemsList;
    this.selectedItemsList = [];
    this.isUnLoadCheck = true;
  }

  private clearTruckStatusTable = (): void => {
    this.pending = [];
    this.loadCompleted = [];
    this.inTransit = [];
    this.unloadComplete = [];
  };

  filterTruckStatusTable() {
    this.clearTruckStatusTable();
    this.truckStatusData.forEach((i) => {

      if ("pending" in i) {
        this.pending = i.pending;
      }
      if ("loadCompleted" in i) {
        this.loadCompleted = i.loadCompleted;
      }
      if ("inTransit" in i) {
        this.inTransit = i.inTransit;
      }
      if ("unloadComplete" in i) {
        this.unloadComplete = i.unloadComplete;
      }
    });

  }

  moveToPreviousStatus(){
    let mapData = []
    if (this.isLoadCompleteCheck) {
      console.log(' pre hello 1');

      mapData = this.loadCompleteToPending.map((item) => ({
        pk: item.pk,
        sk: item.sk,
        status: "pending",
        previous_status: item.status,
        prev_rent_status: item.status,
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,

      }));
      this.isLoadCompleteCheck=false;
      //   console.log('mapdata in consignment done',mapData);
    }
    else if (this.isInTransitCheck) {

      console.log(' pre hello 2');
      mapData = this.inTransitToLoadComplete.map((item) => ({
        pk: item.pk,
        sk: item.sk,
        status: "loadCompleted",
        previous_status: item.status,
        prev_rent_status: item.status,
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,

      }));

      this.isInTransitCheck=false;
    }
    else if (this.isUnLoadCheck) {

      console.log(' pre hello 3');
      mapData = this.unLoadCompleteToInTransit.map((item) => ({
        pk: item.pk,
        sk: item.sk,
        status: "inTransit",
        previous_status: item.status,
        prev_rent_status: item.status,
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,

      }));
      this.isUnLoadCheck=false;
    }
 
    console.log("mapdata", mapData);
    if (mapData.length === 0) {
      this.commonService.showErrorMsg('Please select any truck to move!');

    }
    else {

      this.asyncService.start();
      this.updateTruckStatusSub = this.orderService
        .updateStatus(mapData)
        .subscribe(
          (data) => {
            if (data) {
              this.asyncService.finish();
              this.commonService.showSuccessMsg('Truck status Updated!');
              this.loadTruckStatusTable();
              // this.close();
              //   this.loadOrdersBoard();
            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('Error! Not Updated!');
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Not Updated!');
          }
        );


    }
  

  }


  moveToNextStatus() {

    // let orderStatusUpdate = [
    //   {
    //     pk: this.data.order_id,
    //     sk: this.data.customer_id,
    //     status: 'inProgress',
    //     previous_status: this.data.status,
    //     updated_by: this.data.updated_by,
    //     order_id:this.data.order_id,
    //     prev_rent_status:"n/a",

    //   },
    // ];
    let mapData = []
    if (this.isPendingCheck) {

      console.log('hello 1');

      mapData = this.pendingToLoadComplete.map((item) => ({
        pk: item.pk,
        sk: item.sk,
        status: "loadCompleted",
        previous_status: item.status,
        prev_rent_status: item.status,
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,

      }));
      //   console.log('mapdata in consignment done',mapData);
      this.isPendingCheck=false;
    }
    else if (this.isLoadCompleteCheck) {

      console.log('hello 2');
      mapData = this.loadCompleteToInTransit.map((item) => ({
        pk: item.pk,
        sk: item.sk,
        status: "inTransit",
        previous_status: item.status,
        prev_rent_status: item.status,
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,

      }));

      this.isLoadCompleteCheck=false;
    }
    else if (this.isInTransitCheck) {

      console.log('hello 3');
      mapData = this.inTransitToUnLoadComplete.map((item) => ({
        pk: item.pk,
        sk: item.sk,
        status: "unloadComplete",
        previous_status: item.status,
        prev_rent_status: item.status,
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,

      }));

      this.isInTransitCheck=false;

    }
    console.log("mapdata", mapData);
    if (mapData.length === 0) {
      this.commonService.showErrorMsg('Please select any truck to move!');

    }
    else {

      this.asyncService.start();
      this.updateTruckStatusSub = this.orderService
        .updateStatus(mapData)
        .subscribe(
          (data) => {
            if (data) {
              this.asyncService.finish();
              this.commonService.showSuccessMsg('Truck status Updated!');
              this.loadTruckStatusTable();
              // this.close();
              //   this.loadOrdersBoard();
            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('Error! Not Updated!');
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Not Updated!');
          }
        );


    }
  }


  releaseTruck(){
    let releasedata=[];

     releasedata = this.unloadComplete.map((item) => (
      {
      pk: item.truck_id,
      sk: item.vendor_id,
      status: item.orientation === 'own' ? 'available' :'returned',
  //    status: "pending",
      previous_status: item.status,
      prev_rent_status: item.orientation === 'own' ? 'notAvailable' : 'rented',
      updated_by: this.data.updated_by,
      order_id:this.data.order_id,
    }));

    this.asyncService.start();
    this.updateTruckStatusSub = this.orderService
      .updateStatus(releasedata)
      .subscribe(
        (data) => {
          if (data) {
            this.asyncService.finish();
            this.commonService.showSuccessMsg('Truck status Updated!');
            this.loadTruckStatusTable();
            // this.close();
            //   this.loadOrdersBoard();
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Not Updated!');
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Not Updated!');
        }
      );

  }
  private filterBoardData = (feedbackBoardItem: OrdersBoardItem[]): void => {
   
    feedbackBoardItem.forEach((item) => {
      if (statusList.includes(item.status)) {
        this[item.status].push(item);
      }
    });
  };
  private loadOrdersBoard = (): void => {
    this.asyncService.start();
    this.ordersBoardSub = this.orderService.getOrdersBoard().subscribe(
      (data) => {

        if (data) {
          this.filterBoardData(data);
        }
        this.close();
        this.asyncService.finish();
 
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg(
          'Error! Order board data is not loaded.'
        );
      }
    );
  };

  cancel = (): void => {
   // this.loadOrdersBoard();
   this.close();
  }
  close = (): void => {
    this.dialogRef.close();
  };
  ngOnDestroy(): void {
    if (this.loadPendingDataSub) {
      this.loadPendingDataSub.unsubscribe();
    }

  }

  deleteTruck(data:any): void {
    const dialogRef = this.dialog.open(TruckDeleteComponent, {
      width: '400px',
      height: '300px',
      data:data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.loadTruckStatusTable();
    });
  }

}
