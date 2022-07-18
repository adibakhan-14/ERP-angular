import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, forkJoin } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TruckList } from '../models/truck.model';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { map } from 'rxjs-compat/operator/map';

@Component({
  selector: 'app-order-confirmed-modal',
  templateUrl: './order-confirmed-modal.component.html',
  styleUrls: ['./order-confirmed-modal.component.scss'],
})
export class OrderConfirmedModalComponent implements OnInit {
  formId = 'detailsCollectedFrom';

  form: FormGroup;
  orderConfirmedSub: Subscription;
  orderLeaseSub: Subscription;

  submitFlag: boolean;
  requiredTruckCount: number;
  truckTypes = [];
  truckProvide = [];
  truckFilter = [];

  types: any[] = [
    { name: 'Covered', value: 'covered' },
    { name: 'Open', value: 'open' },
  ];

  capacitiesForCovered: any[] = [
    { name: '7 ft', length: '7', weight: '1.5 ton', cbm: '3' },
    { name: '9 ft', length: '9', weight: '2.5 ton', cbm: '6' },
    { name: '12 ft', length: '12', weight: '4 ton', cbm: '10' },
    { name: '16 ft', length: '16', weight: '10 ton', cbm: '15' },
    { name: '23 ft', length: '23', weight: '12.5 ton', cbm: '32' },
  ];
  capacitiesForOpen: any[] = [
    { name: '7 ft', length: '7', weight: '1.5 ton' },
    { name: '9 ft', length: '9', weight: '3 ton' },
    { name: '12 ft', length: '12', weight: '6 ton' },
    { name: '14 ft', length: '14', weight: '8 ton' },
    { name: '18 ft', length: '18', weight: '13 ton' },
    { name: '20 ft', length: '20', weight: '15 ton' },
  ];

