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

export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email?: string;
  image_path: string;
  type: string;
}
const district_list = new district()
@Component({
  selector: 'app-order-add-modal',
  templateUrl: './order-add-modal.component.html',
  styleUrls: ['./order-add-modal.component.scss'],
})
export class OrderAddModalComponent implements OnInit, OnDestroy {
  formId = 'orderFrom';
  file: any;
  currentUserEmail: string;
  filecheck: any;
  currentUserName: string;
  orderAddSub: Subscription;
  loadCustomerSub: Subscription;
  loadCustomerIdSub: Subscription;
  loadCustomerInfoSub: Subscription;
  customerIdList: [];
  customerControl = new FormControl();
  form: FormGroup;
  truckTypes = [];
  lengths: any[];
  order!: FormArray;
  isCheck: boolean;
  duplicateObj = [];
  inputFILE = document.getElementById('input')
  moment: Moment;
  orderCreator;
  orderfinal;
  showOrderDataOnTable;


  uiChange = false;

  capacitiesForCovered: any[] = [
    { name: '7 ft', length: '7', weight: '1.5 ton', cbm: '3' },
    { name: '9 ft', length: '9', weight: '2.5 ton', cbm: '6' },
    { name: '12 ft', length: '12', weight: '4 ton', cbm: '10' },
    { name: '16 ft', length: '16', weight: '10 ton', cbm: '15' },
    { name: '23 ft', length: '23', weight: '12 ton', cbm: '32' },
  ];
  capacitiesForOpen: any[] = [
    { name: '7 ft', length: '7', weight: '1.5 ton' },
    { name: '9 ft', length: '9', weight: '3 ton' },
    { name: '12 ft', length: '12', weight: '6 ton' },
    { name: '14 ft', length: '14', weight: '8 ton' },
    { name: '18 ft', length: '18', weight: '13 ton' },
    { name: '20 ft', length: '20', weight: '15 ton' },
  ];
  types: any[] = [
    { name: 'Covered', value: 'covered' },
    { name: 'Open', value: 'open' },
  ];
  customers: Customer[] = [];
  isPictureUploaded: boolean;
  productPicture: File;
  filteredStates: Observable<Customer[]>;
  productList: Product[] = [];

