
import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { TruckList } from '../models/truck.model';
import { OrdersBoardItem, TruckType } from '../models/orders-board-item.model';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

import { Vendor } from 'src/app/customer/models/vendor.model';
import { items } from 'fusioncharts';
import { LOG_TYPE } from '@aws-amplify/core/lib-esm/Logger';

import { Driver } from '../add-driver/driver.model';
import { DriverService } from '../add-driver/driver.service';
@Component({
  selector: 'app-order-confirm-modified',
  templateUrl: './order-confirm-modified.component.html',
  styleUrls: ['./order-confirm-modified.component.scss'],
})
export class OrderConfirmModifiedComponent implements OnInit {
  formId = 'detailsCollectedFrom';
  form: FormGroup;
  orderConfirmedSub: Subscription;
  orderLeaseSub: Subscription;
  remainingTruckNumberCountSub: Subscription;
  orderConfirmedSub2: Subscription;
  requiredTruckCountPredefine: number;
  submitFlag: boolean;
  requiredTruckCount: number;
  count: number;
  truckTypes = [];
  truckDestination=[];
  truckProvide = [];
  truckFilter = [];
  driver = [];
  vendor=[];
  truckData: TruckList[] = [];
  driverData = [];
  driverReturnedData=[];
  vendorData= [];
  typeOfTrucks=[];
  notAssignedTruck = [];
  truckFilterPredefine = [];
  selectedItemsList = [];
  leaseData = [];
  combineTruck = [];
  combinedTruckDriver=[];
  drivers = [];
  leaseObject;
  truckObject;
  driverObject;
  loadDestination=[];
  unloadDestination=[];
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  o1: number;
  o2: number;
  o3: number;
  o4: number;
  o5: number;
  o6: number;
  c1Quantity: number;
  c2Quantity: number;
  c3Quantity: number;
  c4Quantity: number;
  c5Quantity: number;
  o1Quantity: number;
  o2Quantity: number;
  o3Quantity: number;
  o4Quantity: number;
  o5Quantity: number;
  o6Quantity: number;
  deleteOrderSub: Subscription;
  updateLeaseSub: Subscription;
  loadCustomerSub: Subscription;
  vendorSubscription: Subscription;
  remainingTruckCount: number;
  requiredTruckCountValue: number;
  isOrderConfirmFirst: boolean = false;
  remainingTruckNumberCountFromApi: number;
  filteredStates: Observable<TruckList[]>;
  driverfilteredStates: Observable<Driver[]>;
  vendorfilteredStates: Observable<any[]>;

