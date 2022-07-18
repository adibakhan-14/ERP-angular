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
import { AccountService } from 'src/app/_services';


@Component({
  selector: 'app-customer-edit-modal',
  templateUrl: './customer-edit-modal.component.html',
  styleUrls: ['./customer-edit-modal.component.scss']
})
export class CustomerEditModalComponent implements OnInit {
  formId = 'customerFrom';
  username: string;
  customerServiceSub: Subscription;

  form: FormGroup;
  //_isDisabled;

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
  userNameObj: { updated_by: string; };
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private customerService: CustomerService,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<CustomerEditModalComponent>,
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
      created_at:[''],
      created_date:[''],
      customer_id:[''],
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      orientation: ['customer', [Validators.required]],
      phone: ['',[Validators.required, Validators.pattern("^((\\+88-?)|0)?[0-9]{11}$")]],
      type: ['', [Validators.required]],
      pk:[''],
      sk:[''],
      password: ['', [Validators.required]],
      picture_name: [''],
      customerCornPersonName:[''],
      customerCornPersonPhone:[''],
      
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
  


  // set isDisabled(value: boolean) {
  //   this._isDisabled = value;
  //   if(value) {
  //    this.form.controls['email'].disable();
  //   } else {
  //      this.form.controls['email'].enable();
  //    }
  //  }


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
  
 async onUpdate(customer: Customer) {
  console.log(this.username, "User Name")
  this.userNameObj = {
    updated_by : this.username
  }
    console.log("gggggggggggggggggggggggggggggggggggggggggggggggg",{...customer,...this.userNameObj})
    // if(customer.email != this.data.email )
    // {
    //   console.log(this.data.email,"AGE#####################PORE",customer.email);
      
    //   const user = await Auth.currentAuthenticatedUser();
    //   console.log(user)
    //    await Auth.updateUserAttributes(user, { email: this.email.value });
    // }
    
 


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



        observer = this.customerService.updateCustomer(customer.customer_id, {...customer,...this.userNameObj});

        console.log(customer);
      }


      this.customerServiceSub = observer.subscribe(
        (isAdded) => {
          console.log('customercustomercustomercustomer', isAdded);

         this.asyncService.finish();
          if (isAdded) {

            if (this.isPictureUploaded) {      
              console.log(isAdded);

              Storage.put(`${customer.pk}/Pictures/${customer.picture_name}`, this.file)
                .then(result => console.log(result))
                .catch(err => console.log(err));
            }
            this.commonService.showSuccessMsg(
              'Success! The Customer has been updated successfully.'
            );
            window.location.reload();
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

  close = (): void => {
    this.dialogRef.close();
  };
  ngOnDestroy(): void {
    if (this.customerServiceSub) {
      this.customerServiceSub.unsubscribe();
    }
  }
}

