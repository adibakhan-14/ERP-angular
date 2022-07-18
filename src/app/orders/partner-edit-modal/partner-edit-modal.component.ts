import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { CustomerService } from 'src/app/customer/services/customer.service';
// import { CustomerService } from '../services/customer.service';
import { Vendor } from '../../customer/models/vendor.model';
import { DownloadService } from './download.service';
import { Auth } from 'aws-amplify';
import { UploadService } from '../add-partner/upload.service';
// import { UploadService } from './upload.service';


@Component({
  selector: 'app-partner-edit-modal',
  templateUrl: './partner-edit-modal.component.html',
  styleUrls: ['./partner-edit-modal.component.scss']
})
export class PartnerEditModalComponent implements OnInit {
  formId = 'vendorFrom';

  vendorServiceSub: Subscription;

  username
  isLicenseUploaded: boolean = false;
  form: FormGroup;
  toFile;
  tradeLicense;
  s3Url;
  trade_licenseUrl;
  agreementUrl;
  agreement;
  userNameObjUpdated: { updated_by: any; };


  userNameObjCreated: { created_by: any; };
  hiddenStatus: boolean = false;


  constructor(   private fb: FormBuilder,
    private uploadService: UploadService,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<PartnerEditModalComponent>,
    public downloadFile: DownloadService,
    @Inject(MAT_DIALOG_DATA) public data: Vendor) {
      Auth.currentUserInfo().then(async user => {
        this.username = user.attributes.email;
        console.log('currentUserInfousername', user);
        console.log('currentUserInfousername', user.attributes.email);
      }).catch(err => console.log(err));
     }

    types: any[] = [
      { vendor_name: 'Owner', value: 'owner' },
      { vendor_name: 'Agent', value: 'agent' },
      { vendor_name: 'Broker', value: 'broker' },
      { vendor_name: 'Agent with own truck', value: 'agentWithOwnTruck' },
    ];


  ngOnInit(): void {
    console.log(this.data);


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
    });

    if (this.data) {
      this.form.patchValue(this.data);
       this.tradeLicense= this.data.trade_license._fileNames;
       this.agreement=this.data.agreement._fileNames;
       this.s3Url = 'https://truckload-admin-backend-staging-attachmentsbucket-lcsfm639gu89.s3.ap-southeast-1.amazonaws.com/';

    }
     this.trade_licenseUrl= `${this.s3Url}${this.tradeLicense}`
     this.agreementUrl= `${this.s3Url}${this.agreement}`

     console.log(this.data.trade_license._fileNames,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
  }

  buttonCall(){
    this.hiddenStatus = true
    console.log(this.hiddenStatus)
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


get concernPersonName() {
  return this.form.get('concernPersonName');
}


get concernPersonPhone() {
  return this.form.get('concernPersonPhone');
}

onChange(event){
  this.isLicenseUploaded = true;
  this.toFile= event.target.files
}

 download(){
  this.downloadFile.downloadFile(File)
 }


onSubmit(vendor: Vendor){
  console.log(this.username, "User Name")
  this.userNameObjCreated = {
    created_by : this.username
  }
  this.userNameObjUpdated = {
    updated_by : this.username
  }

  if (this.isLicenseUploaded) {

    console.log("GOT INSIDE LICENSE UPLOAD");

      const file = this.toFile.item(0);
      this.uploadService.fileUpload(file);


  }
console.log('hellooooo');

vendor.pk = this.data.pk;
vendor.sk = this.data.sk;

 this.userNameObjUpdated = {
      updated_by : this.username
    }

console.log( {...vendor,...this.userNameObjUpdated});


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


}
close = (): void => {
  this.dialogRef.close();
};


}