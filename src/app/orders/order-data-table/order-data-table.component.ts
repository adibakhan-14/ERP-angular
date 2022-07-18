import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
  statusDictionary,
  ordersBoardColors,
  statusList,
} from '../data/orders-board.constant';
import { OrdersBoardItem, MovingItem } from '../models/orders-board-item.model';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerAddModalComponent } from 'src/app/customer/customer-add-modal/customer-add-modal.component';
import { TruckAddModalComponent } from '../truck-add-modal/truck-add-modal.component';
import {
  Customer,
  OrderAddModalComponent,
} from '../order-add-modal/order-add-modal.component';
import { DetailsCollectedModalComponent } from '../details-collected-modal/details-collected-modal.component';
import { OrderConfirmedModalComponent } from '../order-confirmed-modal/order-confirmed-modal.component';
import { OrderService } from '../services/orders.service';
import { TruckList } from '../models/truck.model';
import { OrderDetailShowComponent } from '../order-detail-show/order-detail-show.component';
import { OrderDeleteComponent } from '../order-delete/order-delete.component';
import { EmployeeAddModalComponent } from 'src/app/customer/employee-add-modal/employee-add-modal.component';
import { OrderConfirmModifiedComponent } from '../order-confirm-modified/order-confirm-modified.component';
import { InProgressComponent } from '../in-progress/in-progress.component';
import { UpdateStatusModalComponent } from '../update-status-modal/update-status-modal.component';
import { TruckBoardComponent } from '../truck-board/truck-board.component';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ProductAddModalComponent } from '../product-add-modal/product-add-modal.component';
import { DataService } from 'src/app/shared/services/data-pass-service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { InProgressV2Component } from '../in-progress-v2/in-progress-v2.component';
import { AddPartnerComponent } from '../add-partner/add-partner.component';
import { AddDriverComponent } from '../add-driver/add-driver/add-driver.component';

@Component({
  selector: 'app-order-data-table',
  templateUrl: './order-data-table.component.html',
  styleUrls: ['./order-data-table.component.scss']
})
export class OrderDataTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'order_id', 'created_date', 'phone','status','action'];

  customerControl = new FormControl();
  filteredStates: Observable<Customer[]>;
  customers: Customer[] = [];

  ordersPlaced: OrdersBoardItem[] = [];
  detailsCollected: OrdersBoardItem[] = [];
  orderConfirmed: OrdersBoardItem[] = [];
  loadCompleted: OrdersBoardItem[] = [];
  inTransit: OrdersBoardItem[] = [];
  unloadComplete: OrdersBoardItem[] = [];
  consignmentDone: OrdersBoardItem[] = [];
  inProgress: OrdersBoardItem[] = [];
  unloadCompleteTruck = [];
  allTruckData = [];
  movingItem: MovingItem = null;
  colors = ordersBoardColors;
  truckData = [];
  status = statusDictionary;
  boardData: OrdersBoardItem;

  ordersBoardSub: Subscription;
  updateBoardSub: Subscription;
  loadCustomerSub: Subscription;

  loadLease: Subscription;
  orderLeaseConsignmentSub: Subscription;

  stringFrom: string;
  stringTo: string;
  condition = true;
  customerId: string;
  private mediaSub: Subscription;
  dataSource: any;
  check = false;

  dataStatusArray = []

  constructor(
    private cdRef: ChangeDetectorRef,
    private mediaObserver: MediaObserver,
    private router: Router,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    private sharedDataService: DataService,
    public dialog: MatDialog
  ) { }

  //Stepper coding for backend hit mapping by sandilazad

  selectionChange(event: StepperSelectionEvent) {
    const statusList = ['ordersPlaced', 'detailsCollected',
    'orderConfirmed', 'inProgress', 'consignmentDone']
    const status = event.selectedStep.label
    switch (status) {
      case 'Orders Place':
        this.loadOrdersBoard(statusList[0])
        // this.ordersPlaced = this.dataStatusArray
        // console.log(this.ordersPlaced,"Orders Place")
        break;
      case 'Details Collected':
        this.loadOrdersBoard(statusList[1])
        // this.detailsCollected = this.dataStatusArray
        // console.log(this.detailsCollected,"Details Collected")
        break;
      case 'Order Confirmed':
        this.loadOrdersBoard(statusList[2])
        // this.orderConfirmed = this.dataStatusArray
        // console.log(this.ordersPlaced,"Order Confirmed")
        break;
      case 'In Progress':
        this.loadOrdersBoard(statusList[3])
        // this.inTransit = this.dataStatusArray
        // console.log(this.inTransit,"In Progress")
        break;
      case 'Consignment Done':
        this.loadOrdersBoard(statusList[4])
        // this.consignmentDone = this.dataStatusArray
        // console.log(this.consignmentDone,"Consignment Done")
        break;
      default:
        console.log(`Sorry, we are out of ${status}.`);
    }


  }

