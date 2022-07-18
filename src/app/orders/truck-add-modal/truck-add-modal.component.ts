import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription, Observable } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';
import { Truck, TruckEdit } from '../models/truck.model';
import { startWith, map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {metro} from "../../shared/data/data"
import { Auth } from 'aws-amplify';
export interface Vendor {
  vendor_id: string;
  name: string;
  phone: string;
  image_path: string;
}

const metroAndSerial = new metro()


@Component({
  selector: 'app-truck-add-modal',
  templateUrl: './truck-add-modal.component.html',
  styleUrls: ['./truck-add-modal.component.scss'],
})
export class TruckAddModalComponent implements OnInit, OnDestroy {
  formId = 'customerFrom';

  customerServiceSub: Subscription;
  loadVendorSub: Subscription;

  form: FormGroup;
  vendorControl = new FormControl();
  filteredStates: Observable<Vendor[]>;

  vendors: Vendor[] = [];

  lengths: any[];
  truckRegPrefix;

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

  statuses: any[];
  statusTruckOwner: any[] = [
    { name: 'Available', value: 'available' },
    { name: 'Not Available', value: 'notAvailable' },
  ];
  statusOtherVendor: any[] = [
    { name: 'returned', value: 'returned' },
    { name: 'rented', value: 'rented' },
  ];

  metroList =  metroAndSerial.metroList

  serialList = metroAndSerial.serialList
  username: any;
  userNameObjCreated: { created_by: any; };
  userNameObjUdated: { updated_by: any; };



  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<TruckAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    Auth.currentUserInfo().then(async user => {
      this.username = user.attributes.email;
      console.log('currentUserInfousername', user);
      console.log('currentUserInfousername', user.attributes.email);
    }).catch(err => console.log(err));
   }
  truckId



  ngOnInit(): void {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", this.data)
    this.loadVendorSub = this.orderService.getVendor().subscribe(
      (data) => {
        if (data) {
          this.vendors = data;
          console.log(this.vendors);
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Vendors could not found');
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! Vendors could not found');
      }
    );

    this.filteredStates = this.vendorControl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filterStates(state) : this.vendors.slice()))
    );
    this.form = this.fb.group({
      // vendor_name: ['', [Validators.required]],
      // vendor_id: ['', [Validators.required]],
      device_id: [''],
      // phone: ['',],
      length: ['', [Validators.required]],
      weight: [''],
      cbm: [''],
      type: ['', [Validators.required]],
      status: ['returned', [Validators.required]],
      orientation: ['truck'],
      metro: ['',[Validators.required]],
      serial: ['',[Validators.required]],
      number:['',[Validators.required]],
      updated_by : [''],
      updated_date: ['']

    });
    if (this.data) {
      this.truckId = this.data.truck_id;
      this.form.patchValue(this.data);
      this.vendorControl.patchValue(this.data.vendor_name);
    }
  }
  private _filterStates(value: string): Vendor[] {
    const filterValue = value.toLowerCase();

    return this.vendors.filter(
      (state) =>
        state.name.toLowerCase().indexOf(filterValue) === 0 ||
        state.phone.toLowerCase().indexOf(filterValue) === 0
    );
  }
  // onSelectvendor(id) {
  //   const cus = this.vendors.find((item) => item.vendor_id === id);
  //   this.vendorControl.patchValue(cus.name);
  //   this.vendor_name.patchValue(cus.name);
  //   this.vendor_id.patchValue(cus.vendor_id);
  //   this.phone.patchValue(cus.phone);
  //   if (cus.vendor_id === '0987654321_trcl_vendor') {
  //     this.statuses = this.statusTruckOwner;
  //     this.orientation.patchValue('own');
  //   } else {
  //     this.statuses = this.statusOtherVendor;
  //     this.orientation.patchValue('other');
  //   }
  // }



  get metro() {
    return this.form.get('metro');
  }
  get serial() {
    return this.form.get('serial');
  }
  get number() {
    return this.form.get('number');
  }

  get vendor_name() {
    return this.form.get('vendor_name');
  }
  get vendor_id() {
    return this.form.get('vendor_id');
  }
  get device_id() {
    return this.form.get('device_id');
  }
  get phone() {
    return this.form.get('phone');
  }
  get status() {
    return this.form.get('status');
  }
  get length() {
    return this.form.get('length');
  }
  get type() {
    return this.form.get('type');
  }
  get orientation() {
    return this.form.get('orientation');
  }
  get weight() {
    return this.form.get('weight');
  }
  get cbm() {
    return this.form.get('cbm');
  }




  typeValue(event:any) {
    event === 'covered'
      ? (this.lengths = this.capacitiesForCovered)
      : (this.lengths = this.capacitiesForOpen);

     if(event === 'trailer'){
      this.lengths = this.capacitiesForTrailer
     }

     if(event === 'freezer'){
      this.lengths = this.capacitiesForFreezer
    }

  }

  capacityInfo(event) {
    console.log(event);
    this.length.patchValue(event);
    this.weight.patchValue(event.weight);
    if (event.cbm) {
      this.cbm.patchValue(event.cbm);
    } else {
      this.cbm.patchValue('');
    }
  }




  onSubmit(truck: Truck) {
    console.log(this.username, "User Name")
    this.userNameObjUdated = {
      updated_by : this.username
    }
    this.userNameObjCreated = {
      created_by : this.username
    }
      if (this.form.valid) {
      const truckReg =  `${this.form.value.metro + " " +this.form.value.serial + " " +this.form.value.number}`
      // delete truck["metro"];
      // delete truck["number"];
      // delete truck["serial"];
      truck.length = truck.length.length;

      truck.truck_reg = truckReg
      this.asyncService.start();
      this.commonService.removeEmptyProperties(truck);
      console.log("after remove properties",truck);
      if (this.data) {

        let truckedit = {

          pk: this.data.pk,
          sk: this.data.sk,
          truck_id:this.data.truck_id,
          cbm:""

        };

        let truckeditfull = {
          ...truck,
          ...truckedit
        };

        console.log("lllllllllllllllllllllllllllllllllthis.truckIdllllllllllllllllllllllllllll", truckeditfull);
        console.log("lllllllllllllllllllllllllllllllllthis.truckllllllllllllllllllllllllllll", truck);

        this.customerServiceSub = this.orderService.updateTruck(this.truckId, {...truckeditfull,...this.userNameObjUdated}).subscribe(
          (isAdded) => {
            this.asyncService.finish();
            if (isAdded) {
              this.commonService.showSuccessMsg(
                'Success! The Truck has been Updated successfully.'
              );
              this.close();
              window.location.reload();
            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('Error! The Truck is not Updated.');
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! The Truck is not Updated.');
          }
        )

      }
      else {
   console.log("truckkkkkkkkk_object",truck);


        this.customerServiceSub = this.orderService.addTruck({...truck,...this.userNameObjCreated}).subscribe(
          (isAdded) => {
            console.log("lllllllllllllllllllllllllllllllllthis.truckIdllllllllllllllllllllllllllll", truck);

            this.asyncService.finish();
            if (isAdded) {
              this.commonService.showSuccessMsg(
                'Success! The Truck has been added successfully.'
              );
              this.close();
              window.location.reload();
            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('Error! The Truck is not added.');
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! The Truck is not added.');
          }
        );
      }

    }
  }

  close = (): void => {
    this.dialogRef.close();
  };
  ngOnDestroy(): void {
    if (this.customerServiceSub) {
      this.customerServiceSub.unsubscribe();
    }
    if (this.loadVendorSub) {
      this.loadVendorSub.unsubscribe();
    }
    this.asyncService.finish();
  }
}