  customerControl = new FormControl();
  driverControl = new FormControl();
  vendorControl = new FormControl();
  vendor_fare= new FormControl();

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderConfirmModifiedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) { }

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'Truck Type',
    'Truck length',
    'Truck weight',
    'Quantity',
  ];

  ngOnInit(): void {

    console.log(this.data.truck_details,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    this.truckTypes.forEach(x=>{
      this.loadDestination.push(x.destination[0].loadingPoint[0]);
    });

    this.truckTypes.forEach(x=>{
      this.unloadDestination.push(x.destination[1].unloadingPoint[0]);
    });


    this.loadCustomerSub = this.driverService.getDriverList().subscribe(
      (data) => {
        if (data) {
          this.driverData = data;
          console.log(this.driverData, "this.driverDatathis.driverData");

        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! getDriverList could not found');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! getDriverList could not found');
      }
    );

    this.vendorSubscription = this.orderService.getVendorList().subscribe(
      (data) => {
        if (data) {
          this.vendorData = data;
          console.log(this.vendorData, "GETTING VENDOR DATA");

        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! VENDOR could not found');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! VENDOR could not found');
      }
    )




    this.c1 = 0;
    this.c2 = 0;
    this.c3 = 0;
    this.c4 = 0;
    this.c5 = 0;
    this.o1 = 0;
    this.o2 = 0;
    this.o3 = 0;
    this.o4 = 0;
    this.o5 = 0;
    this.o6 = 0;
    this.c1Quantity = 0;
    this.c2Quantity = 0;
    this.c3Quantity = 0;
    this.c4Quantity = 0;
    this.c5Quantity = 0;
    this.count = 0;
    this.requiredTruckCountPredefine = 0;
    this.remainingTruckCount = 0;
    let ownTruck = this.orderService.ownTruck();
    let otherTruck = this.orderService.otherTruck();
    //order er truck type duktese
    this.truckTypes= this.data.truck_details;
    this.truckTypes.forEach(x=>{
      this.typeOfTrucks.push(x.truck_type)

    });
    console.log(this.typeOfTrucks, "this.typeOfTrucksthis.typeOfTrucks");

    this.truckTypes.forEach(x=>{
      this.truckDestination.push( );
    });

    console.log(this.truckDestination, "this.truckDestinationthis.truckDestination");








    this.form = this.fb.group({
      truck_registration: [''],
    });

    this.remainingTruckNumberCountSub = this.orderService
      .getLease(this.data.order_id)
      .subscribe((value) => {
        if (value.length === 0) {
          this.isOrderConfirmFirst = true;
        } else {
          this.remainingTruckNumberCountFromApi =
            value[0].remaining_truck_count;
          console.log(
            '============ this.remainingTruckNumberCountFromApi==========',
            this.remainingTruckNumberCountFromApi
          );
        }
      });


    this.orderService.otherTruck().subscribe((results) => {
      this.truckData = results;
      this.filteredStates = this.customerControl.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
        map((state) =>
          state ? this._filterStates(state) : this.truckData.slice()
        )
      );




      this.driverReturnedData= this.driverData.filter(e => e.status ==='returned').map(e => e);









      this.driverfilteredStates = this.driverControl.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
        map((state) =>
          state ? this._driverfilterStates(state) : this.driverReturnedData.slice()
        )
      );



      this.vendorfilteredStates = this.vendorControl.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
        map((state) =>
          state ? this._vendorfilterStates(state) : this.vendorData.slice()
        )
      );
      console.log(this.vendorData, "this.vendorDatathis.vendorData");



      if (this.truckData.length === 0) {
        this.asyncService.finish();
      }
    });

    this.dataLengthCount()

  }

      ///////////////////////////////////////////////////
      tableForm: FormArray = this.fb.array([]);
      addRow() {
        const row = this.fb.group({
          vendorControl: ["", [Validators.required]],
          vendor_fare: ["", [Validators.required]],
          customerControl: ["", [Validators.required]],
          driverControl: ["", [Validators.required]],
        });
        this.tableForm.push(row);
      }
      get groups(): FormGroup[] {
        return this.tableForm.controls as FormGroup[]
      }

      dataLengthCount(){
        for (let variable in this.data.truck_details) {
          this.addRow()
        }
      }
    /////////////////////////////////////////////////////


  get truck_registration() {
    return this.form.get('truck_registration');
  }
  private _filterStates(value: string): TruckList[] {
    const filterValue = value.toLowerCase();
    return this.truckData.filter(
      (state) =>

        state.truck_reg.toLowerCase().indexOf(filterValue) > -1 ||
        state.trip_id.toLowerCase().indexOf(filterValue) > -1,

        this.removeSelectedTruck()

    );

  }

  private _driverfilterStates(value: string): Driver[] {
    const filterValue = value.toLowerCase();
    return this.driverReturnedData.filter(
      (state) =>
        state.name.toLowerCase().indexOf(filterValue) > -1 ||
        state.driver_id.toLowerCase().indexOf(filterValue) > -1,
        this.removeSelectedDriver()
    );
  }

  removeSelectedTruck(){
    console.log(this.customerControl.value, "this is the value");
    var val= this.customerControl.value;

    console.log(this.truckData, "truckdatathis.truckDatathis.truckData");

    const indexOfObject = this.truckData.findIndex(object => {
      return object.trip_id === val;
    });

    if (indexOfObject !== -1) {
      this.truckData.splice(indexOfObject, 1);
    }

  }

  removeSelectedDriver(){
    console.log(this.driverControl.value, "Driver Control valueeeeeeeee  ");
    var value= this.driverControl.value;
    const indexOfDriver= this.driverReturnedData.findIndex(o=>{
      return o.driver_id===value;


    });
    if(indexOfDriver!== -1){
      this.driverReturnedData.splice(indexOfDriver, 1);
    }

  }



  private _vendorfilterStates(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendorData.filter(
      (state) =>
        state.vendor_name.toLowerCase().indexOf(filterValue) > -1 ||
        state.vendor_id.toLowerCase().indexOf(filterValue) > -1
    );
  }

  onSelectVendor(id, item, i){
    const vendor = this.vendorData.find((items)=> items.vendor_id === id);

    const vendorWithIndex = {
      vendor: vendor,
      index: i,
    };
    console.log(vendor, "HERE IS MY VENDOR");


    delete vendorWithIndex.vendor.pk;
    delete vendorWithIndex.vendor.sk;

    this.vendor.splice(i, 1, vendorWithIndex);



  }
  // addPartnerFare(item, i) {
  //   item['vendor_fare'] = this.vendor_fare.value;
  //   // item['vendorControl']= this.vendorControl.value
  //   this.leaseData.push(item);
  // }




  onSelectDriver(id, item, i) {
    const driver = this.driverReturnedData.find((items) => items.driver_id === id);
    const driverWithIndex = {
      driver: driver,
      index: i,
    };
    console.log(driver, "driverdriverdriverdriverdriver");


    delete driverWithIndex.driver.pk;
    delete driverWithIndex.driver.sk;



     this.driverObject = {
      pk: driver.driver_id,
      sk: driver.license_number,
      status: driver.orientation === 'own' ? 'notAvailable' : 'rented',
      previous_status: "returned",
      prev_rent_status: driver.orientation === 'own' ? 'available' : 'returned',
      updated_by: this.data.updated_by,
      order_id: this.data.order_id,
      truck_details: this.data.truck_details,
      name: driver.name,

    };
    this.driver.splice(i, 1, this.driverObject);



  }

  onSelectCustomer(id, item, i) {

    console.log('DRIVER DATA', this.driver);



    const truck = this.truckData.find((item) => item.trip_id === id);

    this.truckObject= {
      pk:truck.trip_id,
      order_id: this.data.order_id,
      sk:truck.truck_reg,
      truck_reg: truck.truck_reg,
      status: truck.orientation === 'own' ? 'notAvailable' : 'rented',
      type : truck.type,
      truck_details: this.data.truck_details,
      updated_by: this.data.updated_by,
      previous_status: truck.status,
      prev_rent_status: truck.orientation === 'own' ? 'available' : 'returned',
    }



    console.log('========truck=========', truck);
    this.leaseObject = {
      pk: truck.trip_id,
      sk: truck.truck_reg,
      // sk: truck.vendor_id,
      truck_reg: truck.truck_reg,
      status: truck.orientation === 'own' ? 'notAvailable' : 'rented',
      previous_status: truck.status,
      prev_rent_status: truck.orientation === 'own' ? 'available' : 'returned',
      updated_by: this.data.updated_by,
      order_id: this.data.order_id,
      truck_details: this.data.truck_details,
      trip_id: truck.trip_id,
      orientation: truck.orientation,

      rent_time: moment(Date.now()).format(),
      round_trip: 'no',
    };


    item.status = this.leaseObject.status;
    item.order_id = this.data.order_id;
    item.trip_id = truck.trip_id;
    item.truck_reg = truck.truck_reg;

    this.leaseData.splice(i, 1, this.leaseObject);

    console.log('=======leaseObject========', this.leaseData);
    this.notAssignedTruck.splice(0, this.notAssignedTruck.length);
    this.data.truck_details.forEach((element) => {
      if (!('truck_reg' in element && 'trip_id' in element)) {
        this.notAssignedTruck.push(element);
      }
    });
    console.log('==notAssignedTruck==', this.notAssignedTruck);
  }

  onSubmit() {

// const vendor_id= this.vendorControl.value;
// const vendor_fare= this.vendor_fare.value;

// const vendor_name = this.vendorData.find((items, id)=> items.vendor_id === id);


// this.leaseData.forEach(element => {
//   element.vendor_id= vendor_id;
//   element.vendor_fare= vendor_fare;
// });

this.leaseData.map((element, index)=>{
  element.vendor_id= this.tableForm.controls[index].value.vendorControl
  element.vendor_fare= this.tableForm.controls[index].value.vendor_fare
  element.driver_id= this.tableForm.controls[index].value.driverControl
})

  console.log(this.leaseData, "I AM GETTING LEASE DATA");

    this.submitFlag = true;
    this.requiredTruckCount = 0;
    this.typeOfTrucks.forEach((item) => {
      this.requiredTruckCount += parseInt(item.quantity);
      const data = this.truckProvide.filter(
        (i) =>
          i.length === item.length &&
          i.type === item.type &&
          i.weight === item.weight
      );
    });
    // end validation logic
    for (let i = 0; i < this.leaseData.length; i++) {
      for (let j = 0; j < this.leaseData.length; j++) {
        if (i !== j) {
          if (this.leaseData[i].truck_reg === this.leaseData[j].truck_reg) {

            this.leaseData[i].round_trip = 'yes';
            break;
          }
        }
      }
    }


    this.combineTruck = [...this.notAssignedTruck, ...this.leaseData];

    this.combinedTruckDriver= this.combineTruck.map((item, i) => Object.assign({}, item, this.driver[i]));


    // console.log("==notAssignedTruck==",this.notAssignedTruck);


    //   if (this.submitFlag && this.requiredTruckCount === this.leaseData.length) {
    if (this.submitFlag) {
      this.asyncService.start();

      const leaseObj = {
        order_id: this.data.order_id,
        orientation: 'lease',
        information: this.combinedTruckDriver,
      };



    // const leaseObject= {
    //     order_id: this.data.order_id,
    //     orientation: 'lease',
    //     information:[{...leaseObj.information[0], ...this.driver}]
    //   };

      console.log(leaseObj, "FINAL LEASE OBJECT");

      let mapData=[];

  //  mapData.push(this.driver, this.combineTruck);

   this.driver.forEach(element => {
    mapData.push(element)
  });
  Array.prototype.push.apply(mapData, this.combineTruck);



   mapData.push({
    pk: this.data.order_id,
    sk: this.data.customer_id,
    name:this.data.name,
    status: 'orderConfirmed',
    previous_status: this.data.status,
    updated_by: this.data.updated_by,
    order_id: this.data.order_id,
    prev_rent_status: 'n/a',
    truck_details: this.data.truck_details,
    round_trip: ' ',

  });
  console.log(mapData, "ULTIMATE MAPDATAAAAAAA");
   this.orderLeaseSub = this.orderService.addlease(leaseObj).subscribe(
      (data) => {
        if (data) {
          mapData.push({
            pk: this.data.order_id,
            sk: this.data.customer_id,
            status: 'orderConfirmed',
            previous_status: this.data.status,
            updated_by: this.data.updated_by,
            order_id: this.data.order_id,
            prev_rent_status: 'n/a',
            truck_details: this.data.truck_details,
            round_trip: ' ',

          });


    }
  });
console.log(mapData, "dekhi MAPDATA THIK MOTON PORSE KINA EITAI UPDATEEEEEEEEEEE HOBEEEEE");


           this.orderConfirmedSub = this.orderService
              .updateStatus(mapData)
              .subscribe(
                (data) => {
                  if (data) {

                    // this.orderService.sendSms(sendSMS,"orderConfirmed")

                    this.asyncService.finish();
                    this.commonService.showSuccessMsg('Board Updated!!!');
                    this.close();
                  } else {
                    this.asyncService.finish();
                    this.commonService.showErrorMsg('Error! Not Updated!!');
                  }
                },



        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Lease not created!!');
        }
      );

    }

  }

  close = (): void => {
    this.dialogRef.close(true);
  };

  ngOnDestroy(): void {
    if (this.orderLeaseSub) {
      this.orderLeaseSub.unsubscribe();
    }
    if (this.orderConfirmedSub) {
      this.orderConfirmedSub.unsubscribe();
    }
    if (this.orderConfirmedSub2) {
      this.orderConfirmedSub2.unsubscribe();
    }
    if (this.deleteOrderSub) {
      this.deleteOrderSub.unsubscribe();
    }
    this.asyncService.finish();
  }
    }

