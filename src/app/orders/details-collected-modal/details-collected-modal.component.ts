import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';

import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../models/order.model';
import { district } from 'src/app/shared/data/district';

const district_list = new district();

@Component({
  selector: 'app-details-collected-modal',
  templateUrl: './details-collected-modal.component.html',
  styleUrls: ['./details-collected-modal.component.scss'],
})
export class DetailsCollectedModalComponent implements OnInit {
  detailsCollectedSub: Subscription;
  myForm: FormGroup;
  arr: FormArray;
  unloadArr: FormArray;
  truckInfo = [];
  ordersBoardSub: Subscription;
  typeOfTrucks = [];
  loadDestination = [];
  loadDistricts = [];
  loadPoints = [];
  unloadDestination = [];
  finalTruckInfo: any;
  lengths: any[];

  distList = district_list.districtList.sort();

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

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<DetailsCollectedModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  truckTypes = this.data.truck_details;

  ngOnInit(): void {
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createLoadItem()]),
      unloadArr: this.fb.array([this.createunloadItem()]),
      truckType: ['',Validators.required],
      truckLength: ['',Validators.required],
      truckFare: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
    })

    // this.truckTypes.forEach(x => {
    //   this.typeOfTrucks.push(x.truck_type)

    // });
    // this.truckTypes.forEach(x => {
    //   this.loadDestination.push(x.destination[0].loadingPoint[0]);
    // });

    // this.truckTypes.forEach(x => {
    //   this.unloadDestination.push(x.destination[1].unloadingPoint[0]);
    // });

    // console.log(this.unloadDestination, "truckDestinationtruckDestination");




    //   this.form = this.fb.group({
    //     priceControl: ['', [Validators.required]],
    //   });
    //   console.log(this.truckTypes, "Truck Types");
    // }
    // get priceControl() {
    //   return this.form.get('priceControl');
    // }






    // addPrice(item, i) {
    //   item['fare'] = this.priceControl.value;
    //   this.truckInfo.push(item);
    // }

    // onSubmit() {



      // this.data.truck_details = this.truckInfo;

      // console.log(this.data, 'ki DATA ASHTESE EKTU DEKHI');

    //   this.data.status = 'detailsCollected';
    //   console.log('this dattttaaa', this.data);

    //   if(this.form.valid){
    //     this.detailsCollectedSub = this.orderService
    //     .updateCollectedOrder(this.data)
    //     .subscribe(
    //       (isAdded) => {
    //         if (isAdded) {
    //           this.commonService.showSuccessMsg(
    //             'Success! The order has beed created!'
    //           );


    //           console.log('hello i am loadorderBoard');

    //           this.asyncService.finish();
    //           this.close();
    //         } else {
    //           this.asyncService.finish();
    //           this.commonService.showErrorMsg('Error! The order is not created!');
    //         }
    //       },
    //       (error) => {
    //         this.asyncService.finish();
    //         this.commonService.showErrorMsg(
    //           'Error! The customer information is not added!'
    //         );
    //       }
    //     );
    //   }

    // }
    // close = (): void => {
    //   this.dialogRef.close(true);
    // };
    // ngOnDestroy(): void {
    //   if (this.detailsCollectedSub) {
    //     this.detailsCollectedSub.unsubscribe();
    //   }
    //   this.asyncService.finish();

    console.log('Hello')
  }

  createLoadItem() {
    return this.fb.group({
      loadingDistrict: ['',Validators.required],
      loadingPoint: ['',Validators.required],
      loadingPerson: ['',Validators.required],
      personContact: ['',Validators.required],
      loadingDate: ['',Validators.required],
      loadingTime: ['',Validators.required],
    })
  }

  createunloadItem() {
    return this.fb.group({
      unloadingDistrict: ['',Validators.required],
      unloadingPoint: ['',Validators.required],
      unloadingPerson: ['',Validators.required],
      unloadpersonContact: ['',Validators.required],
      unloadingDate: [''],
      unloadingTime: [''],
    })
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


  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createLoadItem());
  }
  unloadAddItem() {
    this.unloadArr = this.myForm.get('unloadArr') as FormArray;
    this.unloadArr.push(this.createunloadItem());
  }
  removeProduct(i: number, loadIndex: number){
    this.arr.removeAt(loadIndex);
  }
  removeunloadProduct(i: number, unloadIndex: number){
    this.unloadArr.removeAt(unloadIndex);
  }
  onSubmit(){
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
    this.data.truck_details =  truck_details
    this.data.status = 'detailsCollected';
    if(this.myForm.valid){
      this.detailsCollectedSub = this.orderService
      .updateCollectedOrder(this.data)
      .subscribe(
        (isAdded) => {
          if (isAdded) {
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
  }
  close = (): void => {
    this.dialogRef.close(true);
  };
  ngOnDestroy(): void {
    if (this.detailsCollectedSub) {
      this.detailsCollectedSub.unsubscribe();
    }
    this.asyncService.finish();
  }
}
