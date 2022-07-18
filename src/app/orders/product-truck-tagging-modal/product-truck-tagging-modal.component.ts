import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';
import { TripChallanModalComponent } from '../trip-challan-modal/trip-challan-modal.component';

@Component({
  selector: 'app-product-truck-tagging-modal',
  templateUrl: './product-truck-tagging-modal.component.html',
  styleUrls: ['./product-truck-tagging-modal.component.scss']
})
export class ProductTruckTaggingModalComponent implements OnInit {
  leaseSub: Subscription;
  leaseData = [];
  finalData:any
  inTransitSub: Subscription;
  inProgress=[];
  form: FormGroup;
  productName=[];
  productWeight=[];
  productQuantity=[];
  updateLeaseSub: Subscription;

  truckInfo=this.data.truck_details;
  

  constructor(
    public asyncService: AsyncService,
    private orderService: OrderService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductTruckTaggingModalComponent>,
    public dialog: MatDialog,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
   
  ) { }

  ngOnInit(): void {
    

    this.leaseSub = this.orderService
    .getLease(this.data.order_id)
    .subscribe((data) => {
      this.leaseData = data;
      this.finalData=this.leaseData[0].information[0].truck_details
      console.log(this.leaseData[0].information[0].truck_details,'llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll')
    });

    this.form = this.fb.group({
      product_name: ['', [Validators.required]],
      product_quantity: [''],
      product_weight: ['']
    });
    this.dataLengthCount()
  }

        ///////////////////////////////////////////////////
        tableForm: FormArray = this.fb.array([]);
        addRow() {
          const row = this.fb.group({
            product_name: ["", [Validators.required]],
            product_quantity: ["", [Validators.required]],
            product_weight: ["", [Validators.required]],
          });
          this.tableForm.push(row);
        }
        get groups(): FormGroup[] {
          return this.tableForm.controls as FormGroup[]
        }
    
        dataLengthCount(){
          for (let variable in this.data.truck_details) {
            this.addRow()
          }
        }
      /////////////////////////////////////////////////////

  get product_name(){
    return this.form.get('product_name')
  }
  get product_weight(){
    return this.form.get('product_weight')
  }
  get product_quantity(){
    return this.form.get('product_quantity')
  }



  challan(id) {
    const dialogRef = this.dialog.open(TripChallanModalComponent, {
      width: '500px',
      data: {
        data_by_orderId : this.leaseData,
        trip_id: id,
      },
    });
  }
  addProductName(item, i){
    item['product_name'] = this.product_name.value;
    this.productName.push(item);
  }
  addProductWeight(item, i){
    item['product_weight']= this.product_weight.value;
    this.productWeight.push(item);
  }
  addProductQuantity(item, i){
    item['product_quantity']= this.product_quantity.value;
    this.productQuantity.push(item);
  }
  
  checker(){
    console.log(this.tableForm.value,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
  }
  onSubmit(){

    //console.log(this.leaseData, "leaseDataleaseDataleaseDataleaseData");
    const leaseObject= {
      created_at: this.data.created_at,
      created_date: this.data.created_date,
      information: [],
      order_id: this.data.order_id,
      orientation: "lease",
      pk: this.data.pk,
      sk: "lease"
    }
    this.tableForm.value.forEach((element, index) => {
      let data = {...this.leaseData[0].information[index],...element}
      leaseObject.information.push(data)
    });

    console.log(leaseObject, "Amar banano object");

    this.updateLeaseSub = this.orderService
    .updateLease(leaseObject)
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
    let objectToUpdate= this.data;
    console.log(objectToUpdate);
    this.inProgress.push({
      pk: this.data.order_id,
      sk: this.data.customer_id,
      name: this.data.name,
      status: 'inTransit',
      previous_status: this.data.status,
      updated_by: this.data.updated_by,
      order_id: this.data.order_id,
      prev_rent_status: 'n/a',
      truck_details: this.data.truck_details,
      rent_time: this.data.rent_time,
      round_trip: this.data.round_trip,
      driver_status: this.data.driver_status,
    });
    console.log(this.inProgress, "this.inProgressthis.inProgressthis.inProgress");
    this.inTransitSub = this.orderService
    .updateStatus(this.inProgress)
    .subscribe((data) => {
      if (data) {
        this.commonService.showSuccessMsg('Board Updated!!!');
        this.close();
      }
    });
  }
  close = (): void => {
    this.dialogRef.close(true);
  };

}