//Stepper coding for backend hit mapping by sandilazad


  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (change: MediaChange) => { }
    );

    this.loadCustomerSub = this.orderService.getCustomer().subscribe(
      (data) => {
        if (data) {
          this.customers = data;
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Customers could not found');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! Customers could not found');
      }
    );

    this.filteredStates = this.customerControl.valueChanges.pipe(
      startWith(''),
      map((state) =>
        state ? this._filterStates(state) : this.customers.slice()
      )
    );

    this.loadOrdersBoard('ordersPlaced')

  }

  private _filterStates(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private clearFeedbackBoard = (): void => {
    this.ordersPlaced = [];
    this.detailsCollected = [];
    this.orderConfirmed = [];
    this.loadCompleted = [];
    this.inTransit = [];
    this.unloadComplete = [];
    this.consignmentDone = [];
    this.inProgress = [];
  };

  private filterBoardData = (feedbackBoardItem: OrdersBoardItem[]): void => {
    this.clearFeedbackBoard();
    feedbackBoardItem.forEach((item) => {
      if (statusList.includes(item.status)) {
        this[item.status].push(item);
      }
    });
  };

  loadOrdersBoard = (status): any => {
    let statusData ;
    this.asyncService.start();
    this.ordersBoardSub = this.orderService.getOrdersBoard().subscribe(
      (data) => {
        if (data) {
          this.dataStatusArray = data.filter((item => item.status == status),
          )
        }
        this.asyncService.finish();
       },

      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg(
          'Error! Order board data is not loaded.'
        );
      },
  );




  };
  private loadOrdersBoardOnecustomer = (): void => {
    this.asyncService.start();
    this.ordersBoardSub = this.orderService
      .getOrdersBoardOnecustomer(this.customerId)
      .subscribe(
        (data) => {
          if (data) {
            this.filterBoardData(data);
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

  getcustomerId(customerId) {
    this.customerId = customerId;
    console.log(customerId);
    this.loadOrdersBoardOnecustomer();
  }

  openDialog(value,element){
          console.log(value)
          console.log(element)
  }

  nextStepOrder(value,element){


    console.log(element)

    //    let moveOrderStatus = [
    //   {
    //     pk: element.order_id,
    //     sk: element.customer_id,
    //     status: value,
    //     previous_status: element.previous_status,
    //     updated_by: element.updated_by,
    //     order_id: element.order_id,
    //     prev_rent_status: 'n/a',
    //     rent_time: ' ',
    //     round_trip: ' ',
    //     driver_status: ' ',
    //   },
    // ];


    try {

      if (value === 'detailsCollected') {
        const dialogRef = this.dialog.open(DetailsCollectedModalComponent, {
          width: '1200px',
          height: '550px',
          data: element,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log("helloooooooooo  detailsCollected poreeeeee ");
            this.loadOrdersBoard('detailsCollected');
          } else {
            console.log(result, 'The dialog was closed');
          }
        });
      } else if (value === 'orderConfirmed') {
        const dialogRef = this.dialog.open(OrderConfirmModifiedComponent, {
          width: '1000px',
          height: '550px',
          data: element,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.loadOrdersBoard('orderConfirmed');
          }
        });
      } else if (value === 'inProgress') {
        console.log(value)
        const dialogRef = this.dialog.open(InProgressV2Component, {
          width: '1200px',
          height: '550px',
          data: element,
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.loadOrdersBoard('inProgress');
          if (result) {
            this.loadOrdersBoard('inProgress');
          }
        });
      } else {
        this.stringFrom = element.previousstatus;
        let stringFromSlice = this.stringFrom.split(/(?=[A-Z])/);
        let stringFromSliceUpper = stringFromSlice[0];
        let finalStringFrom =
          stringFromSliceUpper.charAt(0).toUpperCase() +
          stringFromSliceUpper.slice(1) +
          ' ' +
          stringFromSlice[1];

        this.stringTo = element.id;
        let stringToSlice = this.stringTo.split(/(?=[A-Z])/);
        let stringToSliceUpper = stringToSlice[0];
        let finalStringTo =
          stringToSliceUpper.charAt(0).toUpperCase() +
          stringToSliceUpper.slice(1) +
          ' ' +
          stringToSlice[1];

        this.commonService.showDialog(
          {
            title: `Move!!  ${finalStringFrom} To ${finalStringTo}.`,
            content: 'Are you sure?',
          },
          () => console.log(element)
        );
      }
    } catch (error) {
      this.movingItem = null;
      this.commonService.showErrorMsg('Error! The board is not updated.');
    }


  }
  // drop(event: CdkDragDrop<any[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     try {
  //       this.movingItem = {
  //         item: event.previousContainer.data[event.previousIndex],
  //       };
  //       if (event.container.id === 'detailsCollected') {
  //         console.log("helloooooooooo  detailsCollected  ");

  //         const dialogRef = this.dialog.open(DetailsCollectedModalComponent, {
  //           width: '1000px',
  //           height: '550px',
  //           data: this.movingItem.item,
  //         });

  //         dialogRef.afterClosed().subscribe((result) => {
  //           if (result) {
  //             console.log("helloooooooooo  detailsCollected poreeeeee ");
  //             this.loadOrdersBoard();
  //           } else {
  //             console.log(result, 'The dialog was closed');
  //           }
  //         });
  //       } else if (event.container.id === 'orderConfirmed') {
  //         const dialogRef = this.dialog.open(OrderConfirmModifiedComponent, {
  //           width: '1000px',
  //           height: '550px',
  //           data: this.movingItem.item,
  //         });
  //         dialogRef.afterClosed().subscribe((result) => {
  //           if (result) {
  //             this.loadOrdersBoard();
  //           }
  //         });
  //         //   window.open("www.example.com");
  //       } else if (event.container.id === 'inProgress') {
  //         console.log('====hell === in progrss===');

  //         const dialogRef = this.dialog.open(UpdateStatusModalComponent, {
  //           minWidth: '550px',
  //           data: this.movingItem.item,
  //         });
  //         dialogRef.afterClosed().subscribe((result) => {
  //           this.loadOrdersBoard();
  //           if (result) {
  //             this.loadOrdersBoard();
  //             /// this.updateOrdersBoard(event)
  //           }
  //         });
  //       } else {
  //         this.stringFrom =
  //           event.previousContainer.data[event.previousIndex].status;
  //         let stringFromSlice = this.stringFrom.split(/(?=[A-Z])/);
  //         let stringFromSliceUpper = stringFromSlice[0];
  //         let finalStringFrom =
  //           stringFromSliceUpper.charAt(0).toUpperCase() +
  //           stringFromSliceUpper.slice(1) +
  //           ' ' +
  //           stringFromSlice[1];

  //         this.stringTo = event.container.id;
  //         let stringToSlice = this.stringTo.split(/(?=[A-Z])/);
  //         let stringToSliceUpper = stringToSlice[0];
  //         let finalStringTo =
  //           stringToSliceUpper.charAt(0).toUpperCase() +
  //           stringToSliceUpper.slice(1) +
  //           ' ' +
  //           stringToSlice[1];

  //         this.commonService.showDialog(
  //           {
  //             title: `Move!!  ${finalStringFrom} To ${finalStringTo}.`,
  //             content: 'Are you sure?',
  //           },
  //           () => this.updateOrdersBoard(event)
  //         );
  //       }
  //     } catch (error) {
  //       this.movingItem = null;
  //       this.commonService.showErrorMsg('Error! The board is not updated.');
  //     }
  //   }
  // }
  // private updateOrdersBoard = (
  //   event: CdkDragDrop<OrdersBoardItem[]>,
  //   data?: any,
  //   callback?: Function
  // ): void => {
  //   const currentStatus = event.previousContainer.id;
  //   const nextStatus = event.container.id;
  //   const draggedServiceData =
  //     event.previousContainer.data[event.previousIndex];
  //   console.log('eveeent', draggedServiceData, event);

  //   let moveOrderStatus = [
  //     {

  //       pk: draggedServiceData.order_id,
  //       sk: draggedServiceData.customer_id,
  //       status: nextStatus,
  //       previous_status: draggedServiceData.status,
  //       updated_by: draggedServiceData.updated_by,
  //       order_id: draggedServiceData.order_id,
  //       prev_rent_status: 'n/a',
  //       loading_point: ' ',
  //       unloading_point: ' ',
  //       rent_time: ' ',
  //       round_trip: ' ',
  //       driver_status: ' ',
  //     },
  //   ];
  //   this.asyncService.start();


  //   if (nextStatus == 'consignmentDone') {
  //     this.sharedDataService.currentMessage.subscribe(
  //       (data) => {
  //         if (data[0].pending.length === 0 && data[1].loadCompleted.length === 0 && data[2].inTransit.length === 0) {
  //           this.sharedDataService.changeMessage1([data[3].unloadComplete,"release"]);
  //           this.check = true
  //         } else if(data[0].pending.length === 0) {
  //           this.check = false
  //           this.commonService.showErrorMsg('Please release truck from inprogress');
  //           this.asyncService.finish();

  //         }
  //       },
  //       (error) => {
  //         this.commonService.showErrorMsg('Error! Not Updated!');
  //       }
  //     );

  //   }


  //   if (this.check ) {




  //     if (nextStatus == 'consignmentDone') {

  //       this.loadLease = this.orderService
  //         .getTruckStatus(draggedServiceData.order_id)
  //         .subscribe((data) => {
  //           if (data) {
  //             this.allTruckData = data;
  //             this.allTruckData.forEach((i) => {
  //               if ('unloadComplete' in i) {
  //                 this.unloadCompleteTruck = i.unloadComplete;
  //               }
  //             });

  //             let mapData = this.unloadCompleteTruck.map((item) => ({
  //               pk: item.pk,
  //               sk: item.sk,
  //               status: item.orientation === 'own' ? 'available' : 'returned',
  //               previous_status: item.status,
  //               prev_rent_status:
  //                 item.orientation === 'own' ? 'notAvailable' : 'rented',
  //               updated_by: item.updated_by,
  //               order_id: item.order_id,
  //               loading_point: item.truck_loading_point,
  //               unloading_point: item.truck_unloading_point,
  //               rent_time: item.rent_time,
  //               round_trip: item.round_trip,
  //               driver_status: 'no',
  //             }));
  //             mapData = [...moveOrderStatus, ...mapData];

  //             this.updateBoardSub = this.orderService
  //               .updateStatus(mapData)
  //               .subscribe(
  //                 (data) => {
  //                   if (data) {
  //                     this.asyncService.finish();
  //                     this.commonService.showSuccessMsg('Board Updated!');
  //                     this.loadOrdersBoard();
  //                   } else {
  //                     this.asyncService.finish();
  //                     this.commonService.showErrorMsg('Error! Not Updated!');
  //                   }
  //                 },
  //                 (error) => {
  //                   this.asyncService.finish();
  //                   this.commonService.showErrorMsg('Error! Not Updated!');
  //                 }
  //               );
  //           }
  //         });
  //     } else {
  //       console.log('moveorderstatus', moveOrderStatus);

  //       this.updateBoardSub = this.orderService
  //         .updateStatus(moveOrderStatus)
  //         .subscribe(
  //           (data) => {
  //             if (data) {
  //               this.asyncService.finish();
  //               this.commonService.showSuccessMsg('Board Updated!');
  //               this.loadOrdersBoard();
  //             } else {
  //               this.asyncService.finish();
  //               this.commonService.showErrorMsg('Error! Not Updated!');
  //             }
  //           },
  //           (error) => {
  //             this.asyncService.finish();
  //             this.commonService.showErrorMsg('Error! Not Updated!');
  //           }
  //         );
  //     }
  //   };

  // }
  //All modal functionality


  customerAdd(): void {
    const dialogRef = this.dialog.open(CustomerAddModalComponent, {
      width: '730px',
      height: '405px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  vendorAdd(): void {
    const dialogRef = this.dialog.open(AddPartnerComponent, {
      width: '735px',
      height: '400px',
      backdropClass: 'gk',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  poductAdd(): void {
    const dialogRef = this.dialog.open(ProductAddModalComponent, {
      width: '500px',
      height: '300px',
      backdropClass: 'gk',

    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  onClickEvent(data: any) {
    const dialogRef = this.dialog.open(TruckBoardComponent, {
      width: '2000px',
      height: '680px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.loadOrdersBoard();
      }
    });
  }
  truckAdd(): void {
    const dialogRef = this.dialog.open(TruckAddModalComponent, {
      width: '730px',
      height: '485px',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  orderAdd(): void {
    // const dialogRef = this.dialog.open(OrderAddModalComponent, {
    //   width: '1000px',
    //   height: '600px'

    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   this.loadOrdersBoard();
    // });

    this.router.navigate(['/orders/addOrder']);
  }
  employeeAdd(): void {
    const dialogRef = this.dialog.open(EmployeeAddModalComponent, {
      width: '730px',
      height: '325px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`khulse!!`);
    });
  }
  driverAdd() {
    const dialogRef = this.dialog.open(AddDriverComponent, {
      width: '730px',
      height: '325px',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  orderDetailShow(data: any): void {
    console.log('hgsaggdata kskdlklsk', data);
    const dialogRef = this.dialog.open(OrderDetailShowComponent, {
      width: '1200px',
      height: '450px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.loadOrdersBoard();
    });
  }

  orderDetele(data: any): void {
    console.log('orderDetelehgsaggdata kskdlklsk', data);
    const dialogRef = this.dialog.open(OrderDeleteComponent, {
      width: '500px',

      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.loadOrdersBoard();
    });
  }

  search() {
    this.condition = false;
  }

  ngOnDestroy(): void {
    if (this.ordersBoardSub) {
      this.ordersBoardSub.unsubscribe();
    }
    if (this.updateBoardSub) {
      this.updateBoardSub.unsubscribe();
    }
    this.asyncService.finish();
  }
}

