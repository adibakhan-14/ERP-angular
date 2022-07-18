import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';

import { AsyncService } from 'src/app/shared/services/async.service';
import * as moment from 'moment';
import { IfStmt } from '@angular/compiler';
import { DriverService } from '../add-driver/driver.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-unload-complete-modal',
  templateUrl: './unload-complete-modal.component.html',
  styleUrls: ['./unload-complete-modal.component.scss'],
})
export class UnloadCompleteModalComponent implements OnInit {
  myForm: FormGroup;
  arr: FormArray;
  unloadSub: Subscription;
  unloadConfirmSub: Subscription;
  unloadComplete = [];
  truckSub: Subscription;
  productSub: Subscription;
  driverSub: Subscription;
  consignmentDoneSub: Subscription;
  truckData = [];
  leaseData = [];
  driverData = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    public dialog: MatDialog,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<UnloadCompleteModalComponent>,
    public driverService: DriverService,
    public asyncService: AsyncService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {
    console.log(this.data.truck_details.unloading_points)
    this.myForm = this.fb.group({
      arr: this.fb.array([this.unloadProductItem()]),
    })
    if (this.data.truck_details.unloading_points.length){
      this.myForm = this.setUpForm(this.data.truck_details.unloading_points);
      this.myForm.patchValue(this.data.truck_details.unloading_points)
    }

    this.driverSub = this.orderService.getDriverList().subscribe(
      (data) => {
        if (data) {
          this.driverData = data;
          console.log(this.driverData, 'this.driverDatathis.driverData');

          this.truckSub = this.orderService.ownTruck().subscribe((data) => {
            this.truckData = data;
            console.log(
              this.truckData,
              'this.truckDatathis.truckDatathis.truckData'
            );
          });
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg(
            'Error! getDriverList could not found'
          );
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! getDriverList could not found');
      }
    );
  }

  setUpForm(items: any[]){
    return new FormGroup({
      arr: new FormArray(items.map((item) => this.unloadProductItem2(item)))
    });
  }
  unloadProductItem2(item){
    return this.fb.group({
      unloadingDistrict: [item.unloadingDistrict, Validators.required],
      unloadingPoint: [item.unloadingPoint, Validators.required],
      unloadingPerson: [item.unloadingPerson, Validators.required],
      unloadpersonContact: [item.unloadpersonContact, Validators.required],
      actualUnloadingDate: ['', Validators.required],
      actualUnloadingTime: ['', Validators.required],
    })
  }
  unloadProductItem(){
    return this.fb.group({
      unloadingDistrict: ['', Validators.required],
      unloadingPoint: ['', Validators.required],
      unloadingPerson: ['', Validators.required],
      unloadpersonContact: ['', Validators.required],
      actualUnloadingDate: ['', Validators.required],
      actualUnloadingTime: ['', Validators.required],
    })
  }

  checkSubmit() {
    console.log(this.myForm.value, 'here it is my form data')
  }

  onClick() {

    // Object.assign(this.data.truck_details, { unloadingInfo: this.myForm.value});
    this.data.truck_details.unloading_points.map((data,index)=>{
      Object.assign(this.data.truck_details.unloading_points[index], { actualUnloadingDate: this.myForm.value.arr[index].actualUnloadingDate });
      Object.assign(this.data.truck_details.unloading_points[index], { actualUnloadingTime: this.myForm.value.arr[index].actualUnloadingTime});
    })

    if((this.truckData && this.driverData)!= []){
      console.log('hello');
      let nameKey = this.data.trip_id;

      console.log(nameKey, 'AM I GETTING THE ORDER KEY');

      let driverArr = [];
      function searchDriverRented(nameKey, array1) {
        for (var i = 0; i < array1.length; i++) {
          if (array1[i].trip_id === nameKey) {
            driverArr.push(array1[i]);
          }
        }
        return driverArr;
      }

      var resultDriverObject = searchDriverRented(nameKey, this.driverData);
      console.log(
        resultDriverObject,
        'resultDriverObjectresultDriverObjectresultDriverObjectresultDriverObject'
      );

      resultDriverObject.forEach((element) => {
        element.status = 'returned';
        element.previous_status = 'rented';
        element.prev_rent_status = 'rented';
      });
      //  var driverObject = {
      //   pk: resultDriverObject.driver_id,
      //   sk: resultDriverObject.license_number,
      //   status: "returned" ,
      //   previous_status: resultDriverObject.status,
      //   prev_rent_status: 'rented',
      //   updated_by: this.data.updated_by,
      //   order_id: this.data.order_id,
      //   truck_details: this.data.truck_details,
      // };

      //this.driverData.splice(i, 1, this.driverObject);

      console.log(
        resultDriverObject,
        'driverObjectdriverObjectdriverObject ADIBAAAAAAAAAAAAAAAAAA'
      );

      let truckArr = [];

      function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i].trip_id === nameKey) {
            truckArr.push(myArray[i]);
          }
        }
        return truckArr;
      }
      var resultObject = search(nameKey, this.truckData);
      console.log(
        resultObject,
        'resultObjectresultObjectresultObjectresultObject'
      );

      //need to change this code for betterment
      resultObject.forEach((element) => {
        element.status = 'returned';
        element.previous_status = 'rented';
        element.prev_rent_status = 'rented';
      });

      console.log(resultObject, 'DID THE STATUS CHANGED?????');

      // let truckDataArr= [];
      // truckDataArr.push(truckObject)

      // console.log(truckDataArr, "truckObjecttruckObject");

      let mapData = [];
      resultDriverObject.forEach((element) => {
        mapData.push(element);
      });

      Array.prototype.push.apply(mapData, resultObject);

      console.log(mapData, 'KI OBOSTHA DEKHIIIII');

      // mapData.push(driverObject,truckObject);
      mapData.push({
        previous_status: this.data.status,
        //  sk: this.data.customer_id,
        status: 'consignmentDone',
        updated_by: this.data.updated_by,
        trip_id: this.data.trip_id,
        truck_details: this.data.truck_details,
        pk: this.data.trip_id,
        created_date: this.data.created_date,
        created_at: this.data.created_at,
        order_id: this.data.order_id,
        sk: this.data.order_id,
        name: this.data.name,
        orientation: 'trip',
        trip_number: this.data.trip_number,
        bidding_time: this.data.bidding_time,
        bidding_date: this.data.bidding_date,
      });


      this.consignmentDoneSub = this.orderService.updateCollectedOrder(this.data).subscribe((data) => {
        if (data) {
          this.orderService.updateStatus(mapData).subscribe(
            (data) => {
              if (data) {
                // this.orderService.sendSms(sendSMS,"orderConfirmed")

                this.asyncService.finish();
                this.commonService.showSuccessMsg('Board Updated!!!');

              } else {
                this.asyncService.finish();
                this.commonService.showErrorMsg('Error! Not Updated!!');
              }
            })
            this.close();

          }

      })

      console.log(mapData, 'Mapdata pacchi');


    }else{
      console.log("data not found");


    }


  }
  close = (): void => {
    this.dialogRef.close(true);
  };

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
    if (this.driverSub) {
      this.driverSub.unsubscribe();
    }
    if (this.truckSub) {
      this.truckSub.unsubscribe();
    }
    if (this.consignmentDoneSub) {
      this.consignmentDoneSub.unsubscribe();
    }

    this.asyncService.finish();
  }
}
