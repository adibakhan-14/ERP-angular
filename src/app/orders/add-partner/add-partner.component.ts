import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { CustomerService } from 'src/app/customer/services/customer.service';
// import { CustomerService } from '../services/customer.service';
import { Vendor } from '../../customer/models/vendor.model';
import { UploadService } from './upload.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {
  formId = 'vendorFrom';

  vendorServiceSub: Subscription;

  form: FormGroup;
  toFile;
  toFileAggree;

  file: File;

  isLicenseUploaded: boolean = false;

  types: any[] = [
    { vendor_name: 'Owner', value: 'owner' },
    { vendor_name: 'Agent', value: 'agent' },
    { vendor_name: 'Broker', value: 'broker' },
    { vendor_name: 'Agent with own truck', value: 'agentWithOwnTruck' },
  ];
  username: any;
  userNameObjCreated: { created_by: any; };
  userNameObjUpdated: { updated_by: any; };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<AddPartnerComponent>,
    private uploadService: UploadService,
    @Inject(MAT_DIALOG_DATA) public data: Vendor
  ) {
    Auth.currentUserInfo().then(async user => {
      this.username = user.attributes.email;
      console.log('currentUserInfousername', user);
      console.log('currentUserInfousername', user.attributes.email);
    }).catch(err => console.log(err));
  }

  ngOnInit(): void {
    console.log('=========data=======', this.data);
    this.form = this.fb.group({
      vendor_name: ['', [Validators.required]],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern("^((\\+88-?)|0)?[0-9]{11}$")]],
      type: ['', [Validators.required]],
      trade_license:[''],
      agreement: [''],
      orientation: ['vendor', [Validators.required]],
      concernPersonName: ['',],
      concernPersonPhone: ['',],
      updated_by : [''],
      updated_date: ['']
    });
    if (this.data) {
      this.form.patchValue(this.data);
      const fileName= this.data.trade_license._fileNames;
      console.log(fileName, "fileName");
    }
    // const getFiles= this.uploadService.downloadFile()
  }

  get vendor_name() {
    return this.form.get('vendor_name');
  }

  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  get type() {
    return this.form.get('type');
  }
  get trade_license(){
    return this.form.get('trade_license');
  }
  get agreement(){
    return this.form.get('agreement');
  }

  get concernPersonName() {
    return this.form.get('concernPersonName');
  }

  get concernPersonPhone() {
    return this.form.get('concernPersonPhone');
  }






  // onSubmit(vendor: Vendor){
  //   console.log(this.username, "User Name")
  //   this.userNameObjCreated = {
  //     created_by : this.username
  //   }
  //   this.userNameObjUpdated = {
  //     updated_by : this.username
  //   }
  //   console.log( {...vendor,...this.userNameObjUpdated},'check the object')
  // }
  onChange(event){
    this.isLicenseUploaded = true;
    this.toFile= event.target.files
  }

  onSubmit(vendor: Vendor) {
    console.log(this.username, "User Name")
    this.userNameObjCreated = {
      created_by : this.username,
    }
    this.userNameObjUpdated = {
      updated_by : this.username
    }
    if (this.form.valid) {

      // const agreement= this.toFileAggree.item(0);
      if (this.isLicenseUploaded) {

        console.log("GOT INSIDE LICENSE UPLOAD");

          const file = this.toFile.item(0);
          this.uploadService.fileUpload(file);


      }




      this.asyncService.start();
      if (this.data) {
        vendor.pk = this.data.pk;
        vendor.sk = this.data.sk;
        // vendor.trade_license= this.uploadService.fileUpload(trade_license);
        // vendor.agreement= this.uploadService.fileUpload(agreement);
        this.customerService.updateVendor(
          this.data.pk,

          {...vendor,...this.userNameObjUpdated}
        ).subscribe(() => {
          this.asyncService.finish();

          this.commonService.showSuccessMsg(
            'Success! The Partner has been update successfully.'
          );
           window.location.reload();

          this.close();
        });
      } else {
       this.customerService.addVendor({...vendor,...this.userNameObjCreated}).subscribe(
          (data) => {
            if (data) {
              this.asyncService.finish();
              console.log({...vendor,...this.userNameObjCreated}, "customer dataaaaaa");


              this.commonService.showSuccessMsg(
                'Success! The Truck Partner has been added successfully.'
              );
             window.location.reload();

              this.close();
            } else {
              //this.asyncService.finish();
              this.commonService.showErrorMsg(
                'Error! The Truck Partner is not added.'
              );
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg(
              'Error! The Truck Partner is not added.'
            );
          }
        );
      }

    }
  }


  close = (): void => {
    this.dialogRef.close();
  };

  ngOnDestroy(): void {
    if (this.vendorServiceSub) {
      this.vendorServiceSub.unsubscribe();
    }
    this.asyncService.finish();
  }

}
