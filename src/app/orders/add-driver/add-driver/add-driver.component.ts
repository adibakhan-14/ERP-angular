import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { AsyncService } from 'src/app/shared/services/async.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

import { Driver } from '../driver.model';
import { DriverService } from '../driver.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  driverForm: FormGroup;
  username: any;
  userNameObjCreated: { created_by: any; };
  userNameObjUpdated: { updated_by: any; };
  constructor(
    private driverService: DriverService,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private formBuilder: FormBuilder,
    public matDialogReference: MatDialogRef<AddDriverComponent>,
    public dialogRef: MatDialogRef<AddDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public info: Driver
  ) {
    Auth.currentUserInfo().then(async user => {
      this.username = user.attributes.email;
      console.log('currentUserInfousername', user);
      console.log('currentUserInfousername', user.attributes.email);
    }).catch(err => console.log(err));
   }

  ngOnInit(): void {
    this.driverForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      license_number: [''],
      nid_number: [''],
      // validity: [''],
      phone: ['', [Validators.required, Validators.pattern('^((\\+88-?)|0)?[0-9]{11}$')]],
      orientation: ['driver'],
      updated_by : [''],
      updated_date: [''],
      previous_status: [''],
      status: ['']
    });
    if (this.info) {
      this.driverForm.patchValue(this.info);
    }
  }
  get name() {
    return this.driverForm.get('name');
  }
  get license_number() {
    return this.driverForm.get('license_number');
  }
  get nid_number() {
    return this.driverForm.get('nid_number');
  }
  // get validity() {
  //   return this.driverForm.get('validity');
  // }
  get phone() {
    return this.driverForm.get('phone');
  }

  close = (): void => {
    this.dialogRef.close();
  }


  driverAdd(driver: Driver){
    console.log(this.username, "User Name")
    this.userNameObjCreated = {
      created_by : this.username
    }
    this.userNameObjUpdated = {
      updated_by : this.username
    }
    if (this.driverForm.valid) {
      this.asyncService.start();
      if (this.info) {
        driver.pk = this.info.pk;
        driver.sk = this.info.sk;

        console.log(driver.sk, "KI SK ASHE");

        console.log({...driver, ...this.userNameObjCreated}, "ki pacchi");


        this.driverService.driverUpdateService(
          this.info.pk,
          {...driver,...this.userNameObjUpdated}
          ).subscribe(()=>{
          this.asyncService.finish();

          this.commonService.showSuccessMsg(
            'Success! The Partner has been update successfully.'
          );
           window.location.reload();

          this.close();
        });
      } else {
        driver.status = 'returned';
        driver.previous_status= 'rented';

        console.log('driver', driver);



        this.driverService.addDriver({...driver,...this.userNameObjCreated}).subscribe(
          (data) => {
            if (data) {
              this.asyncService.finish();

              this.commonService.showSuccessMsg(
                'Success! The driver has been added successfully.'
              );
               window.location.reload();

              this.close();
            } else {
              // this.asyncService.finish();
              this.commonService.showErrorMsg(
                'Error! The driver is not added.'
              );
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg(
              'Error! The driver is not added.'
            );
          }
        );
      }

    }
  }

}
