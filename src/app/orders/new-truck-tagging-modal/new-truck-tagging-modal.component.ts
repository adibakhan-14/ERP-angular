import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-new-truck-tagging-modal',
  templateUrl: './new-truck-tagging-modal.component.html',
  styleUrls: ['./new-truck-tagging-modal.component.scss']
})
export class NewTruckTaggingModalComponent implements OnInit {
  myForm: FormGroup;
  arr: FormArray;
  myFormTwo: FormGroup;
  arrTwo: FormArray;
  constructor(
    private fb: FormBuilder,
    private fbTwo: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<NewTruckTaggingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  inTransit: any = [];
  inTransitSub: Subscription;

  ngOnInit(): void {
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createProductItem()]),
    })
    if (this.data.productInfo.length){
      this.myForm = this.setUpForm(this.data.productInfo);
      this.myForm.patchValue(this.data.productInfo)
    }
    console.log('Hello')


    this.myFormTwo = this.fbTwo.group({
      arrTwo: this.fbTwo.array([this.loadingItem()]),
    })
    if (this.data.truck_details.loading_points){
      this.myFormTwo = this.setUpFormTwo(this.data.truck_details.loading_points);
      this.myFormTwo.patchValue(this.data.truck_details.loading_points)
    }
    console.log('Hello')
  }

  setUpForm(products: any[]){
    return new FormGroup({
      arr: new FormArray(products.map((product) => this.createProductItem2(product)))
    });
  }

  createProductItem2(product){
    return this.fb.group({
      productName: [product.productName, Validators.required],
      productMaterial: [product.productMaterial, Validators.required],
      productQuantity: [product.productQuantity, Validators.required],
      productWeight: [product.productWeight, Validators.required],
    })
  }

  createProductItem(){
    return this.fb.group({
      productName: ['', Validators.required],
      productMaterial: ['', Validators.required],
      productQuantity: ['', Validators.required],
      productWeight: ['', Validators.required],
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
      actualLoadingDate: ['', Validators.required],
      actualLoadingTime: ['', Validators.required],
    })
  }

  loadingItem(){
    return this.fbTwo.group({
      loadingDistrict: ['', Validators.required],
      loadingPoint: ['', Validators.required],
      loadingPerson: ['', Validators.required],
      personContact: ['', Validators.required],
      actualLoadingDate: ['', Validators.required],
      actualLoadingTime: ['', Validators.required],
    })
  }

  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    console.log(this.arr, ` this.arr`);
    this.arr.push(this.createProductItem());
  }

  removeProduct(i: number, loadIndex: number) {
    this.arr.removeAt(loadIndex);
  }

  // checkSubmit(){
  //   console.log(this.myForm.value, 'here it is my form data')
  //   console.log(this.myFormTwo.value, 'here it is my form two data')
  // }

  onSubmit() {
    // console.log(this.myForm.value, 'here it is my form data')
    // console.log(this.data, 'here it is my previous state data')
    // console.log(this.myFormTwo.value.arrTwo[0], 'here it is my form two data')

    Object.assign(this.data.truck_details, { product: this.myForm.value });
    // Object.assign(this.data.truck_details, { loadingInfo: this.myFormTwo.value});

    // console.log(this.data.truck_details.loading_points[0], typeof(this.data.truck_details.loading_points[0]))

    this.data.status = 'inTransit';
    this.data.previous_status = 'loadCompleted';
    this.data.truck_details.loading_points.map((data,index)=>{
      Object.assign(this.data.truck_details.loading_points[index], { actualLoadingDate: this.myFormTwo.value.arrTwo[index].actualLoadingDate });
      Object.assign(this.data.truck_details.loading_points[index], { actualLoadingTime: this.myFormTwo.value.arrTwo[index].actualLoadingTime});
    })

    console.log(this.data, "ki product pacchi?????");
    // this.inTransit.push({
    //   pk: this.data.trip_id,
    //   created_date: this.data.created_date,
    //   created_at: this.data.created_at,
    //   order_id: this.data.order_id,
    //   sk: this.data.order_id,
    //   trip_id: this.data.trip_id,
    //   previous_status: this.data.status,
    //   name: this.data.name,
    //   orientation: "trip",
    //   status: 'inTransit',
    //   trip_number: this.data.trip_number,
    //   bidding_time: this.data.bidding_time,
    //   bidding_date: this.data.bidding_date,
    //   updated_by: this.data.updated_by,
    //   truck_details: this.data.truck_details,
    //   // rent_time: this.data.rent_time,
    //   // round_trip: this.data.round_trip,
    //   // driver_status: this.data.driver_status,
    // })
    // console.log(this.inTransit, "amar final objecttttttt?????");


    this.inTransitSub = this.orderService.updateCollectedOrder(this.data).subscribe((data) => {
      if (data) {
        this.commonService.showSuccessMsg('Board Updated!!!');
        this.close();
      }
    })
  }

  close = (): void => {
    this.dialogRef.close(true);
  };

}
