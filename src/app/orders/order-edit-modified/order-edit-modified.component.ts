// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-order-edit-modified',
//   templateUrl: './order-edit-modified.component.html',
//   styleUrls: ['./order-edit-modified.component.scss']
// })
// export class OrderEditModifiedComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Moment } from 'moment';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription, Observable } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  FormArrayName,
} from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Storage, Auth, input } from 'aws-amplify';
import * as moment from 'moment';
import { threadId } from 'worker_threads';
import { OrderDeleteModComponent } from '../order-delete-mod/order-delete-mod.component';
import { district } from 'src/app/shared/data/district';
import { Product } from '../models/order.model';
import readXlsxFile from 'read-excel-file'
import { time } from 'console';
import { type } from 'os';
import { objectLessAttributes } from '@aws-amplify/core';
import { OrdersBoardComponent } from '../orders-board/orders-board.component';

export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email?: string;
  image_path: string;
  type: string;
}
const district_list = new district();

@Component({
  selector: 'app-order-edit-modified',
  templateUrl: './order-edit-modified.component.html',
  styleUrls: ['./order-edit-modified.component.scss']
})
export class OrderEditModifiedComponent implements OnInit {
  // data:any;
  // @ViewChild(OrdersBoardComponent) child:OrdersBoardComponent;
  leaseSub: Subscription;
  finalData : any;
  form: FormGroup;
  customerSub: Subscription;
  orderAdd: Subscription;
  customers: Customer[]=[];
  customerSearch= new FormControl();
  filteredStates: Observable<any[]>;
  orderCreator;
  truck_details=[];
  formId= 'orderForm';
  lengths: any[];
  duplicateObj = [];
  isCheck: boolean;
  paramId: any=[];

  capacitiesForCovered: any[] = [
    { name: '7 feet', length: '7', weight: '1.5 ton', cbm: '3' },
    { name: '9 feet', length: '9', weight: '2.5 ton', cbm: '6' },
    { name: '12 feet', length: '12', weight: '4 ton', cbm: '10' },
    { name: '14 feet', length: '14', weight: '10 ton', cbm: '15' },
    { name: '16 feet', length: '16', weight: '10 ton', cbm: '15' },
    { name: '18 feet', length: '18', weight: '10 ton', cbm: '15' },
    { name: '23 feet', length: '23', weight: '12.5 ton', cbm: '32' },
  ];
  capacitiesForOpen: any[] = [
    { name: '7 feet', length: '7', weight: '1.5 ton', cbm: '3' },
    { name: '9 feet', length: '9', weight: '2.5 ton', cbm: '6' },
    { name: '12 feet', length: '12', weight: '4 ton', cbm: '10' },
    { name: '14 feet', length: '14', weight: '10 ton', cbm: '15' },
    { name: '16 feet', length: '16', weight: '10 ton', cbm: '15' },
    { name: '18 feet', length: '18', weight: '10 ton', cbm: '15' },
    { name: '23 feet', length: '23', weight: '12.5 ton', cbm: '32' },
  ];

  capacitiesForFreezer: any[] = [
    { name: '7 Feet', length: '7'},
    { name: '12 Feet', length: '12'},
    { name: '14 Feet', length: '14'},
    { name: '18 Feet', length: '18'},
    ];

  capacitiesForTrailer: any[] = [
    { name: '23 Feet High bed', length: '23'},
    { name: '23 Feet Low bed', length: '23'},
    { name: '40 Feet High bed', length: '40'},
    { name: '40 Feet Low bed', length: '40'},
    { name: '20 Feet 2XL', length: '20'},
    { name: '20 Feet 3XL', length: '20'},
    { name: '20 Feet 4XL', length: '20'},
    { name: '20 Feet 4XL', length: '20'},
    { name: '40 Feet 4XL', length: '40'},
    { name: '40 Feet 5XL', length: '40'}, 
  ];
  types: any[] = [
    { name: 'Covered', value: 'covered' },
    { name: 'Open', value: 'open' },
    { name: 'Trailer', value: 'trailer' },
    { name: 'Freezer', value: 'freezer' },
  ];

  distList = district_list.districtList;


  constructor(private fb:FormBuilder,
              private orderService: OrderService,
              private commonService: CommonService,
              public asyncService: AsyncService,
              private router: Router,
              private route: ActivatedRoute
              ) {     }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params.queryParams;
    this.commonService.getMessage().subscribe(data=>{
      this.finalData=data;
      console.log(this.finalData,'llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll')
    })

