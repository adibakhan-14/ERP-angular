import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-update-status-v2',
  templateUrl: './update-status-v2.component.html',
  styleUrls: ['./update-status-v2.component.scss']
})
export class UpdateStatusV2Component implements OnInit {

  constructor(
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<UpdateStatusV2Component>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
  truckStatusUpdateSub: Subscription;
  loadLeaseDataSub:Subscription;
  updateTruckStatusSub:Subscription;
  truckData = [];
  orderStatusUpdate(): void {
    console.log('ordersbaord/............',this.data);  
    let orderStatusUpdate = [
      {
        pk: this.data.order_id,
        sk: this.data.customer_id,
        status: 'inProgress',
        previous_status: this.data.status,
        // updated_by: this.data.updated_by,
        order_id:this.data.order_id,
        prev_rent_status:"n/a",
        truck_details: [],
        rent_time: this.data.rent_time,
        round_trip:this.data.round_trip,
        driver_status : " "
    
      },
    ];
    this.loadLeaseDataSub = this.orderService.getLease(this.data.order_id).subscribe((data)=>{
      if(data){
        this.truckData = data[0].information;
          console.log('this truckdata',this.truckData);
          let mapData = this.truckData.map((item) => ({
            pk: item.pk,
            sk: item.sk,
            status: "loadCompleted",
            previous_status: item.status,
            prev_rent_status: item.status,
            // updated_by: this.data.updated_by,
            order_id:this.data.order_id,
            truck_details: this.data.truck_details,
            rent_time: item.rent_time,
            round_trip:item.round_trip,
            driver_status : "no"
          }));
          mapData= [...orderStatusUpdate, ...mapData ]
          console.log(mapData, "EIJE AMAR MERGED MAPDATA");

          this.updateTruckStatusSub= this.orderService.updateStatus(mapData).subscribe((data)=>{
            if(data){
              this.asyncService.finish();
              this.commonService.showSuccessMsg('Truck status has been updated!!');
            }
          })


          
         
        

      }
      
      
      
    })
  
    



    

}
close = (): void => {
  this.dialogRef.close();
};
ngOnDestroy(): void {
  if (this.truckStatusUpdateSub) {
    this.truckStatusUpdateSub.unsubscribe();
  }
  if(this.loadLeaseDataSub){
    this.loadLeaseDataSub.unsubscribe();
  }
  if(this.updateTruckStatusSub){
        this.updateTruckStatusSub.unsubscribe();
  }
}


}
