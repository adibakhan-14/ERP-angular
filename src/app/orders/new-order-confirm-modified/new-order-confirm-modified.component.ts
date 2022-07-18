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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DriverService } from '../add-driver/driver.service';


@Component({
  selector: 'app-new-order-confirm-modified',
  templateUrl: './new-order-confirm-modified.component.html',
  styleUrls: ['./new-order-confirm-modified.component.scss']
})
export class NewOrderConfirmModifiedComponent implements OnInit {
  myForm: FormGroup;
  driverSubscription: Subscription;
  vendorSubscription: Subscription;
  truckSubscription: Subscription;
  driverData: any;
  vendorData: any;
  truckData: any;
  filteredTruckData: any=[];
  filteredDriverData: any =[];
  filteredDataForTruckUpdate: any;
  filteredDataForDriverUpdate: any;
  updateMapData:any= [];
  orderConfirmedSub: Subscription;
  tripSub: Subscription;
  filteredDataForVendorUpdate: any;
  detailsCollectedSub: Subscription;
  SourceDataVendor: any;
  SourceDataTruck: any;
  SourceDataDriver: any;

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<NewOrderConfirmModifiedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      partner: ['',Validators.required],
      partnerFare: ['',[Validators.required,Validators.pattern("^[0-9]*$")]],
      truck_id: ['',Validators.required],
      driver_id: ['',Validators.required],
    })
    this.driverSubscription = this.driverService.getDriverList().subscribe(
      (data) => {
        if (data) {
          this.driverData = data;
          this.driverData.sort(this.GetSortOrder("name"))
          console.log(this.driverData, 'Here is my driver data')
          this.driverData.map((driver)=>{
            if(driver.status === "returned"){
              this.filteredDriverData.push(driver)
            }
          })
          this.SourceDataDriver = this.filteredDriverData;
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
          this.SourceDataVendor = data;
          this.vendorData.sort(this.GetSortOrder("vendor_name"))
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
    this.truckSubscription = this.orderService.otherTruck().subscribe(
      (data) => {
        if (data) {
          this.truckData = data;
          this.truckData.sort(this.GetSortOrder("truck_reg"))
          this.truckData.map((truck)=>{
            // if(truck.status === "returned" && truck.type === this.data.truck_details['truck_type']){
            if(truck.status === "returned"){
              this.filteredTruckData.push(truck)
            }
          })
          this.SourceDataTruck = this.filteredTruckData;
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! truck could not found');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! truck could not found');
      }
    )
    console.log(this.data)
  }


  onSearchPartner(value) {
    this.SourceDataVendor = this.findPartner(value);
  }

  findPartner(value: string) {
    const filter = value.toLowerCase();
    // if (value !== '' && value.startsWith("0")) {
    //   this.SourceDataVendor = this.vendorData;
    //   return this.SourceDataVendor.filter((option) =>
    //     option.vendor_id.toLowerCase().includes(filter)
    //   );
    // }else 
    if (value !== '') {
      this.SourceDataVendor = this.vendorData;
      return this.SourceDataVendor.filter((option) =>
        //option.vendor_name.toLowerCase().includes(filter)
        option.vendor_name.concat(option.vendor_id).toLowerCase().includes(filter)
      );
    } else {
      return this.vendorData;
    }
  }


  onSearchTruck(value) {
    this.SourceDataTruck = this.findTruck(value);
  }

  findTruck(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      this.SourceDataTruck = this.filteredTruckData;
      return this.SourceDataTruck.filter((option) =>
        option.truck_id.replace(/\s/g, '').toLowerCase().includes(filter.replace(/\s/g, ''))
      );
    }else {
      return this.filteredTruckData;
    }
  }

  onSearchDriver(value) {
    this.SourceDataDriver = this.findDriver(value);
  }

  findDriver(value: string) {
    const filter = value.toLowerCase();
    if (value !== '' && value.startsWith("0")) {
      this.SourceDataDriver = this.filteredDriverData;
      return this.SourceDataDriver.filter((option) =>
        option.driver_id.toLowerCase().includes(filter)
      );
    }else if (value !== '') {
      this.SourceDataDriver = this.filteredDriverData;
      return this.SourceDataDriver.filter((option) =>
        option.name.concat(option.driver_id).toLowerCase().includes(filter)
      );
    } else {
      return this.filteredDriverData;
    }
  }



  GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop].toLowerCase() > b[prop].toLowerCase()) {
            return 1;
        } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {
            return -1;
        }
        return 0;
    }
}


  onSubmit(){

    this.vendorData.map(data=>{
      if(data.vendor_id === this.myForm.value.partner){
        this.filteredDataForVendorUpdate = data
      }
    })
    console.log(this.filteredDataForVendorUpdate, "this is the selected vendor data")
    // console.log( this.filteredDataForVendorUpdate, "VENDORRRRRRRRRRR");


    this.filteredTruckData.map(data=>{
      if(data.truck_id === this.myForm.value.truck_id){
        this.filteredDataForTruckUpdate = data
      }
    })
    const truckObject= {
      trip_id:this.data['trip_id'],
      pk:this.filteredDataForTruckUpdate.truck_id,
      order_id: this.data.order_id,
      sk:this.filteredDataForTruckUpdate.truck_reg,
      truck_reg: this.filteredDataForTruckUpdate.truck_reg,
      status: 'rented',
      type : this.filteredDataForTruckUpdate.type,
      truck_details: this.data.truck_details,
      updated_by: this.data.updated_by,
      previous_status: this.filteredDataForTruckUpdate.status,
      prev_rent_status: this.filteredDataForTruckUpdate.status,
      orientation: this.filteredDataForTruckUpdate.orientation
    }

    this.filteredDriverData.map(data=>{
      if(data.driver_id === this.myForm.value.driver_id ){
        this.filteredDataForDriverUpdate = data
      }
    })
    const driverObject = {
      trip_id:this.data['trip_id'],
      pk: this.filteredDataForDriverUpdate.driver_id,
      sk: this.filteredDataForDriverUpdate.phone,
      status: 'rented',
      previous_status: this.filteredDataForDriverUpdate.status,
      prev_rent_status: this.filteredDataForDriverUpdate.status,
      updated_by: this.data.updated_by,
      order_id: this.data.order_id,
      truck_details: this.data.truck_details,
      name: this.filteredDataForDriverUpdate.name,
      orientation: this.filteredDataForDriverUpdate.orientation

    };




    const tripObject= {
      pk: this.data['trip_id'],
      created_date: this.data.created_date,
      created_at: this.data.created_at,
      order_id: this.data.order_id,
      sk: this.data.order_id,
      trip_id: this.data['trip_id'],
      name: this.data.name,
      orientation: "trip",
      previous_status: this.data.status,
      status: 'orderConfirmed',
      trip_number: this.data.trip_number,
      bidding_time: this.data.bidding_time,
      bidding_date: this.data.bidding_date,
      updated_by: this.data.updated_by,
      truck_details: this.data.truck_details,

    }

    this.updateMapData=[{...truckObject}, {...driverObject}];

    console.log(this.updateMapData, "MAPDATA IS DRIVER OBJECT GETTING INSIDE?????");

    const truck_details = {
      loading_points : this.myForm.value['arr'],
      unloading_points : this.myForm.value['unloadArr'],
      truck_fare: this.myForm.value['truckFare'],
      truck_length : this.myForm.value['truckLength'],
      truck_type : this.myForm.value['truckType'],
      products: [],
      vendor_name: '',
      vendor_phone: '',
      driver_phone: '',
      driver_name: '',
      truck_reg: '',
  }
  Object.assign(this.data.truck_details, {driver_name: this.filteredDataForDriverUpdate.name, driver_phone:this.filteredDataForDriverUpdate.phone, driver_id:this.filteredDataForDriverUpdate.driver_id, vendor_name: this.filteredDataForVendorUpdate.vendor_name, vendor_phone: this.filteredDataForVendorUpdate.phone, vendor_fare: this.myForm.value.partnerFare, vendor_id: this.filteredDataForVendorUpdate.vendor_id, truck_reg: this.filteredDataForTruckUpdate.truck_reg});

  this.data.status = 'orderConfirmed';
  this.data.previous_status= 'detailsCollected'


  console.log(this.data, "am i getting enlisted data");



    this.detailsCollectedSub = this.orderService
    .updateCollectedOrder(this.data)
    .subscribe(
      (isAdded) => {
        if (isAdded) {
          this.orderConfirmedSub= this.orderService.updateStatus(this.updateMapData).subscribe((data)=>{
            if (data) {
              this.asyncService.finish();
              this.commonService.showSuccessMsg('Board Updated!!!');
              this.close();
            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('Error! Not Updated!!');
            }
          })
          this.commonService.showSuccessMsg(
            'Success! The order has beed created!'
          );
          console.log('hello i am loadorderBoard');
          this.asyncService.finish();
          this.close();
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! The order is not created!');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg(
          'Error! The customer information is not added!'
        );
      }
    );



  }
  close = (): void => {
    this.dialogRef.close(true);
  };

}
