import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-in-progress-v2',
  templateUrl: './in-progress-v2.component.html',
  styleUrls: ['./in-progress-v2.component.scss']
})
export class InProgressV2Component implements OnInit {
  orderData;
  productAndDestination;
  constructor(public dialogRef: MatDialogRef<InProgressV2Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.orderData = data;
  }
  ngOnInit(): void {
   console.log(this.orderData)
  }
  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.orderData });
  }
}
