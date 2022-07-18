import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';

@Component({
  selector: 'app-details-collected-view-modal',
  templateUrl: './details-collected-view-modal.component.html',
  styleUrls: ['./details-collected-view-modal.component.scss']
})
export class DetailsCollectedViewModalComponent implements OnInit {

  constructor(
    public asyncService: AsyncService,
    public dialogRef: MatDialogRef<DetailsCollectedViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data,'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU')
  }

}
