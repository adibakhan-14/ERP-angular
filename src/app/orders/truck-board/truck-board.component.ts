import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  TruckBoardItem,
  MovingTruckItem,
  truckStatusItems,
} from '../models/truck-board-item-model';
import {
  trucksBoardColors,
  truckStatusList,
  truckStatusDictionary,
} from '../data/trucks-board.constant';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import * as moment from 'moment';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDragStart,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DataService } from 'src/app/shared/services/data-pass-service';
@Component({
  selector: 'app-truck-board',
  templateUrl: './truck-board.component.html',
  styleUrls: ['./truck-board.component.scss'],
})
export class TruckBoardComponent implements OnInit {
  pending: TruckBoardItem[] = [];
  pendingAllCheck: TruckBoardItem[] = [];
  loadCompleted: TruckBoardItem[] = [];
  inTransit: TruckBoardItem[] = [];
  unloadComplete: TruckBoardItem[] = [];
  pendingToLoadCompleteMove: TruckBoardItem[] = [];
  park: TruckBoardItem[] = [];
  dropData: TruckBoardItem[] = [];
  //sameTruckRegData: TruckBoardItem[] = [];
  allTruckData = [];
  loadLeaseDataSub: Subscription;

  truckStatusObject: truckStatusItems;
  movingTruckItem: MovingTruckItem = null;

  colors = trucksBoardColors;
  truckBoardSub: Subscription;
  TruckUpdateBoardSub: Subscription;
  truckDeleteSub: Subscription;
  notAssignedTruckData = [];
  status = truckStatusDictionary;
  boardData: truckStatusItems;
  isClickedParent: boolean;

  @ViewChild('confirmForPark') confirmForCancelTruck: TemplateRef<any>;
  constructor(
    private router: Router,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    private sharedDataService: DataService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) { }

  ngOnInit(): void {
    this.loadTruckStatusBoard();
  }

  private clearTruckBoard = (): void => {
    this.pending = [];
    this.loadCompleted = [];
    this.inTransit = [];
    this.unloadComplete = [];
  };
  public doSomething(date: any): void {
    console.log('=================================Picked date: ================================', date);
    this.isClickedParent = date;
    if (this.isClickedParent === true) {
      this.loadTruckStatusBoard();
    }
  }

