import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';

@Component({
  selector: 'app-order-place-view-modal',
  templateUrl: './order-place-view-modal.component.html',
  styleUrls: ['./order-place-view-modal.component.scss']
})
export class OrderPlaceViewModalComponent implements OnInit {

  constructor(
    public asyncService: AsyncService,
    public dialogRef: MatDialogRef<OrderPlaceViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data,'Here is my trip data')
  }

}
