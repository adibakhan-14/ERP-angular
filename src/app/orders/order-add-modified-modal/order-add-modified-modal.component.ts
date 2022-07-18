import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Moment } from 'moment';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription, Observable, Subject } from 'rxjs';
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
import { Router } from '@angular/router';
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
import * as XLSX from 'xlsx';

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
  selector: 'app-order-add-modified-modal',
  templateUrl: './order-add-modified-modal.component.html',
  styleUrls: ['./order-add-modified-modal.component.scss']
})
export class OrderAddModifiedModalComponent implements OnInit {

  spinnerEnabled = false;
  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;

  form: FormGroup;
  customerSub: Subscription;
  orderAllSub:Subscription;
  orderAllArr:[];
  orderAdd: Subscription;
  tripAdd: Subscription;
  loadOrders: Subscription;
  Orders: Customer[] = [];
  customers: Customer[]=[];
  customerSearch= new FormControl();
  filteredStates: Observable<any[]>;
  orderCreator;
  tripCreator;
  orderID;
  truck_details=[];
  formId= 'orderForm';
  lengths: any[];
  duplicateObj = [];
  isCheck: boolean;


  capacitiesForCovered: any[] = [
    { name: '7 feet', length: '7 feet', weight: '1.5 ton', cbm: '3' },
    { name: '9 feet', length: '9 feet', weight: '3 ton' },
    { name: '12 feet', length: '12 feet', weight: '3 ton' },
    { name: '14 feet', length: '14 feet', weight: '2.5 ton', cbm: '6' },
    { name: '16 feet', length: '16 feet', weight: '4 ton', cbm: '10' },
    { name: '18 feet', length: '18 feet', weight: '10 ton', cbm: '15' },
    { name: '23 feet', length: '23 feet', weight: '12.5 ton', cbm: '32' },
  ];
  capacitiesForOpen: any[] = [
    { name: '7 feet', length: '7 feet', weight: '1.5 ton' },
    { name: '9 feet', length: '9 feet', weight: '3 ton' },
    { name: '12 feet', length: '12 feet', weight: '3 ton' },
    { name: '14 feet', length: '14 feet', weight: '2.5 ton' },
    { name: '16 feet', length: '16 feet', weight: '4 ton' },
    { name: '18 feet', length: '18 feet', weight: '10 ton' },
    { name: '20 feet', length: '20 feet', weight: '12.5 ton' },
    { name: '23 feet', length: '23 feet', weight: '12.5 ton' },
  ];

  capacitiesForFreezer: any[] = [
    { name: '12 Feet', length: '12 Feet' },
    { name: '14 Feet', length: '14 Feet' },
    { name: '18 Feet', length: '18 Feet' },
  ];

  capacitiesForTrailer: any[] = [
    { name: '23 Feet High bed', length: '23 Feet High bed' },
    { name: '23 Feet Low bed', length: '23 Feet Low bed' },
    { name: '40 Feet High bed', length: '40 Feet High bed ' },
    { name: '40 Feet Low bed', length: '40 Feet Low bed' },
    { name: '20 Feet 2XL', length: '20 Feet 2XL' },
    { name: '20 Feet 3XL', length: '20 Feet 3XL' },
    { name: '20 Feet 4XL', length: '20 Feet 4XL' },
    { name: '20 Feet 4XL', length: '20 Feet 4XL' },
    { name: '40 Feet 4XL', length: '40 Feet 4XL' },
    { name: '40 Feet 5XL', length: '40 Feet 5XL' },
  ];

  types: any[] = [
    { name: 'Covered', value: 'covered' },
    { name: 'Open', value: 'open' },
    { name: 'Trailer', value: 'trailer' },
    { name: 'Freezer', value: 'freezer' },
  ];

  distList = district_list.districtList;
  orderIdFromBack: any;
  username: any;
  userNameObj: { created_by: any; };
  excelOrderList: any = [];
  allTripInfo: any[];


  constructor(private fb:FormBuilder,
              private orderService: OrderService,
              private commonService: CommonService,
              public asyncService: AsyncService,
              private router: Router) {
                Auth.currentUserInfo().then(async user => {
                  this.username = user.attributes.email;
                  console.log('currentUserInfousername', user);
                  console.log('currentUserInfousername', user.attributes.email);
                }).catch(err => console.log(err));
   }