  lengths: any[];
  truckData: TruckList[] = [];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderConfirmedModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdersBoardItem
  ) {}

  ngOnInit(): void {
    console.log('order confirmed dataaa',this.data);
    
    let ownTruck = this.orderService.ownTruck();
    let otherTruck = this.orderService.otherTruck();
    forkJoin([ownTruck, otherTruck]).subscribe((results) => {
      this.truckData = [...results[0], ...results[1]];
      if(this.truckData.length===0){
        this.asyncService.finish();
      }
    });

    if(this.truckData.length)

    console.log('truckdata-FROM APIIIIII---',this.truckData);
    
    this.form = this.fb.group({
      length: [''],
      weight: [''],
      cbm: [''],
      type: [''],
      // capacity: [''],
      truck_reg: [''],
    });
    this.truckTypes = this.data.truck_details;
    


    console.log('truckTypes------',this.truckTypes );
  }

  // get capacity() {
  //   return this.form.get('capacity');
  // }
  
  get length() {
    return this.form.get('length');
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
  get truck_reg() {
    return this.form.get('truck_reg');
  }

  // getCapacity(capacity) {
  //   this.type.patchValue('');
  // }

  typeValue(event) {
    // console.log('what drop down event are there',event);
    if(event==='covered')
    {
      this.lengths = this.capacitiesForCovered;
      this.type.patchValue('covered');
    }
    else{
       this.lengths = this.capacitiesForOpen;
       this.type.patchValue('open');
    }
  }

  capacityInfo(event) {
    console.log('kono bal er evnt ki print hoi ?',event);
    this.length.patchValue(event);
    this.weight.patchValue(event.weight);
    if (event.cbm) {
      this.cbm.patchValue(event.cbm);
    } else {
      this.cbm.patchValue('');
    }
console.log('thiss.....truckdata',this.truckData);
console.log('wqnnna see the type value',this.type.value );

    this.truckFilter = this.truckData.filter(
      (item) => item.type === this.type.value && item.length === event.length && item.weight===event.weight 
    );

    console.log('filterrdataaaa',this.truckFilter);
    
  }
  // getType(type) {
  //   this.truckFilter = this.truckData.filter(
  //     (item) => item.type === type && item.capacity === this.capacity.value
  //   );
  // }
  addItem() {
    if (this.length.value && this.type.value && this.truck_reg.value&&this.weight.value) {
      const itemData = this.truckData.find(
        (item) => item.truck_reg === this.truck_reg.value
      );
      console.log('adibaaaaaaaaaaaaaa',itemData);
      
      const item = {
        length: this.length.value.length,
        type: this.type.value,
        weight:this.weight.value,
        truck_reg: this.truck_reg.value,
        truck_id: itemData.truck_id,
        device_id: itemData.device_id ? itemData.device_id : undefined,
        orientation: itemData.orientation,
        vendor_name: itemData.vendor_name,
        vendor_id: itemData.vendor_id,
        status:itemData.status,
      };
      if (!this.truckProvide.find((i) => i.truck_reg === item.truck_reg)) {
        this.truckProvide = [item, ...this.truckProvide];

        console.log('truck provide',this.truckProvide );
        
      } else {
        this.commonService.showErrorMsg('Item already added!!!!');
      }
      this.length.patchValue('');
      this.type.patchValue('');
      this.weight.patchValue('');
      this.truck_reg.patchValue('');
      this.truckFilter = [];
    } else {
      this.commonService.showErrorMsg('All feilds required!');
    }
  }

  deleteItem(index) {
    this.truckProvide.splice(index, 1);
  }

  onSubmit(confirmed) {
    // validation logic
    this.submitFlag = true;
    this.requiredTruckCount = 0;
    this.truckTypes.forEach((item) => {
      this.requiredTruckCount += parseInt(item.quantity);
      const data = this.truckProvide.filter(
        (i) => i.length === item.length && i.type === item.type && i.weight=== item.weight
      );

      if (data.length !== parseInt(item.quantity)) {
        this.submitFlag = false;
        this.commonService.showErrorMsg('Check properly !!!');
      }
    });
    // end validation logic

    if (
      this.submitFlag &&
      this.requiredTruckCount === this.truckProvide.length
    ) {
      this.asyncService.start();
      let mapData = this.truckProvide.map((item) => ({
        pk: item.truck_id,
        sk: item.vendor_id,
        status: item.orientation === 'own' ? 'notAvailable' : 'rented',
        previous_status:item.status,
        updated_by: this.data.updated_by,
      }));


      const leaseObj = {
        order_id: this.data.order_id,
        orientation: 'lease',
        information: mapData,
      };

      console.log('leaseobj',leaseObj);
      
      this.orderLeaseSub = this.orderService.addlease(leaseObj).subscribe(
        (data) => {
          // let mapdataStatus={
          //   pk: this.data.order_id,
          //   sk: this.data.customer_id,
          //   status: 'orderConfirmed',
          //   previous_status:this.data.status,
          //  updated_by: this.data.updated_by,
          // }
          if (data) {
           mapData.push({
            pk: this.data.order_id,
            sk: this.data.customer_id,
            status: 'orderConfirmed',
            previous_status:this.data.status,
            updated_by: this.data.updated_by,
          }); 
            console.log('mappppdata',mapData);
            this.orderConfirmedSub = this.orderService
              .updateStatus(mapData)
              .subscribe(
                (data) => {
                  if (data) {
                    this.asyncService.finish();
                    this.commonService.showSuccessMsg('Board Updated!!!');
                    this.close();
                  } else {
                    this.asyncService.finish();
                    this.commonService.showErrorMsg('Error! Not Updated!!');
                  }
                },
                (error) => {
                  
                  this.asyncService.finish();
                  this.commonService.showErrorMsg('Error! Not Updated!!');
                }
              );
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Lease not created!!');
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Lease not created!!');
        }
      );
    } else {
      this.commonService.showErrorMsg('Check properly !!!');
    }
  }

  close = (): void => {
    this.dialogRef.close(true);
  };

  ngOnDestroy(): void {
    if (this.orderLeaseSub) {
      this.orderLeaseSub.unsubscribe();
    }
    if (this.orderConfirmedSub) {
      this.orderConfirmedSub.unsubscribe();
    }
    this.asyncService.finish();
  }
}
