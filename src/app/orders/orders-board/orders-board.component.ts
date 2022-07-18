import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { UpdateStatusV2Component } from '../update-status-v2/update-status-v2.component';
import { LoadCompleteModalComponent } from '../load-complete-modal/load-complete-modal.component';
import { InTransitModalComponent } from '../in-transit-modal/in-transit-modal.component';
import { UnloadCompleteModalComponent } from '../unload-complete-modal/unload-complete-modal.component';
import { TruckBoardItem } from '../models/truck-board-item-model';
import { ChallanComponent } from 'src/app/report/challan/challan.component';
import { ChallanModalComponent } from '../challan-modal/challan-modal.component';
import { OrderPlaceViewModalComponent } from '../order-place-view-modal/order-place-view-modal.component';
import { ProductTruckTaggingModalComponent } from '../product-truck-tagging-modal/product-truck-tagging-modal.component';
import { ProductTruckSuccessfullModalComponent } from '../product-truck-successfull-modal/product-truck-successfull-modal.component';
import { OrderPlaceViewLeaseModalComponent } from '../order-place-view-lease-modal/order-place-view-lease-modal.component';
import { DetailsCollectedViewModalComponent } from '../details-collected-view-modal/details-collected-view-modal.component';
import { OrderConfirmedViewModalComponent } from '../order-confirmed-view-modal/order-confirmed-view-modal.component';
import { NewOrderConfirmModifiedComponent } from '../new-order-confirm-modified/new-order-confirm-modified.component';
import { NewTruckTaggingModalComponent } from '../new-truck-tagging-modal/new-truck-tagging-modal.component';
import { TripChallanModalComponent } from '../trip-challan-modal/trip-challan-modal.component';
import { TripUnsuccessfullComponent } from '../trip-unsuccessfull/trip-unsuccessfull.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';

@Component({
  selector: 'app-orders-board',
  templateUrl: './orders-board.component.html',
  styleUrls: ['./orders-board.component.scss'],
})
export class OrdersBoardComponent implements OnInit {
  // childData: any;
  loadCompleteSub: Subscription;
  totalDashboardPercentageCountSub: Subscription;
  ordersPlaced1: OrdersBoardItem[] = [];
  detailsCollected1 : OrdersBoardItem[] = [];
  consignmentDone1: OrdersBoardItem[] = [];
  inProgress1: OrdersBoardItem[] = [];
  loadPoint1 : OrdersBoardItem[] = [];
  orderConfirmed1: OrdersBoardItem[] = [];
  unloadPoint1 : OrdersBoardItem[] = [];

  displayedColumns: string[] = [
    'name',
    'order_id',
    'trip_id',
    'created_date',
    'status',
    'action',
  ];
  ordersPlaced: OrdersBoardItem[] = [];
  detailsCollected: OrdersBoardItem[] = [];
  orderConfirmed: OrdersBoardItem[] = [];
  loadCompleted: OrdersBoardItem[] = [];
  inTransit = [];
  unloadComplete = [];
  consignmentDone = [];

  pendingToLoadCompleteMove: TruckBoardItem[] = [];

  customerControl = new FormControl();
  filteredStates: Observable<Customer[]>;
  customers: Customer[] = [];

  inProgress = [];
  inTransitSub: Subscription;
  unloadSub: Subscription;
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

  dataStatusArray1 = new MatTableDataSource<any>();
  dataStatusArray2 = new MatTableDataSource<any>();
  dataStatusArray3 = new MatTableDataSource<any>();
  dataStatusArray4 = new MatTableDataSource<any>();
  dataStatusArray5 = new MatTableDataSource<any>();
  dataStatusArray6 = new MatTableDataSource<any>();
  dataStatusArray7 = new MatTableDataSource<any>();
  dataStatusArray8 = new MatTableDataSource<any>();
  tripArray=[];
  tripStatusArray=[];
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('sort3') sort3: MatSort;
  @ViewChild('paginator4') paginator4: MatPaginator;
  @ViewChild('sort4') sort4: MatSort;
  @ViewChild('paginator5') paginator5: MatPaginator;
  @ViewChild('sort5') sort5: MatSort;
  @ViewChild('paginator6') paginator6: MatPaginator;
  @ViewChild('sort6') sort6: MatSort;
  @ViewChild('paginator7') paginator7: MatPaginator;
  @ViewChild('sort7') sort7: MatSort;