  distList = district_list.districtList;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog,

  ) { }


  ngOnInit(): void {

    this.orderService.getProduct().subscribe((data) => {
      data.forEach(element => {
        this.productList.push(element.productName);

      });
    });



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

    this.form = this.fb.group({
      customer_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      type: ['', [Validators.required]],
      order: new FormArray([this.initAddOrder()]),
    });

   



  }




  formControlItem: FormControl = new FormControl("");
  required: boolean = !1;
  @ViewChild("timepicker") timepicker: any;

  openFromIcon(timepicker: { open: () => void }) {
    if (!this.formControlItem.disabled) {
      timepicker.open();
    }
  }
  onClear($event: Event) {
    this.formControlItem.setValue(null);
  }


  private _filterStates(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) > -1 ||
        state.phone.toLowerCase().indexOf(filterValue) > -1
    );
  }

  initAddOrder() {
    return this.fb.group({
      truck_loading_date: ['', [Validators.required]],
      truck_loading_time: ['', [Validators.required]],
      truck_loading_point: ['', [Validators.required]],
      load_district: ['', [Validators.required]],
      unload_district: ['', [Validators.required]],
      truck_unloading_point: ['', [Validators.required]],
      truck_starting_date: ['', [Validators.required]],
      loading_person: ['', [Validators.required]],
      loading_phone: ['', [Validators.required]],
      unloading_person: ['', [Validators.required]],
      unloading_phone: ['', [Validators.required]],
      product_name: ['', [Validators.required]],
      product_weight: ['', [Validators.required]],
      product_spec: ['', [Validators.required]],
      truck_bidding_date: ['', [Validators.required]],
      bidding_validity: ['', [Validators.required]],
      product_image: [''],
      isSelect: [false, [Validators.required]],
      truck_type: ['', [Validators.required]],
      type: ['', [Validators.required]],
      number_of_trip: ['', [Validators.required]],
    });
  }

  get customer_id() {
    return this.form.get('customer_id');
  }
  get isSelect() {
    return this.form.get('isSelect');
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

  get truck_loading_time() {
    return this.form.get('truck_loading_time');
  }
  get loading_date() {
    return this.form.get('loading_date');
  }

  get loading_point() {
    return this.form.get('loading_point');
  }
  get load_district() {
    return this.form.get('load_district');
  }
  get unload_district() {
    return this.form.get('unload_district');
  }
  get loading_person() {
    return this.form.get('loading_person');
  }
  get unloading_person() {
    return this.form.get('unloading_person');
  }
  get unloading_point() {
    return this.form.get('unloading_point');
  }

  get product_name() {
    return this.form.get('product_name');
  }

  get product_weight() {
    return this.form.get('product_weight');
  }
  get product_spec() {
    return this.form.get('product_spec');
  }
  get product_image() {
    return this.form.get('product_image');
  }
  get bidding_validity() {
    return this.form.get('bidding_validity');
  }
  get length() {
    return this.form.get('length');
  }
  get quantity() {
    return this.form.get('quantity');
  }
  get type() {
    return this.form.get('type');
  }
  get weight() {
    return this.form.get('weight');
  }
  get cbm() {
    return this.form.get('cbm');
  }

  get number_of_trip() {
    return this.form.get('number_of_trip');
  }
  typeValue(event) {
    event === 'covered'
      ? (this.lengths = this.capacitiesForCovered)
      : (this.lengths = this.capacitiesForOpen);
  }


  get orderArr(): any {
    return (this.form.get('order') as FormArray).controls;
  }

  isChangeUI(){
    this.uiChange = true

  }

  isChangeBack(){
    this.uiChange = false

  }

  duplicate() {
    this.order = this.form.get('order') as FormArray;
    this.order.push(this.initAddOrder());
    this.order.patchValue(this.duplicateObj);
    

    console.log(this.duplicateObj);
    this.isCheck = false;
  }

  deleteOrder(index: number) {
    //this.order.removeAt(index);
    const dialogRef = this.dialog.open(OrderDeleteModComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });


    this.commonService.fromReload.subscribe((msg) => {
      console.log(msg);
      if (msg) {
        this.order.removeAt(index);
      }
    });

  }
  Select(e: any) {
    this.isCheck = e;
  }
  oneSelect(i: any) {
    if (this.isCheck) {
      this.duplicateObj = this.form.value.order;
      this.form.value.order[i].isSelect = false;
      this.duplicateObj.push(this.form.value.order[i]);
    } else {
      this.duplicateObj = this.form.value.order;
    }
    console.log(this.duplicateObj);
  }

  orderFileUpload({ target }: Event): void {
    const files = (<HTMLInputElement>target).files;

    if (files && files.length > 0) {
      this.filecheck = files[0];
      const fileExtension = this.filecheck.name.replace(/^.*\./, '');
      console.log(fileExtension);
      if (fileExtension == 'xlsx' || fileExtension! == 'xls') {
        this.file = files[0];
        this.form.patchValue({ fileName: this.file.name });
      } else {
        alert('not an accepted file extension');
      }
    }
  }
  onSelectCustomer(id) {
    const cus = this.customers.find((item) => item.customer_id === id);
    console.log("======cus========", cus);
    this.customerControl.patchValue(cus.name);
    this.name.patchValue(cus.name);
    this.phone.patchValue(cus.phone);
    this.email.patchValue(cus.email);
    this.customer_id.patchValue(cus.customer_id);
    this.type.patchValue(cus.type);

  }
  onChangeUserPicture({ target }: Event): void {
    this.isPictureUploaded = true;
    try {
      const files = (<HTMLInputElement>target).files;
      if (files && files.length > 0) {
        this.productPicture = files[0];
        this.form.patchValue({ picture_name: this.productPicture.name });
        const reader = new FileReader();
        reader.readAsDataURL(this.productPicture);
      } else {
        this.form.patchValue({ picture_name: '' });
      }
    } catch (error) { }
  }




  async onSubmit(data) {
      this.orderCreator = {
      customer_id: this.customer_id.value,
      email: this.email.value,
      name: this.name.value,
      orientation: 'order',
      phone: this.phone.value,
      previous_status: 'ordersPlaced',
      sk: this.customer_id.value,
      status: 'ordersPlaced',
      updated_by: this.email.value,
      type: this.type.value,
    };







    let orderFinal = data.order.map((i) => {

      const loadingDate = moment(i.truck_loading_date).format('YYYY-MM-DD');
      const BiddingDate = moment(i.truck_bidding_date).format('YYYY-MM-DD');
      const loadTime = (<HTMLInputElement>document.getElementById("loadingTime")).value;
      const BiddiTime = (<HTMLInputElement>document.getElementById("time")).value;


      if (BiddingDate < loadingDate) {
        let startDate = new Date(`${loadingDate} ${loadTime}`);
        let endDate = new Date(`${BiddingDate} ${BiddiTime}`);
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

      } else if (loadingDate < BiddingDate) {
        this.commonService.showErrorMsg('Bidding Time Not Correct');
        return
      } else {
        console.log('ok and Compare');
        let todayDate = moment(new Date()).format("MM-DD-YYYY");
        let startDate = new Date(`${todayDate} ${loadTime}`);
        let endDate = new Date(`${todayDate} ${BiddiTime}`);
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

      const typeMarge = { ...i.truck_type };
      const type = [];
      typeMarge.truck_loading_point = i.truck_loading_point;
      typeMarge.load_district = i.load_district;
      typeMarge.unload_district = i.unload_district;
      typeMarge.truck_unloading_point = i.truck_unloading_point;
      typeMarge.truck_loading_date = moment(i.truck_loading_date).format(
        'YYYY-MM-DD'
      );
      typeMarge.truck_loading_time = (<HTMLInputElement>document.getElementById("loadingTime")).value;
      typeMarge.bidding_validity = (<HTMLInputElement>document.getElementById("time")).value;
      typeMarge.truck_loading_time = i.truck_loading_time;
      typeMarge.loading_person = i.loading_person;
      typeMarge.loading_phone = i.loading_phone;
      typeMarge.unloading_person = i.unloading_person;
      typeMarge.unloading_phone = i.unloading_phone;
      typeMarge.product_name = i.product_name;
      typeMarge.product_weight = i.product_weight;
      typeMarge.product_spec = i.product_weight;
      typeMarge.type = i.type;


      const trip = parseInt(i.number_of_trip)
      for (let index = 0; index < trip; index++) {
        type.push(typeMarge);

      }
      return type;
    });



    var result = orderFinal.reduce((r, e) => (r.push(...e), r), []);

    const x = { truck_type: result };

    const orderfinal = { ...x, ...this.orderCreator };


    let counter = 0;

    for (const obj in x.truck_type) {
      counter++
    }

    var newOrderFinal = Object.assign(orderfinal, { "count": counter });
    console.log(newOrderFinal, "blaaaaaaaaaaaaaaaaaaa");


    if (!this.isPictureUploaded) {
      console.log('nai');
    } else {
      const filename = `${Date.now()}-${this.file.name}`;
      Storage.put(`${this.customer_id.value}/Files/${filename}`, this.file)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      //order.fileName = <string>filename;
    }

    // if (resultTime>=6 && true) {
    //   console.log("porbeeeeeeeeeeeeeee");
    if (true) {

      this.asyncService.start();
      this.orderAddSub = this.orderService.addOrder(newOrderFinal).subscribe(
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

      console.log('orderfinal', newOrderFinal);



    }

    else {

      this.commonService.showErrorMsg('Error! The bidding time is not valid is not created!');

    }


  }



  excelupload(e) {
    let FileReader: any;
    FileReader = e.target.files[0];
    let type = e.target.files[0].name.split('.').pop();

    const schema = {
      
      'bidding validity': {
        prop: 'bidding_validity',
        type:String,
        required: false

      },
      'cbm': {
        prop: 'cbm',
        type: String,
        required: false

      },
      'length': {
        prop: 'length',
        type: String,
        required: false

      },
      'load_district': {
        prop: 'load_district',
        type: String,
        required: false

      },
      'loading_person': {
        prop: 'loading_person',
        type: String,
        required: false

      },
      'loading_phone': {
        prop: 'loading_phone',
        type: String,
        required: false

      },
      'product_name': {
        prop: 'product_name',
        type: String,
        required: false

      },
      'product_spec': {
        prop: 'product_spec',
        type: String,
        required: false

      },
      'truck_loading_date': {
        prop: 'truck_loading_date',
        type: Date,
        required: false

      },
      'truck_loading_point': {
        prop: 'truck_loading_point',
        type: String,
      },
      'truck_loading_time': {
        prop: 'truck_loading_time',
        type: String,
        required: false

      },
      'truck_unloading_point': {
        prop: 'truck_unloading_point',
        type: String,
        required: false

      },
      'truck-type': {
        prop: 'type',
        type: String,
        required: false

      },
      'unload_district': {
        prop: 'unload_district',
        type: String,
        required: false

      },
      'unloading_person': {
        prop: 'unloading_person',
        type: String,
        required: false

      },
      'unloading_phone': {
        prop: 'unloading_phone',
        type: String,
        required: false
      },
    }

    readXlsxFile(e.target.files[0], { schema }).then((data) => {
      this.showOrderDataOnTable = data.rows

    })



  }


  excelUploadForOrder(){
    const orderCreator = {
      customer_id: this.customer_id.value,
      email: this.email.value,
      name: this.name.value,
      orientation: 'order',
      phone: this.phone.value,
      previous_status: 'ordersPlaced',
      sk: this.customer_id.value,
      status: 'ordersPlaced',
      updated_by: this.email.value,
      type: this.type.value,
    };
    const x = { truck_type: this.showOrderDataOnTable};
    const orderfinal = { ...x, ...orderCreator };  

    if (orderCreator &&  orderCreator && orderfinal) {
      this.asyncService.start();
      this.orderAddSub = this.orderService.addOrder(orderfinal).subscribe(
        (isAdded) => {
          if (isAdded) {
            this.commonService.showSuccessMsg(
              'Success! The order has been  created by excel!'
            );
            this.asyncService.finish();
            this.router.navigate(['/orders']);
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! The order is not created by excel!!');
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! The order is not created by excel!!');
        }
      )
     }
  }




  ngOnDestroy(): void {
    if (this.orderAddSub) {
      this.orderAddSub.unsubscribe();
    }
    if (this.loadCustomerInfoSub) {
      this.loadCustomerInfoSub.unsubscribe();
    }
    this.asyncService.finish();
  }
}


