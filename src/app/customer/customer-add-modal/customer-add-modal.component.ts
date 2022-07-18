import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
//import { s3Upload } from "./awsLib";
import { Storage } from "aws-amplify";
import { Auth } from 'aws-amplify';


@Component({
  selector: 'app-customer-add-modal',
  templateUrl: './customer-add-modal.component.html',
  styleUrls: ['./customer-add-modal.component.scss'],
})
export class CustomerAddModalComponent implements OnInit {
  formId = 'customerFrom';

  username: any;

  customerServiceSub: Subscription;

  form: FormGroup;

  defaultImage = "/assets/images/avatar_square_blue.png";
  userPicture: string;
  userAvatar: string = this.defaultImage;
  // url:string ;
  file: File;
  imgName: string;
  //pwdPattern = "(?=.*\d)(?=.*[a-z])(?=.*[A-Z])";

  isPictureUploaded: boolean = false;
  types: any[] = [
    { name: 'Corporate', value: 'corporate' },
    { name: 'SME', value: 'sme' },
    { name: 'Individual', value: 'individual' },
  ];
  userNameObj: {};
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<CustomerAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {
    Auth.currentUserInfo().then(async user => {
      this.username = user.attributes.email;
      console.log('currentUserInfousername', user);
      console.log('currentUserInfousername', user.attributes.email);
    }).catch(err => console.log(err));
   }

  ngOnInit(): void {

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    //  phone: ['', [Validators.required]],
      phone: ['',[Validators.required, Validators.pattern("^((\\+88-?)|0)?[0-9]{11}$")]],
      type: ['', [Validators.required]],
      password: ['', [Validators.required,]],
      orientation: ['customer', [Validators.required]],
      customerCornPersonName: ['',],
      customerCornPersonPhone: ['',],
      picture_name: [''],
      updated_by : [''],
      updated_date: ['']
      // pictureUrl: [''],

    });
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  get name() {
    return this.form.get('name');
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

  get password() {
    return this.form.get('password');
  }

  get customerCornPersonName() {
    return this.form.get('customerCornPersonName');
  }

  get customerCornPersonPhone() {
    return this.form.get('customerCornPerson');
  }

  onChangeUserPicture({ target }: Event): void {
    this.isPictureUploaded = true;
    try {
      const files = (<HTMLInputElement>target).files;
      if (files && files.length > 0) {
        this.file = files[0];
        this.form.patchValue({ picture_name: this.file.name });
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = event => {
          this.userPicture = (<string>event.target["result"]).split(",")[1];
          this.userAvatar = <string>event.target["result"];
        };
      } else {
        this.form.patchValue({ picture_name: "" });
        this.userPicture = this.defaultImage;
      }
    } catch (error) { }
  }

 async onSubmit(customer: Customer) {
   console.log(this.username, "User Name")
   this.userNameObj = {
     created_by : this.username
   }
    const user = {
      username: this.email.value,
      password: this.password.value,
      attributes: {
          email: this.email.value,          // optional
        //  phone_number: contactNo.value,   // optional - E.164 number convention
          // other custom attributes
      }

    }

    if (this.form.valid) {

      if (this.isPictureUploaded) {
        function uploadPicture(file) {
          const filename = `${Date.now()}-${file.name}`;
          console.log(filename);
          customer.picture_name = <string>filename
        }
        uploadPicture(this.file)
      }

      this.asyncService.start();
      let observer = of(null);
      if (this.data) {
        // try {
        //   const user = await Auth.currentAuthenticatedUser();
        //   await Auth.updateUserAttributes(user, { email: 'juthisarker801@gmail.com' });
        //   this.commonService.showErrorMsg('updateeeee customer');

        // } catch (error) {
        //   this.commonService.showErrorMsg('Error! The Customer is not updated.');
        // }
        // observer = this.customerService.updateCustomer(
        //   this.data.customer_id,
        //   customer
        // );
      } else {
        // 2 api call here one for dynamodb and another one for cognito
        console.log('custommmerrdata',this.data);
        console.log({...customer,...this.userNameObj},'customerdataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        observer = this.customerService.addCustomer({...customer,...this.userNameObj});
         Auth.signUp(user)
        .then(data => {
      })
      }

      this.customerServiceSub = observer.subscribe(
        (data) => {
          this.asyncService.finish();
          if (data) {
            if (this.isPictureUploaded) {

          //    console.log(data.pictureName);
          console.log(data);

              Storage.put(`${data.customer_id}/Pictures/${data.picture_name}`, this.file)
                .then(result => console.log(result)) // {key: "test.txt"}
                .catch(err => console.log(err));
            }
            this.commonService.showSuccessMsg(
              'Success! The Customer has been added successfully.'
            );
           // window.location.reload();
            this.close();
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg(
              'Error! The Customer is not added.'
            );
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! The Customer is not added.');
        }
      );
    }
  }

  close = (): void => {
    this.dialogRef.close();
  };
  ngOnDestroy(): void {
    if (this.customerServiceSub) {
      this.customerServiceSub.unsubscribe();
    }

  }
}