    this.customerSub = this.orderService.getCustomer().subscribe(
      (data)=>{
        if (data){
          this.customers = data;
        }
        else{
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Customers could not found');
        }
        
      }
    );
    this.filteredStates = this.customerSearch.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map((state)=>
        state ? this._filterStates(state) : this.customers.slice())
    );
    this.form = this.fb.group({
      customer_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      orders: this.fb.array([this.orderArr()]),
      isSelect: [''],
      number_of_trips:['1']
      
      
    });

  }
  
  orderArr(): FormGroup{
    return this.fb.group({
      
      loadPoints: this.fb.array([this.loadPointsArr()]),
      unloadPoints: this.fb.array([this.unloadPointsArr()]),
      bidding_time:[''],
      products: this.fb.array([this.productArr()]),
      bidding_date: [''],
      truck_type: ['', [Validators.required]],
      // isSelect: [false, [Validators.required]],
      type: ['', [Validators.required]], 
     

    })
  }


  // singleData(){
  //   this.form.loadPoints(this.finalData);
  // }

  loadPointsArr(){
    return this.fb.group({
      loading_point: ['', [Validators.required]],
      loading_person:['', [Validators.required]],
      load_district: [' ', [Validators.required]],
      loading_person_no:[' ', [Validators.required]],
      loading_date: ['', [Validators.required]],
      loading_time:[' ', [Validators.required]],
      

    })
  }

  
      
  unloadPointsArr(){
    return this.fb.group({
      unloading_person: ['',[Validators.required]],
      unloading_point:['',[Validators.required]],
      unload_district: ['', [Validators.required]],
      unloading_person_no:[''],
      unloading_date: ['',],
      unloading_time:['']
    })
  }

  productArr(){
    return this.fb.group({
      product_name: ['', [Validators.required]],
      product_material:['', [Validators.required]],
      product_weight:['', [Validators.required]],
      product_quantity: ['', [Validators.required]],
      // upload_image:['no image'],
      // remarks:['moja'],
      

    })
  }
  
 
  private _filterStates(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) > -1 ||
        state.phone.toLowerCase().indexOf(filterValue) > -1
    );
  }
  get customer_id(){
    return this.form.get('customer_id');
  }
  get name() {
    return this.form.get('name');
  }
  get phone() {
    return this.form.get('phone');
  }
  get email() {
    return this.form.get('email');
  }
  get bidding_date(){
    return this.form.get('bbidding_date');
  }
  get bidding_time(){
    return this.form.get('bidding_time');
  }

  get orders(): FormArray{
    return this.form.get('orders') as FormArray;
  }
  get isSelect() {
    return this.form.get('isSelect');
  }
  get number_of_trips(){
    return this.form.get('number_of_trips');
  }

  typeValue(event) {
    if( event ==='covered'){
      this.lengths = this.capacitiesForCovered
    }
    else if(event ==='open'){
      this.lengths = this.capacitiesForOpen
    }
    else if(event ==='trailer'){
      this.lengths = this.capacitiesForTrailer
    }
    else{
      this.lengths = this.capacitiesForFreezer
    }
  }

  //For duplicating the whole order
  addOrder(){
    this.orders.push(this.orderArr());
    var patchValue=this.orders.patchValue(this.duplicateObj);
    this.isCheck = false;   
    console.log(patchValue, "patchValuepatchValue");
  }
  //remove the order of particular index
  removeOrder(i: number){
    this.orders.removeAt(i);
  }
  
  loadPoints(i: number): FormArray{
    return this.orders.at(i).get('loadPoints') as FormArray;
  }

  addLoadPoints(i: number){
    this.loadPoints(i).push(this.loadPointsArr());
  }
  removeLoadPoint(i: number, loadIndex: number){
    this.loadPoints(i).removeAt(loadIndex);
    }

  unloadPoints(i: number): FormArray{
      return this.orders.at(i).get('unloadPoints') as FormArray;
    }
  
    addUnloadPoints(i: number){
      this.unloadPoints(i).push(this.unloadPointsArr());
    }
  removeUnloadPoint(i: number, unloadIndex: number){
      this.unloadPoints(i).removeAt(unloadIndex);
      }

  products(i: number): FormArray{
      return this.orders.at(i).get('products') as FormArray;
    }
    
  addProduct(i: number){
      this.products(i).push(this.productArr());
    }
  removeProduct(i: number, productIndex: number){
      this.products(i).removeAt(productIndex);
    }

 

  

  onSelectCustomer(id){
    const cus = this.customers.find((item) => item.customer_id === id);
    this.customerSearch.patchValue(cus.name);
    this.name.patchValue(cus.name);
    this.phone.patchValue(cus.phone);
    this.customer_id.patchValue(cus.customer_id);
    
    }

  isChangeUI(){
    console.log(this.customers,"this.customersthis.customers");
    
  }
  Select(e: any) {
    this.isCheck = e;
  }
  oneSelect() {
    if (this.isCheck) {
      this.duplicateObj = this.form.value.orders;
      this.form.value.orders.isSelect = false;
      this.duplicateObj.push(this.form.value.orders);
    } else {
      this.duplicateObj = this.form.value.orders;
    }
    console.log(this.duplicateObj, "this.duplicateObjthis.duplicateObj");
  }

  async onSubmit(data){
    console.log(this.form.value, 'eeeee');
    this.orderCreator = {
      customer_id: this.customer_id.value,
      // email: this.email.value,
      name: this.name.value,
      orientation: 'order',
      phone: this.phone.value,
      previous_status: 'ordersPlaced',
      sk: this.customer_id.value,
      status: 'ordersPlaced',
      // updated_by: this.email.value
    };

    console.log("hi");
   
    data.orders.map(element => {
     console.log( element.loadPoints);
     const loadInfo= element.loadPoints;
     const unloadInfo= element.unloadPoints;
     const prodInfo= element.products;

     const destination= [{loadingPoint: loadInfo}, {unloadingPoint: unloadInfo}, {product: prodInfo}]  ;
     
  //    const destination = loadInfo.map((obj, index) => ({
  //     ...obj,
  //     ...prodInfo[index]
  // }) 
  // );

  const biddingTime= (<HTMLInputElement>document.getElementById("bidding_time")).value;

  const biddingDate= moment(element.bidding_date).format('YYYY-MM-DD');
  const loadingDate= moment(element.loadPoints[0].loading_date).format('YYYY-MM-DD');
  const loadingTime= (<HTMLInputElement>document.getElementById("loading_time")).value;

  console.log(loadingTime, "loadingTimeloadingTimeloadingTime");
  console.log(loadingDate, "loadingDateloadingDateloadingDate");
  console.log(biddingDate, "biddingDatebiddingDatebiddingDate");
  console.log(biddingTime, "biddingTimebiddingTimebiddingTime");
  
  

  if (biddingDate < loadingDate) {
    let startDate = new Date(`${loadingDate} ${loadingTime}`);
    let endDate = new Date(`${biddingDate} ${biddingTime}`);
    let timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
    let hh = Math.floor(timeDiff / 1000 / 60 / 60);
    let h = ('0' + hh).slice(-2)
    timeDiff -= hh * 1000 * 60 * 60;
    let mm = Math.floor(timeDiff / 1000 / 60);
    let m = ('0' + mm).slice(-2)
    if (!(6 < parseInt(h))) {
      this.commonService.showErrorMsg('Bidding Time Not Correct');
      console.log(parseInt(h))

      return
    }

  } else if (loadingDate < biddingDate) {
    this.commonService.showErrorMsg('Bidding Time Not Correct');
    return
  } else {
    console.log('ok and Compare');
    let todayDate = moment(new Date()).format("MM-DD-YYYY");
    let startDate = new Date(`${todayDate} ${loadingTime}`);
    let endDate = new Date(`${todayDate} ${biddingTime}`);
    let timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
    let hh = Math.floor(timeDiff / 1000 / 60 / 60);
    let h = ('0' + hh).slice(-2)
    timeDiff -= hh * 1000 * 60 * 60;
    let mm = Math.floor(timeDiff / 1000 / 60);
    let m = ('0' + mm).slice(-2)

    if (!(6 < parseInt(h))) {
      console.log(parseInt(h))
      this.commonService.showErrorMsg('Bidding Time Not Correct');
      return
    }

  }


  
  
  
  
  const truck_detail= {
    bidding_time: element.bidding_time,
    bidding_date: element.bidding_date,
    truck_type: element.truck_type,
    type: element.type,
    destination: destination
   };

   console.log(this.number_of_trips.value);
   
  for(let i=0; i<this.number_of_trips.value; i++){
    this.truck_details.push(truck_detail);

  }  
      const orderFinal= {...this.orderCreator, truck_details: this.truck_details}
      console.log(orderFinal, "orderFinalorderFinalorderFinalorderFinal");

      if (true) {

        this.asyncService.start();
        this.orderAdd = this.orderService.addOrder(orderFinal).subscribe(
          (isAdded) => {
            if (isAdded) {
              // const massage = `Hi${orderfinal.name},We are happy to inform your order has place successfully `;
              // this.orderService.(sendSmsorderfinal.phone,massage,"Streat.Ltd");
              this.commonService.showSuccessMsg(
                'Success! The order has beed created!'
              );
              this.asyncService.finish();
              this.router.navigate(['/orders']);
            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('Error! The order is not created!');
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! The order is not created!');
          }
        );
  
        console.log('orderfinal', orderFinal);
  
  
  
      }
  
    });    
    
    
  }
  ngOnDestroy(): void {
    if (this.orderAdd) {
      this.orderAdd.unsubscribe();
    }
   
    this.asyncService.finish();
  }

}
