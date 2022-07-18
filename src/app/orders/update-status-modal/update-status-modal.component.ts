import { Component, OnInit,Inject } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { OrderService } from '../services/orders.service';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { InProgressComponent } from '../in-progress/in-progress.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-update-status-modal',
  templateUrl: './update-status-modal.component.html',
  styleUrls: ['./update-status-modal.component.scss']
})
export class UpdateStatusModalComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    public asyncService: AsyncService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<UpdateStatusModalComponent>,
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
        updated_by: this.data.updated_by,
        order_id:this.data.order_id,
        prev_rent_status:"n/a",
        loading_point:" ",
        unloading_point: " ",
        rent_time:" ",
        round_trip:" ",
        driver_status : " "

      },
    ];
    this.loadLeaseDataSub = this.orderService
    .getLease(this.data.order_id)
    .subscribe(
      (data) => {
        if (data) {
         // console.log('leaseeeeee data',data.information);
          this.truckData = data[0].information;
          console.log('this truckdata',this.truckData);
          let mapData:any = this.truckData.map((item) => ({
            pk: item.pk,
            sk: item.sk,
            status: "pending",
            previous_status: item.status,
            prev_rent_status: item.status,
            updated_by: this.data.updated_by,
            order_id:this.data.order_id,
            loading_point:item.truck_loading_point,
            unloading_point: item.truck_unloading_point,
            product_and_destination:item.product_and_destination,
            rent_time: item.rent_time,
            round_trip:item.round_trip,
            driver_status : "no"
          }));
          mapData = [...orderStatusUpdate, ...mapData];

          console.log('mapdata in inprogress done',mapData);

          this.updateTruckStatusSub = this.orderService
            .updateStatus(mapData)
            .subscribe(
              (data) => {
                if (data) {
                  this.asyncService.finish();
                  this.commonService.showSuccessMsg('Truck status Updated!');
               //   this.loadOrdersBoard();
              //  const dialogRef = this.dialog.open(InProgressComponent, {
              //   width: '2000px',
              //   height: '680px',
              //   data: this.data,
              // });
              // dialogRef.afterClosed().subscribe((result) => {
              //   // if (result) {
              //   //   this.loadOrdersBoard();
              //   // }
              // });
               this.close();
                } else {
                  this.asyncService.finish();
                  this.commonService.showErrorMsg('Error! Not Updated!');
                }
              },
              (error) => {
                this.asyncService.finish();
                this.commonService.showErrorMsg('Error! Not Updated!');
              }
            );
        } else {
          this.asyncService.finish();
          this.commonService.showErrorMsg(
            'Error! No lease Data could not found'
          );
        }
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg('Error! Customers could not found');
      }
    );

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