  ngOnInit(): void {


    console.log("Hello")

     this.orderAllSub= this.orderService.getOrders().subscribe((data)=> {
       if(data){
       this.orderAllArr= data;
      //  console.log(this.orderAllArr, "Am I getting all orders?????");
       }
       else{
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! Orders could not found');
       }
     });

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
      updated_by : [''],
      updated_date: [''],
      number_of_trips:['1', [Validators.required]]
    });
  }
  orderArr(): FormGroup{
    return this.fb.group({

      bidding_time:[''],
      products: this.fb.array([this.productArr()]),
      bidding_date: [''],
      // truck_type: ['', [Validators.required]],
      // type: ['', [Validators.required]],
    })
  }
// check(){
//   console.log(this.form.value.orders[0].products)
// }

onChange(evt) {
  let data, header;
  const target: DataTransfer = <DataTransfer>(evt.target);
  this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
  if (target.files.length > 1) {
    this.inputFile.nativeElement.value = '';
  }
  if (this.isExcelFile) {
    this.spinnerEnabled = true;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      data = XLSX.utils.sheet_to_json(ws);
    };

    reader.readAsBinaryString(target.files[0]);

    reader.onloadend = (e) => {
      this.spinnerEnabled = false;
      this.keys = Object.keys(data[0]);
      this.dataSheet.next(data)

      var obj = {}
      this.excelOrderList = []
      data.map(data=>{
        var copy = obj.constructor();
        for (var attr in data) {
          copy[attr] = data[attr]
        }
        this.excelOrderList.push(copy)
      })
      // this.IndividualTripAddWithOrderIdForExlec()
    }
  } else {
    this.inputFile.nativeElement.value = '';
  }
}



  productArr(){
    return this.fb.group({
      productName: [''],
      productMaterial:[''],
      productQuantity:[''],
      productWeight: [''],
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
  addOrder(){
    this.orders.push(this.orderArr());
    var patchValue=this.orders.patchValue(this.duplicateObj);
    this.isCheck = false;
  }
  removeOrder(i: number){
    this.orders.removeAt(i);
  }

  loadPoints(i: number): FormArray{
    return this.orders.at(i).get('loadPoints') as FormArray;
  }


  removeLoadPoint(i: number, loadIndex: number){
    this.loadPoints(i).removeAt(loadIndex);
    }

  unloadPoints(i: number): FormArray{
      return this.orders.at(i).get('unloadPoints') as FormArray;
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
    // console.log(this.customers,"this.customersthis.customers");

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
    // console.log(this.duplicateObj, "this.duplicateObjthis.duplicateObj");
  }

  getAllOrder(){
    this.loadOrders = this.orderService.getOrders().subscribe(
      (data) => {
        if (data) {
          this.Orders = data;
          // console.log(this.Orders,'get all Orders ')
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Orders could not found');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! Orders could not found');
      }
    );
  }
  IndividualTripAddWithOrderIdForExlec(){
    const finalTruckDetails = []
    var truck_details = {}
    this.excelOrderList.map(data=>{
      const loading_points = []
      const unloading_points = []
      const productInfo = []
      loading_points.push({
        loadingDistrict: data.loadingDistrict,
        loadingPoint : data.loadingPoint,
        loadingPerson: data.loadingPerson,
        personContact : data.personContact,
        loadingDate: data.loadingDate,
        loadingTime: data.loadingTime
      })
      unloading_points.push({
        unloadingDistrict: data.unloadingDistrict,
        unloadingPoint : data.unloadingPoint,
        unloadingPerson : data.unloadingPerson,
        unloadpersonContact : data.unloadpersonContact,
        unloadingDate: data.unloadingDate,
        unloadingTime: data.unloadingTime
      })
      truck_details = {
        loading_points: loading_points,
        unloading_points: unloading_points,
        truck_length : {cbm:data.cbm, length:data.length, name:data.length, weight:data.weight},
        truck_type : data.truck_type
      }
      productInfo.push({
        productName : data.productName,
        productMaterial : data.productMaterial,
        productWeight :data.productWeight,
        productQuantity : data.productQuantity
      })
      finalTruckDetails.push({
        order_id : this.orderIdFromBack['data'].order_id,
        customer_id: this.orderIdFromBack['data'].customer_id,
        sk : this.orderIdFromBack['data'].order_id,
        created_by : this.username,
        orientation: 'trip',
        previous_status: 'n/a',
        status: 'ordersPlaced',
        name: this.orderIdFromBack['data'].name,
        truck_details : truck_details
      })
    })
    this.allTripInfo = finalTruckDetails
    this.function(0)
  }


  function(i){
    this.asyncService.start();
    if(i=== this.allTripInfo.length){
      return 1
    }
    this.orderAdd = this.orderService.addTripForExcel(this.allTripInfo[i]).subscribe(
      (isAdded) => {
        if (isAdded) {
          this.function(i+1);
          this.commonService.showSuccessMsg(
            'Success! The trip is created!'
          );
          this.asyncService.finish();
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! The trips are not created!');
        }
      },
    );
  }

  

  IndividualTripAddWithOrderId(){
    const exOrderId = {
      order_id : this.orderIdFromBack['data'].order_id,
      customer_id: this.orderIdFromBack['data'].customer_id,
      sk : this.orderIdFromBack['data'].order_id,
      productInfo: this.form.value.orders[0].products,
    }
    const exTruck_details = []
    this.truck_details.map(data=>{
      exTruck_details.push({...data,...exOrderId})
    })
    console.log(exTruck_details,'This is the trip data')

    this.asyncService.start();
    this.tripAdd = this.orderService.addTrip(exTruck_details).subscribe(
      (isAdded) => {
        if (isAdded) {
          this.commonService.showSuccessMsg(
            'Success! The trips are created!'
          );
          this.asyncService.finish();
          this.router.navigate(['/orders']);
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! The trips are not created!');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! The trips are not created!');
      }
    );

  }

  async onSubmit(data){
    console.log(this.username, "User Name")
    this.userNameObj = {
      created_by : this.username
    }
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();

    // this.dateToday = yyyy + '/' + mm + '/' + dd;


    // console.log(this.dateToday, "format ki ashe date er????");

    this.orderAllArr.map((data, index)=>{
      // if (data){

      // }
      // console.log(data.or)
    })




    // console.log(this.form.value, 'eeeee');
    this.orderCreator = {
      customer_id: this.customer_id.value,
      name: this.name.value,
      orientation: 'order',
      phone: this.phone.value,
      sk: this.customer_id.value,
      created_by : this.username
      // updated_by: this.email.value
    };

    data.orders.map(element => {

  //  console.log( element.loadPoints);
  //    const destination = loadInfo.map((obj, index) => ({
  //     ...obj,
  //     ...prodInfo[index]
  // })
  // );
  
  const biddingTime= (<HTMLInputElement>document.getElementById("bidding_time")).value;

  const biddingDate= moment(element.bidding_date).format('YYYY-MM-DD');
  // const loadingDate= moment(element.loadPoints[0].loading_date).format('YYYY-MM-DD');
  // const loadingTime= (<HTMLInputElement>document.getElementById("loading_time")).value;


  // console.log(biddingDate, "biddingDatebiddingDatebiddingDate");
  // console.log(biddingTime, "biddingTimebiddingTimebiddingTime");




  // this.tripCreator= {
  //   order_id: this.orderID,
  //   // email: this.email.value,
  //   name: this.name.value,
  //   orientation: 'trip',
  //   trip_number: 'trip_number',
  //   previous_status: 'ordersPlaced',
  //   status: 'ordersPlaced',
  //   sk: this.orderID,
  // }
  const truck_detail= {
    name: this.name.value,
    orientation: 'trip',
    previous_status: 'n/a',
    status: 'ordersPlaced',
    bidding_time: element.bidding_time,
    bidding_date: element.bidding_date,
    created_by : this.username

   };

  //  console.log(this.number_of_trips.value);

      for(let i=0; i<this.number_of_trips.value; i++){
        let trip_number ={
          trip_number: "Trip-"+(i+1)
        }
        let data = {...truck_detail,...trip_number}
        this.truck_details.push(data);

      }
    //  const orderFinal= {...this.orderCreator, truck_details: this.truck_details, products: destination[0].product}
     const orderFinal= {...this.orderCreator, truck_details: this.truck_details, productInfo:this.form.value.orders[0].products}

      if (true) {

        console.log(orderFinal, "This is the order data");





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

            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('Error! The order is not created!');
            }
            this.orderIdFromBack = isAdded
            console.log(isAdded,'response body')
            if(this.isExcelFile){
              this.IndividualTripAddWithOrderIdForExlec()
            }else{
              this.IndividualTripAddWithOrderId();
            }
            //  this.router.navigate(['/orders']);
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! The order is not created!');
          }
        );
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
