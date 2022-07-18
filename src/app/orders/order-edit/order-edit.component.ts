import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
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
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Storage, Auth } from 'aws-amplify';
import * as moment from 'moment';
import { threadId } from 'worker_threads';
import { OrderDeleteModComponent } from '../order-delete-mod/order-delete-mod.component';
import { district } from 'src/app/shared/data/district';

const district_list = new district()
export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email?: string;
  image_path: string;
  type: string;
}



@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit, OnDestroy {

  distList= district_list.districtList;

  formId = 'orderFrom';
  file: any;
  truckInOrder=[]
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
  filteredStates: Observable<Customer[]>;
  truckTypes = [];
  lengths: any[];
  order!: FormArray;
  isCheck: boolean;
  duplicateObj = [];
  odrerEdit: any;
  orderData:any;
  subscription: Subscription;
  orderNew:any

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

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,

  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      item: any
    };

    console.log("stttjgjugjgjaate", state);

  }

  ngOnInit(): void {

    const fare = this.route.snapshot.paramMap.get('fare');
    const loading_person = this.route.snapshot.paramMap.get('loading_person');
    const product_weight = this.route.snapshot.paramMap.get('product_weight');
    const load_district = this.route.snapshot.paramMap.get('load_district');

    const truck_loading_point = this.route.snapshot.paramMap.get('truck_loading_point');
    const unload_district = this.route.snapshot.paramMap.get('unload_district');

    const truck_unloading_point = this.route.snapshot.paramMap.get('truck_unloading_point');
    const truck_loading_date = this.route.snapshot.paramMap.get('truck_loading_date');
    const length = this.route.snapshot.paramMap.get('length');
    const weight = this.route.snapshot.paramMap.get('weight');
    const type = this.route.snapshot.paramMap.get('type');
    const truck_loading_time = this.route.snapshot.paramMap.get('truck_loading_time');
    const cbm = this.route.snapshot.paramMap.get('cbm');
    const product_spec = this.route.snapshot.paramMap.get('product_spec');
    const unloading_phone = this.route.snapshot.paramMap.get('unloading_phone');
    const loading_phone = this.route.snapshot.paramMap.get('loading_phone');
    const unloading_person = this.route.snapshot.paramMap.get('unloading_person');
    const name = this.route.snapshot.paramMap.get('name');
    const product_name = this.route.snapshot.paramMap.get('product_name');

    const truckEdit = {
      load_district: load_district,
      unload_district: unload_district,
       truck_loading_point: truck_loading_point,
      loading_person: loading_person,
      loading_phone: loading_phone,
      truck_unloading_point: truck_unloading_point,
      unloading_person: unloading_person,
      unloading_phone: unloading_phone,
      truck_loading_date: truck_loading_date,
      truck_loading_time: truck_loading_time,
      type: type,
      length: length,
      product_name: product_name,
      product_weight: product_weight,
      product_spec: product_spec,
      weight: weight,
      cbm: cbm,
      name: name,
      fare: fare,
    }






    this.form = this.fb.group({
      customer_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      type: ['', [Validators.required]],
      order: new FormArray([this.initAddOrder()]),
    });




    this.order = this.form.get('order') as FormArray;

    this.order.patchValue([
      truckEdit
    ]);
    this.subscription = this.commonService.currentMessage.subscribe(orderData => this.orderData = orderData)
    console.log( this.orderData, " this.message");
    
        //const odrerEditindex = this.orderData[1]
        //this.truckInOrder= this.orderData[0].truck_type
        //this.truckInOrder.splice(odrerEditindex, 1);
        this.orderNew = this.orderData[0]
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
      (state) => state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
  initAddOrder() {
    return this.fb.group({
      truck_loading_date: ['', [Validators.required]],
      truck_loading_time: ['', [Validators.required]],
      load_district: [''],
      truck_loading_point: ['', [Validators.required]],
      unload_district:[''],
      truck_unloading_point: ['', [Validators.required]],
      truck_starting_date: ['', [Validators.required]],
      loading_person: ['', [Validators.required]],
      loading_phone: ['', [Validators.required]],
      unloading_person: ['', [Validators.required]],
      unloading_phone: ['', [Validators.required]],
      product_name: ['', [Validators.required]],
      product_weight: ['', [Validators.required]],
      product_spec: ['', [Validators.required]],
      bidding_validity: ['', [Validators.required]],
      product_image: ['', [Validators.required]],
      isSelect: [false, [Validators.required]],
      truck_type: ['', [Validators.required]],
      type: ['', [Validators.required]],
      fare: ['', [Validators.required]],
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
        this.orderNew.truck_type.splice(this.orderData[1], 1);
        
           
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
    
    console.log( this.orderNew);
    

 

    let orderFinal = data.order.map((i) => {
      const typeMarge = { ...i.truck_type };
      const type = [];
      typeMarge.truck_loading_point = i.truck_loading_point;
      typeMarge.truck_unloading_point = i.truck_unloading_point;
      typeMarge.load_district = i.load_district;
      typeMarge.unload_district = i.unload_district;

      typeMarge.truck_loading_date = moment(i.truck_loading_date).format(
        'YYYY-MM-DD'
      );
      typeMarge.truck_loading_time = i.truck_loading_time;
      typeMarge.loading_person = i.loading_person;
      typeMarge.loading_phone = i.loading_phone;
      typeMarge.unloading_person = i.unloading_person;
      typeMarge.unloading_phone = i.unloading_phone;
      typeMarge.product_name = i.product_name;
      typeMarge.product_weight = i.product_weight;
      typeMarge.product_spec = i.product_weight;
      typeMarge.type = i.type;
      typeMarge.fare = i.fare;


      // const trip = parseInt(i.number_of_trip)


      // for (let index = 0; index < trip; index++) {

      // }
      type.push(typeMarge);



      return type;
    });



    var result = orderFinal.reduce((r, e) => (r.push(...e), r), []);
    const x = { truck_type: result };
    this.orderNew.truck_type.splice(this.orderData[1], 1);
    this.orderNew.truck_type.push(result[0])
    console.log('resultresultresultresultresultresult', this.orderNew.truck_type);

    const orderfinal = { ...x, ...this.orderNew};

    console.log('orderFiorderFiorderFiorderFiorderFi',result);

    if (!this.isPictureUploaded) {
      console.log('nai');
    } else {
      const filename = `${Date.now()}-${this.file.name}`;
      Storage.put(`${this.customer_id.value}/Files/${filename}`, this.file)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      //order.fileName = <string>filename;
    }

    if (true) {

      this.asyncService.start();

      this.orderAddSub = this.orderService.updateCollectedOrder(orderfinal).subscribe(
        (isAdded) => {
          if (isAdded) {

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
    }
  }

  ngOnDestroy(): void {
    if (this.orderAddSub) {
      this.orderAddSub.unsubscribe();
    }
    if (this.loadCustomerInfoSub) {
      this.loadCustomerInfoSub.unsubscribe();
    }

    this.subscription.unsubscribe();
    this.asyncService.finish();
  }
}

