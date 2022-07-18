import { Component, OnInit } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription, Observable } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { startWith, map } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { TargetValue } from '../models/dashboard.model';
import { DashboardService } from '../services/dashboard.service';
@Component({
  selector: 'app-target-value-add-modal',
  templateUrl: './target-value-add-modal.component.html',
  styleUrls: ['./target-value-add-modal.component.scss']
})
export class TargetValueAddModalComponent implements OnInit {
  formId = 'targetValueFrom';

  customerServiceSub: Subscription;
  addTargetValueSub: Subscription;

  form: FormGroup;
  types: any[] = [
    { name: 'Weekly', value: 'weekly' },
    { name: 'Monthly', value: 'monthly' },
  ];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private dashBoardService: DashboardService,
    public dialogRef: MatDialogRef<TargetValueAddModalComponent>
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      target_value: ['', [Validators.required]],
      orientation:['target'],
    //  target_value_type: ['', [Validators.required]],

    });
  }

  get target_value() {
    return this.form.get('target_value');
  }
  get target_value_type() {
    return this.form.get('target_value_type');
  }


  onSubmit(targetValue: TargetValue) {
    if (this.form.valid) {
      this.asyncService.start();
      this.addTargetValueSub = this.dashBoardService.addtargetValue(targetValue).subscribe(
        (isAdded) => {
          if (isAdded) {
            this.commonService.showSuccessMsg(
              'Target value added successfully.'
            );
            this.close();
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Target value is not added.');
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Target value is not added.');
        }
      );
    }
  }

  close = (): void => {
    this.dialogRef.close();
  };
  ngOnDestroy(): void {
    if (this.addTargetValueSub) {
      this.addTargetValueSub.unsubscribe();
    }
    this.asyncService.finish();
  }

}