  constructor(
    private cdRef: ChangeDetectorRef,
    private mediaObserver: MediaObserver,
    private router: Router,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    private sharedDataService: DataService,
    private dashBoardService: DashboardService,
    public dialog: MatDialog
  ) {}

  //Stepper coding for backend hit mapping by sandilazad

  selectionChange(event: StepperSelectionEvent) {
    const statusList = [
      'ordersPlaced',
      'detailsCollected',
      'orderConfirmed',
      'loadCompleted',
      'inTransit',
      'unloadComplete',
      'consignmentDone',
    ];
    const status = event.selectedStep.label;
    switch (status) {
      case 'Placed Trips':
        this.loadOrdersBoard(statusList[0]);
        // this.ordersPlaced = this.dataStatusArray
        // console.log(this.ordersPlaced,"Orders Place")
        break;
      case 'Details Collected':
        this.loadOrdersBoard(statusList[1]);
        // this.detailsCollected = this.dataStatusArray
        // console.log(this.detailsCollected,"Details Collected")
        break;
      case 'Order Confirmed':
        this.loadOrdersBoard(statusList[2]);
        // this.orderConfirmed = this.dataStatusArray
        // console.log(this.ordersPlaced,"Order Confirmed")
        break;
      case 'Load Point':
        this.loadOrdersBoard(statusList[3]);
        console.log(this.loadCompleted ,'LOAD COMPLETE');

        // this.inTransit = this.dataStatusArray
        // console.log(this.inTransit,"In Progress")
        break;
      case 'In Transit':
        this.loadOrdersBoard(statusList[4]);
        // this.orderConfirmed = this.dataStatusArray
        // console.log(this.ordersPlaced,"Order Confirmed")
        break;
      case 'Unload Point':
        this.loadOrdersBoard(statusList[5]);
        // this.orderConfirmed = this.dataStatusArray
        // console.log(this.ordersPlaced,"Order Confirmed")
        break;
      case 'Successful':
        this.loadOrdersBoard(statusList[6]);
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
      (change: MediaChange) => {}
    );

    this.loadCustomerSub = this.orderService.getCustomer().subscribe(
      (data) => {
        if (data) {
          this.customers = data;
          console.log(this.customers, "Customers are found");

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

    this.loadOrdersBoard('ordersPlaced');
    this.totalDashboardPercentageCount();
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataStatusArray.filter = filterValue.trim().toLowerCase();
  // }

  private totalDashboardPercentageCount = (): void => {
    this.asyncService.start();
    this.totalDashboardPercentageCountSub = this.dashBoardService.Allorderstatus().subscribe(
      (data) => {
        if (data) {
          console.log(data, 'this is all orders status data')
             this.ordersPlaced1     =    data[0].value;
             this.detailsCollected1 =    data[1].value;
             this.orderConfirmed1   =    data[2].value;
             this.loadPoint1        =    data[3].value;
             this.inProgress1       =    data[4].value;
             this.unloadPoint1      =    data[5].value;
             this.consignmentDone1  =    data[6].value;
        console.log("rtd",data )
        }
        this.asyncService.finish();
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg(
          'Error! Percentage data is not loaded.'
        );
      }
    );
  }


  loadLeaseDataSub: Subscription;
  updateTruckStatusSub: Subscription;

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
        console.log(item, 'WANT TO SEE MY ITEMS STATUS');
      }
    });
  };

