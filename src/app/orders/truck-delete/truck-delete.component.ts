import { Component, OnInit,Inject } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-truck-delete',
  templateUrl: './truck-delete.component.html',
  styleUrls: ['./truck-delete.component.scss']
})
export class TruckDeleteComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<TruckDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  formId = 'deleteFrom';
  form: FormGroup;
  truckDeleteSub:Subscription;
  ngOnInit(): void {

    console.log('ordersjjjjjjbaord',this.data);
    this.form = this.fb.group({
      cancel: [''],
    });
  }
  get cancel() {
    return this.form.get('cancel');
  }
  

    truckCancel(data:any): void {
    
      if(this.cancel.value!="cancel"){
        this.commonService.showErrorMsg('Needed to write cancel exactly');
      }
      else{

       let mapData = [];
       mapData.push({
        pk: this.data.truck_id,
        sk: this.data.vendor_id,
        status: this.cancel.value,
    //    status: "pending",
        previous_status: this.data.status,
        prev_rent_status: this.data.status,
        updated_by: this.data.updated_by,
        order_id:this.data.order_id,
   
       });
       this.asyncService.start();
       this.truckDeleteSub = this.orderService
         .updateStatus(mapData)
         .subscribe(
           (data) => {
             if (data) {
               this.asyncService.finish();
               this.commonService.showSuccessMsg('Deleted!!!');
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
                 
      }
     }
  close = (): void => {
    this.dialogRef.close();
  };
  ngOnDestroy(): void {
    if (this.truckDeleteSub) {
      this.truckDeleteSub.unsubscribe();
    }
  }

}