  private loadTruckStatusBoard = (): void => {
    this.asyncService.start();
    this.truckBoardSub = this.orderService
      .getTruckStatus(this.data.order_id)
      .subscribe(
        (data) => {
          if (data) {
            console.log("dataaaaaa", data);

            this.allTruckData = data;
            this.sharedDataService.changeMessage(this.allTruckData);

            this.filterBoardData();
          }
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

  private filterBoardData = (): void => {
    this.clearTruckBoard();
    this.allTruckData.forEach((i) => {
      if ('pending' in i) {
        this.pending = i.pending;
      }
      if ('loadCompleted' in i) {
        this.loadCompleted = i.loadCompleted;
      }
      if ('inTransit' in i) {
        this.inTransit = i.inTransit;
      }
      if ('unloadComplete' in i) {
        this.unloadComplete = i.unloadComplete;
      }
    });
    this.loadLeaseDataSub = this.orderService
      .getLease(this.data.order_id)
      .subscribe(
        (data) => {
          //this.notAssignedTruckData = data[0].information;
          data[0].information.forEach(element => {
            if (!('truck_reg' in element && 'trip_id' in element)) {
              this.pending.push(element);
            }
          });
        });
  };

  releaseTruckModal(TruckItem: any) {
    this.commonService.showDialog(
      {
        title: 'Are you sure want to release this truck? ',
        content: this.confirmForCancelTruck,
      },
      () => this.releaseTruck(TruckItem)
    );
  }

  sharedData = this.sharedDataService.currentMessage1.subscribe((data) => {
    console.log(data, "releasereleasereleasereleasereleaserelease");

    if (data[1] === "release") {
      let releasedata = [];
      releasedata = this.unloadComplete.map((item) => ({
        pk: item.trip_id,
        sk: item.vendor_id,
        status: item.orientation === 'own' ? 'available' : 'returned',
        //    status: "pending",
        previous_status: item.status,
        prev_rent_status: item.orientation === 'own' ? 'notAvailable' : 'rented',
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,
        loading_point: item.loading_point,
        unloading_point: item.unloading_point,
        rent_time: item.rent_time,
        round_trip: item.round_trip,
        driver_status: "no"
      }));


      this.truckDeleteSub = this.orderService.updateStatus(releasedata).subscribe()

    }

  })

  releaseTruck(TruckItem: any) {
    let releasedata = [];
    releasedata = this.unloadComplete.map((item) => ({
      pk: item.trip_id,
      sk: item.vendor_id,
      status: item.orientation === 'own' ? 'available' : 'returned',
      //    status: "pending",
      previous_status: item.status,
      prev_rent_status: item.orientation === 'own' ? 'notAvailable' : 'rented',
      updated_by: this.data.updated_by,
      order_id: this.data.order_id,
      loading_point: item.loading_point,
      unloading_point: item.unloading_point,
      rent_time: item.rent_time,
      round_trip: item.round_trip,
      driver_status: "no"
    }));

    this.asyncService.start();
    this.truckDeleteSub = this.orderService.updateStatus(releasedata).subscribe(
      (data) => {
        if (data) {
          this.loadTruckStatusBoard();
          this.asyncService.finish();
          this.commonService.showSuccessMsg('Release successfully truck from inprogress');
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
  deleteTruck(TruckItem: any) {
    let mapData = [];
    mapData.push({
      pk: TruckItem.truck_id,
      sk: TruckItem.vendor_id,
      status: 'cancel',
      //    status: "pending",
      previous_status: this.data.status,
      prev_rent_status: this.data.status,
      updated_by: this.data.updated_by,
      order_id: this.data.order_id,
      loading_point: TruckItem.loading_point,
      unloading_point: TruckItem.unloading_point,
      rent_time: TruckItem.rent_time,
      round_trip: TruckItem.round_trip,
      driver_status: "no"
    });



    this.asyncService.start();
    this.truckDeleteSub = this.orderService.updateStatus(mapData).subscribe(
      (data) => {
        if (data) {
          this.loadTruckStatusBoard();
          this.asyncService.finish();
          this.commonService.showSuccessMsg('Deleted!!!');
          //  this.close();
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
  drop(event: CdkDragDrop<any[]>) {
    let truck_rent_time;
    let isPendingCheck;
    let isLoadCompleteCheck;
    let isInTransitCheck;
    let isUnLoadComplete;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      try {
        this.movingTruckItem = {
          item: event.previousContainer.data[event.previousIndex],
        };
        truck_rent_time = this.movingTruckItem.item.rent_time;
        let truck_rent_time_split = truck_rent_time.split('+');
        let firstSelectedFromSlice = truck_rent_time_split[0];
        let firstSelectedDate = moment(truck_rent_time_split[0]);
        let sameTruckRegData = [];
        for (let i = 0; i < event.previousContainer.data.length; i++) {
          for (let j = 0; j < event.previousContainer.data.length; j++) {
            if (i !== j) {
              if (event.previousContainer.data[i].truck_reg === event.previousContainer.data[j].truck_reg) {
                sameTruckRegData.push(event.previousContainer.data[i]);
                break;
              }
            }
          }
        }
        if (sameTruckRegData.length !== 0) {

          if (sameTruckRegData[0].truck_reg !== this.movingTruckItem.item.truck_reg) {
            this.updateOrdersBoard(event, this.movingTruckItem.item);
          }
          else if (sameTruckRegData[0].truck_reg === this.movingTruckItem.item.truck_reg) {

            for (let i = 0; i < sameTruckRegData.length; i++) {
              let secondSelected = sameTruckRegData[i].rent_time.split('+');
              let secondSelectedFromSlice = secondSelected[0];
              let secondSelectedDate = moment(secondSelected[0]);
              let duration = moment.duration(firstSelectedDate.diff(secondSelectedDate));
              let diffrenceInSecond = duration.asSeconds();
              // console.log("==diffrenceInSecond===",diffrenceInSecond);

              if (diffrenceInSecond < 0) {
                this.updateOrdersBoard(event, this.movingTruckItem.item);
              }
            }
          }
        }
        else if (sameTruckRegData.length === 0) {
          //  console.log("== sameTruckRegData.length === 0   helll====2");

          this.loadCompleted.forEach(element => {
            if (this.movingTruckItem.item.truck_reg === element.truck_reg) {
              isLoadCompleteCheck = true;
            }
          });
          this.inTransit.forEach(element => {
            if (this.movingTruckItem.item.truck_reg === element.truck_reg) {
              isInTransitCheck = true;
            }
          });

          this.unloadComplete.forEach(element => {

            if (this.movingTruckItem.item.truck_reg === element.truck_reg) {
              isUnLoadComplete = true;


            }
          });
          // if(this.movingTruckItem.item.status==='pending' &&   this.isUnLoadComplete===true && this.movingTruckItem.item.round_trip==='yes'){
          //         this.updateOrdersBoard(event,this.movingTruckItem.item);
          // }
          if (this.movingTruckItem.item.round_trip === 'yes') {
            if (isUnLoadComplete === true && this.movingTruckItem.item.status === 'pending') {
              this.updateOrdersBoard(event, this.movingTruckItem.item);
            }
            else if (this.movingTruckItem.item.status === 'loadCompleted') {
              this.updateOrdersBoard(event, this.movingTruckItem.item);
            }
            else if (this.movingTruckItem.item.status === 'inTransit') {
              this.updateOrdersBoard(event, this.movingTruckItem.item);
            }
            // else if(this.movingTruckItem.item.status==='unloadComplete'){
            //   this.updateOrdersBoard(event,this.movingTruckItem.item);
            // }
          }
          else {
            this.updateOrdersBoard(event, this.movingTruckItem.item);
          }

        }
        if (event.container.id === 'loadCompleted') {
          //  this.updateOrdersBoard(event,this.movingTruckItem.item);
          // console.log("====event container id===", event.container.id);
          // console.log("==this.loadCompleted ==", this.loadCompleted);
          // console.log("==this.event.container ==", event.container.data);
          // console.log("==this.event.previous container ==", event.previousContainer.data);

        }

        else if (event.container.id === 'inTransit') {

        } else if (event.container.id === 'unloadComplete') {

        } else if (event.container.id === 'pending') {

        } else if (event.container.id === 'cancel') {


          this.commonService.showDialog(
            {
              title: 'Are you sure want to delete?',
              content: this.confirmForCancelTruck,
            },
            () =>
              this.deleteTruck(
                event.previousContainer.data[event.previousIndex]
              )
          );
        }
      }
      catch (error) {
        this.movingTruckItem = null;
        this.commonService.showErrorMsg('Error! The board is not updated.');
      }
    }
  }
  private updateOrdersBoard = (
    event: CdkDragDrop<TruckBoardItem[]>,
    data?: any,
    callback?: Function
  ): void => {
    const currentStatus = event.previousContainer.id;
    const nextStatus = event.container.id;
    const draggedServiceData =
      event.previousContainer.data[event.previousIndex];
    console.log('eveeent', draggedServiceData, event);
    console.log("=========data updateorderboard========", data);
    console.log("=====event container data=====", event.container.data);
    console.log("=====event pre container data=====", event.previousContainer.data);
    console.log("===next status===", nextStatus);
    // let dataArry = [];
    // dataArry.push(data);
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // moveItemInArray(
    //   event.container.data,
    //   event.previousIndex,
    //   event.currentIndex
    // );
    let moveTruckStatus = [
      {

        pk: data.pk,
        sk: data.sk,
        status: nextStatus,
        previous_status: draggedServiceData.status,
        updated_by: draggedServiceData.updated_by,
        order_id: draggedServiceData.order_id,
        prev_rent_status: draggedServiceData.prev_rent_status,
        loading_point: draggedServiceData.loading_point,
        unloading_point: draggedServiceData.unloading_point,
        rent_time: draggedServiceData.rent_time,
        round_trip: draggedServiceData.round_trip,
        product_and_destination:draggedServiceData.product_and_destination,
        driver_status: "no"
      },
    ];


    let sendSMS = [{
      truckSize: draggedServiceData.length,
      order_id: draggedServiceData.order_id,
      truck_reg: draggedServiceData.truck_reg,
      name: draggedServiceData.vendor_name,
      truck_loading_point: draggedServiceData.loading_point,
      truck_unloading_point: draggedServiceData.unloading_point,
      truck_loading_phone: draggedServiceData.loading_phone,
      truck_unloading_phone: draggedServiceData.unloading_phone,
      phone: draggedServiceData.phone
    }]


    this.asyncService.start();


    this.asyncService.start();
    this.TruckUpdateBoardSub = this.orderService
      .updateStatus(moveTruckStatus)
      .subscribe(
        (data) => {
          if (data) {
            //this.orderService.sendSms(sendSMS,"orderConfirmed").subscribe()

            this.asyncService.finish();
            this.commonService.showSuccessMsg('Truck status Updated!');
            this.loadTruckStatusBoard();
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

  };
}