  loadOrdersBoard = (status): any => {
    console.log(status)
    let statusData;
    this.asyncService.start();
    this.ordersBoardSub = this.orderService.getTrips().subscribe(
      (data) => {
        if (data) {
          console.log(data, "print trips dataaaaaa");

          const reversedData = data.reverse().sort();
          if(status === 'ordersPlaced'){
            this.dataStatusArray1 = new MatTableDataSource(reversedData.filter((item) => item.status == status));
            this.dataStatusArray1.paginator = this.paginator1;
            this.dataStatusArray1.sort = this.sort1;
            document.getElementById('orderPlace').style.backgroundColor = '#1BBDB8' ; 
            document.getElementById('detailsCollected').style.backgroundColor = '' ; 
            document.getElementById('orderConfirmed').style.backgroundColor = '' ; 
            document.getElementById('loadPoint').style.backgroundColor = '' ; 
            document.getElementById('intransit').style.backgroundColor = '' ; 
            document.getElementById('unloadPoint').style.backgroundColor = '' ; 
            document.getElementById('tripComplited').style.backgroundColor = '' ; 
            this.totalDashboardPercentageCount()
          }
          if(status === 'detailsCollected'){
            this.dataStatusArray2 = new MatTableDataSource(reversedData.filter((item) => item.status == status));
            this.dataStatusArray2.paginator = this.paginator2;
            this.dataStatusArray2.sort = this.sort2;
            document.getElementById('orderPlace').style.backgroundColor = '' ; 
            document.getElementById('detailsCollected').style.backgroundColor = '#1BBDB8' ; 
            document.getElementById('orderConfirmed').style.backgroundColor = '' ; 
            document.getElementById('loadPoint').style.backgroundColor = '' ; 
            document.getElementById('intransit').style.backgroundColor = '' ; 
            document.getElementById('unloadPoint').style.backgroundColor = '' ; 
            document.getElementById('tripComplited').style.backgroundColor = '' ; 
            this.totalDashboardPercentageCount()
          }
          if(status === 'orderConfirmed'){
            this.dataStatusArray3 = new MatTableDataSource(reversedData.filter((item) => item.status == status));
            this.dataStatusArray3.paginator = this.paginator3;
            this.dataStatusArray3.sort = this.sort3;
            document.getElementById('orderPlace').style.backgroundColor = '' ; 
            document.getElementById('detailsCollected').style.backgroundColor = '' ; 
            document.getElementById('orderConfirmed').style.backgroundColor = '#1BBDB8' ; 
            document.getElementById('loadPoint').style.backgroundColor = '' ; 
            document.getElementById('intransit').style.backgroundColor = '' ; 
            document.getElementById('unloadPoint').style.backgroundColor = '' ; 
            document.getElementById('tripComplited').style.backgroundColor = '' ; 
            this.totalDashboardPercentageCount()
          }
          if(status === 'loadCompleted'){
            this.dataStatusArray4 = new MatTableDataSource(reversedData.filter((item) => item.status == status));
            this.dataStatusArray4.paginator = this.paginator4;
            this.dataStatusArray4.sort = this.sort4;
            document.getElementById('orderPlace').style.backgroundColor = '' ; 
            document.getElementById('detailsCollected').style.backgroundColor = '' ; 
            document.getElementById('orderConfirmed').style.backgroundColor = '' ; 
            document.getElementById('loadPoint').style.backgroundColor = '#1BBDB8' ; 
            document.getElementById('intransit').style.backgroundColor = '' ; 
            document.getElementById('unloadPoint').style.backgroundColor = '' ; 
            document.getElementById('tripComplited').style.backgroundColor = '' ; 
            this.totalDashboardPercentageCount()
          }
          if(status === 'inTransit'){
            this.dataStatusArray5 = new MatTableDataSource(reversedData.filter((item) => item.status == status));
            this.dataStatusArray5.paginator = this.paginator5;
            this.dataStatusArray5.sort = this.sort5;
            document.getElementById('orderPlace').style.backgroundColor = '' ; 
            document.getElementById('detailsCollected').style.backgroundColor = '' ; 
            document.getElementById('orderConfirmed').style.backgroundColor = '' ; 
            document.getElementById('loadPoint').style.backgroundColor = '' ; 
            document.getElementById('intransit').style.backgroundColor = '#1BBDB8' ; 
            document.getElementById('unloadPoint').style.backgroundColor = '' ; 
            document.getElementById('tripComplited').style.backgroundColor = '' ; 
            this.totalDashboardPercentageCount()
          }
          if(status === 'unloadComplete'){
            this.dataStatusArray6 = new MatTableDataSource(reversedData.filter((item) => item.status == status));
            this.dataStatusArray6.paginator = this.paginator6;
            this.dataStatusArray6.sort = this.sort6;
            document.getElementById('orderPlace').style.backgroundColor = '' ; 
            document.getElementById('detailsCollected').style.backgroundColor = '' ; 
            document.getElementById('orderConfirmed').style.backgroundColor = '' ; 
            document.getElementById('loadPoint').style.backgroundColor = '' ; 
            document.getElementById('intransit').style.backgroundColor = '' ; 
            document.getElementById('unloadPoint').style.backgroundColor = '#1BBDB8' ; 
            document.getElementById('tripComplited').style.backgroundColor = '' ;
            this.totalDashboardPercentageCount() 
          }
          if(status === 'consignmentDone'){
            this.dataStatusArray7 = new MatTableDataSource(reversedData.filter((item) => item.status == status));
            this.dataStatusArray7.paginator = this.paginator7;
            this.dataStatusArray7.sort = this.sort7;
            document.getElementById('orderPlace').style.backgroundColor = '' ; 
            document.getElementById('detailsCollected').style.backgroundColor = '' ; 
            document.getElementById('orderConfirmed').style.backgroundColor = '' ; 
            document.getElementById('loadPoint').style.backgroundColor = '' ; 
            document.getElementById('intransit').style.backgroundColor = '' ; 
            document.getElementById('unloadPoint').style.backgroundColor = '' ; 
            document.getElementById('tripComplited').style.backgroundColor = '#1BBDB8' ; 
            this.totalDashboardPercentageCount()
          }
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

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStatusArray1.filter = filterValue.trim().toLowerCase();
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStatusArray2.filter = filterValue.trim().toLowerCase();
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStatusArray3.filter = filterValue.trim().toLowerCase();
  }
  applyFilter4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStatusArray4.filter = filterValue.trim().toLowerCase();
  }
  applyFilter5(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStatusArray5.filter = filterValue.trim().toLowerCase();
  }
  applyFilter6(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStatusArray6.filter = filterValue.trim().toLowerCase();
  }
  applyFilter7(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStatusArray7.filter = filterValue.trim().toLowerCase();
  }

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


  openDialog(value, element) {
    if (value === 'orderPlaceView') {
      const dialogRef = this.dialog.open(OrderPlaceViewModalComponent, {
        width: '1200px',
        height: '60%',
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
    if (value === 'detailsCollectedView') {
      const dialogRef = this.dialog.open(DetailsCollectedViewModalComponent, {
        width: '1200px',
        height: '100%',
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
    if (value === 'orderConfirmedView') {
      const dialogRef = this.dialog.open(OrderConfirmedViewModalComponent, {
        width: '1200px',
        height: '90%',
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

  editOrder(value, element){
    let data = element
    if(value === 'edit'){
      this.router.navigate(['/orders/editOrder']);
      this.commonService.sendMessage(element)
    }
  }


  nextStepOrder(value, element) {
    console.log(element, 'THIS IS MY OBJECT TO SHOW');

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
      if(value== 'ordersPlaced'){
        this.loadOrdersBoard(this.dataStatusArray1)
      }
      else if (value === 'detailsCollected') {
        const dialogRef = this.dialog.open(DetailsCollectedModalComponent, {
          width: '100%',
          height: '100%',
          data: element,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log('helloooooooooo  detailsCollected poreeeeee ');
            this.loadOrdersBoard('ordersPlaced');

            // this.refreshPage();


          } else {
            console.log(result, 'The dialog was closed');
          }
        });

      } else if (value === 'orderConfirmed') {
        const dialogRef = this.dialog.open(NewOrderConfirmModifiedComponent, {
          width: '100%',
          height: '90%',
          data: element,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log(result, 'ki result pelam');

            this.loadOrdersBoard('detailsCollected');
             //this.refreshPage();
          }
        });
      } else if (value === 'loadCompleted') {
        const dialogRef = this.dialog.open(LoadCompleteModalComponent, {
          width: '100%',
          height: '90%',
          data: element,
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.loadOrdersBoard('orderConfirmed');
          if (result) {
            this.loadOrdersBoard('orderConfirmed');
             //this.refreshPage();
          }
        });

        //this.loadOrdersBoard('loadCompleted');
        //  this.refreshPage();
         //this.loadOrdersBoard('loadCompleted');

      } else if (value === 'inTransit') {
        console.log(value, 'I AM IN INTRANSIT');
        const dialogRef = this.dialog.open(NewTruckTaggingModalComponent, {
          width: '100%',
          height: '100%',
          data: element,
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.loadOrdersBoard('loadCompleted');
          if (result) {
            this.loadOrdersBoard('loadCompleted');

          }
        });



        // const dialogRef = this.dialog.open(InTransitModalComponent, {
        //   minWidth: '550px',
        //   data: element,
        // });
        // dialogRef.afterClosed().subscribe((result) => {
        //   this.loadOrdersBoard('inTransit');
        //   if (result) {
        //     this.loadOrdersBoard('inTransit');
        //   }
        // });




        //this.loadOrdersBoard('inTransit');
        // this.refreshPage();

        //this.loadOrdersBoard('inTransit');
      } else if (value === 'unloadComplete') {
        console.log(value, 'I AM IN UNLOADCOMPLETE');
        this.unloadComplete.push({
          pk: element.trip_id,
          created_date: element.created_date,
          created_at: element.created_at,
          order_id: element.order_id,
          sk: element.order_id,
          trip_id: element.trip_id,
          name: element.name,
          orientation: "trip",
          status: 'unloadComplete',
          trip_number: element.trip_number,
          bidding_time: element.bidding_time,
          bidding_date: element.bidding_date,
          previous_status: element.status,
          updated_by: element.updated_by,
          truck_details: element.truck_details,
          // driver_status: element.driver_status,
        });

        this.unloadSub = this.orderService
          .updateStatus(this.unloadComplete)
          .subscribe((data) => {
            if (data) {
              this.commonService.showSuccessMsg('Board Updated!!!');
              this.loadOrdersBoard('inTransit');
                  //  this.refreshPage();
            }
          });

        //this.loadOrdersBoard('inTransit');
        //  this.refreshPage();
      } else if (value === 'consignmentDone') {
        console.log('I am in consignment');
        const dialogRef = this.dialog.open(UnloadCompleteModalComponent, {
          width: '100%',
          height: '90%',
          data: element,
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.loadOrdersBoard('unloadComplete');
          if (result) {
            this.loadOrdersBoard('unloadComplete');
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

  refreshPage(){
    window.location.reload();
   }

   allTrips(): void {
    const dialogRef = this.dialog.open(TripUnsuccessfullComponent, {
      width: '100%',
      height: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  customerAdd(): void {
    // const dialogRef = this.dialog.open(CustomerAddModalComponent, {
    //   width: '730px',
    //   height: '450px',
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    // });
    this.router.navigate(['/orders/newCustomer/list']);
  }
  vendorAdd(): void {
    // const dialogRef = this.dialog.open(VendorAddModalComponent, {
    //   width: '735px',
    //   height: '450px',
    //   backdropClass: 'gk',
    //   // data: {name: this.name, animal: this.animal}
    // });

    // dialogRef.afterClosed().subscribe((result) => {});

    this.router.navigate(['/orders/partner/list']);
  }
  poductAdd(): void {
    const dialogRef = this.dialog.open(ProductAddModalComponent, {
      width: '500px',
      height: '300px',
      backdropClass: 'gk',
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
    // const dialogRef = this.dialog.open(TruckAddModalComponent, {
    //   width: '730px',
    //   height: '485px',
    // });
    // dialogRef.afterClosed().subscribe((result) => {});
    this.router.navigate(['/orders/newTruck/list']);
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
    // const dialogRef = this.dialog.open(DriverAddComponent, {
    //   width: '730px',
    //   height: '325px',
    // });
    // dialogRef.afterClosed().subscribe((result) => {});

    this.router.navigate(['/orders/driver/list']);
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

  // challan(id) {
  //   const dialogRef = this.dialog.open(ChallanComponent, {
  //     width: '500px',
  //     data: {
  //       order_id: id,
  //     },
  //   });
  // }
  openTheChallanModal(id) {
    // const dialogRef = this.dialog.open(ChallanModalComponent, {
    //   width: '500px',
    //   data: {
    //     order_id: id,
    //   },
    // });
    // const dialogRef = this.dialog.open(ProductTruckSuccessfullModalComponent, {
    //   width: '1200px',
    //   height: '600px',
    //   data: id,
    // });
    const dialogRef = this.dialog.open(TripChallanModalComponent, {
      width: '600px',
      height: '600px',
      data: id,
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
function OrdePlaceViewModalComponent(OrdePlaceViewModalComponent: any, arg1: { width: string; height: string; data: any; }) {
  throw new Error('Function not implemented.');
}

