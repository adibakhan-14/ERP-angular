import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common.service';

import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { ProductAddModalComponent } from '../product-add-modal/product-add-modal.component';
import { AsyncService } from 'src/app/shared/services/async.service';

import { OrderService } from '../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-load-complete-modal',
  templateUrl: './load-complete-modal.component.html',
  styleUrls: ['./load-complete-modal.component.scss']
})
export class LoadCompleteModalComponent implements OnInit {
  myForm: FormGroup;
  arr: FormArray;
  myFormTwo: FormGroup;
  arrTwo: FormArray;

  loadSub: Subscription;
  loadConfirmSub: Subscription;
  loadComplete=[];

  displayedColumns: string[] = [

    'pk',
    'truck_reg',
    // 'name',
    // 'phone',
    // 'rent_time',
    'load_district',
    'loading_point',
    'loading_person',
    'loading_person_no',
    'loading_date',
    // 'Action',
  ];

  productSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private fbTwo: FormBuilder,
    private orderService: OrderService,
    public dialog: MatDialog,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<LoadCompleteModalComponent>,


    @Inject(MAT_DIALOG_DATA) public data: any

  ) {}
  dataSource = new MatTableDataSource<any>()




  ngOnInit(): void {

    this.myFormTwo = this.fbTwo.group({
      arrTwo: this.fbTwo.array([this.loadingItem()]),
    })
    if (this.data.truck_details.loading_points){
      this.myFormTwo = this.setUpFormTwo(this.data.truck_details.loading_points);
      this.myFormTwo.patchValue(this.data.truck_details.loading_points)
    }
    console.log('Hello')

    this.myForm = this.fb.group({
      arr: this.fb.array([this.createProductItem()]),
    })
    if (this.data.truck_details.unloading_points){
      this.myForm = this.setUpForm(this.data.truck_details.unloading_points);
      this.myForm.patchValue(this.data.truck_details.unloading_points)
    }
    console.log('Hello')


   this.productSub=this.orderService.getLease(this.data.order_id).subscribe((data)=>{
    console.log(data, "DATATATATATA");
    var final_truck = data.map((data) => {
      var loadDistrict = [];
      var loadingPoint = [];
      var loadingPerson = [];
      var loadingPersonNo = [];
      var loadingDate = [];
      var loadingTime = [];

      var i = 0;
      for (let points of data.information[0].truck_details[0].destination[0].loadingPoint) {
        for (let keys in points) {
          if (keys === 'loading_point') {
            loadDistrict.push(data.information[0].truck_details[0].destination[0].loadingPoint[i].load_district);
            loadingPoint.push(data.information[0].truck_details[0].destination[0].loadingPoint[i].loading_point);
            loadingPerson.push(data.information[0].truck_details[0].destination[0].loadingPoint[i].loading_person);
            loadingPersonNo.push(data.information[0].truck_details[0].destination[0].loadingPoint[i].loading_person_no);
            loadingDate.push(data.information[0].truck_details[0].destination[0].loadingPoint[i].loading_date);
            loadingTime.push(data.information[0].truck_details[0].destination[0].loadingPoint[i].loading_time);
          }
        }
        i = i + 1;
      }
      var dynamicInfo = {
        pk: data.pk,
        truck_reg: data.information[0].truck_reg,
        name:data.information[0].name,
        phone: data.information[0].phone,
        vendor_id: data.information[0].vendor_id,
        rent_time: data.information[0].rent_time,
        load_district: loadDistrict,
        loading_point: loadingPoint,
        loading_person: loadingPerson,
        loading_person_no: loadingPersonNo,
        loading_date: loadingDate,
        loading_time: loadingTime,
      };
      return dynamicInfo;
    });

    this.dataSource.data= final_truck


   })
  }

  setUpFormTwo(products: any[]){
    return new FormGroup({
      arrTwo: new FormArray(products.map((product) => this.loadingItemTwo(product)))
    });
  }

  loadingItemTwo(product){
    return this.fbTwo.group({
      loadingDistrict: [product.loadingDistrict, Validators.required],
      loadingPoint: [product.loadingPoint, Validators.required],
      loadingPerson: [product.loadingPerson, Validators.required],
      personContact: [product.personContact, Validators.required],
      loadingDate: [product.loadingDate, Validators.required],
      loadingTime: [product.loadingTime, Validators.required],
    })
  }

  loadingItem(){
    return this.fbTwo.group({
      loadingDistrict: ['', Validators.required],
      loadingPoint: ['', Validators.required],
      loadingPerson: ['', Validators.required],
      personContact: ['', Validators.required],
      loadingDate: ['', Validators.required],
      loadingTime: ['', Validators.required],
    })
  }

  setUpForm(products: any[]){
    return new FormGroup({
      arr: new FormArray(products.map((product) => this.createProductItem2(product)))
    });
  }

  createProductItem2(product){
    return this.fb.group({
      unloadingDistrict: [product.unloadingDistrict, Validators.required],
      unloadingPoint: [product.unloadingPoint, Validators.required],
      unloadingPerson: [product.unloadingPerson, Validators.required],
      unloadpersonContact: [product.unloadpersonContact, Validators.required],
      unloadingDate: [product.unloadingDate, Validators.required],
      unloadingTime: [product.unloadingTime, Validators.required],
    })
  }

  createProductItem(){
    return this.fb.group({
      unloadingDistrict: ['', Validators.required],
      unloadingPoint: ['', Validators.required],
      unloadingPerson: ['', Validators.required],
      unloadpersonContact: ['', Validators.required],
      unloadingDate: ['', Validators.required],
      unloadingTime: ['', Validators.required],
    })
  }





  onSubmit(){

    console.log(this.data, "ki paitesi");

    let objectToUpdate= this.data;
    console.log(objectToUpdate);



    this.loadComplete.push({
      pk: this.data.trip_id,
      created_date: this.data.created_date,
      created_at: this.data.created_at,
      order_id: this.data.order_id,
      sk: this.data.order_id,
      trip_id: this.data.trip_id,
      previous_status: this.data.status,
      name: this.data.name,
      orientation: "trip",
      status: 'loadCompleted',
      trip_number: this.data.trip_number,
      bidding_time: this.data.bidding_time,
      bidding_date: this.data.bidding_date,
      updated_by: this.data.updated_by,
      truck_details: this.data.truck_details,

      // rent_time: this.data.rent_time,
      // round_trip: this.data.round_trip,
      // driver_status: this.data.driver_status,


    })

    console.log(this.loadComplete, "this.loadCompletethis.loadCompletethis.loadComplete");











        this.loadConfirmSub= this.orderService.updateStatus(this.loadComplete).subscribe(data=> {
          if(data){
            this.commonService.showSuccessMsg('Board Updated!!!');
            this.close();
          }
        })










  }
  close = (): void => {
    this.dialogRef.close(true);
  };

  // openloadPointDialog(){
  //   const dialogRef = this.dialog.open(ProductAddModalComponent, {
  //     width: '500px',
  //     height: '500px',
  //   });
  // }

}
