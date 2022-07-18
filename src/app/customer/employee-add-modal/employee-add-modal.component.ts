import { Component, OnInit,Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { CustomerService } from '../services/customer.service';
import { Employee } from '../models/Employee.model';
import { Auth } from 'aws-amplify';
@Component({
  selector: 'app-employee-add-modal',
  templateUrl: './employee-add-modal.component.html',
  styleUrls: ['./employee-add-modal.component.scss']
})
export class EmployeeAddModalComponent implements OnInit,OnDestroy {

  formId = 'employeeFrom';
  customerIdList: any = [];
  customerId:string;
  employeeServiceSub: Subscription;
   loadCustomerIdSub:  Subscription;
  form: FormGroup;
  currentUserName:string;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<EmployeeAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee

  ) { }

  ngOnInit(): void {
    
    Auth.currentUserInfo().then(async user => {
      this.currentUserName = user.attributes.email;
      console.log('currentUserInfousername', user);
      console.log('currentUserInfousername', user.attributes.email);

      this.loadCustomerIdSub = this.customerService.getCustomerId(this.currentUserName).subscribe(
        (data) => {
          if (data) {
            this.customerIdList = data;
            this.customerId=data[0].customer_id;
            
            // console.log("data",data);
            // console.log("data[0]",data[0]);
            // console.log("data[0].customer_id",data[0].customer_id);

          //  this.customerId.forEach(element => console.log(element));
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg('Error! Customer id could not found');
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! Customers could not found');
        }
      );

  })
      .catch(err => console.log(err));


    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['',[Validators.required, Validators.pattern("^((\\+88-?)|0)?[0-9]{11}$")]],
     // type: ['', [Validators.required]],
      password: ['', [Validators.required]],
      orientation: ['employee', [Validators.required]],
    //  pictureName: [''],
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
  get password() {
    return this.form.get('password');
  }

  onSubmit(employee: Employee) {

    const user = {
      username: this.email.value,
      password: this.password.value,
      attributes: {
          email: this.email.value,          // optional
        //  phone_number: contactNo.value,   // optional - E.164 number convention
          // other custom attributes 
      }
    }

     employee.pk=this.email.value;
     employee.sk=this.customerId;
     employee.vendor_id=this.customerId;
    if (this.form.valid) {
  
      console.log('employeeeeee',employee);
      
      this.asyncService.start();
      let observer = of(null);
      if (this.data) {
        observer = this.customerService.updateCustomer(
          this.data.vendor_id,
          employee
        );
      } else {
        observer = this.customerService.addEmployeeVendor(employee);
        Auth.signUp(user)

      }

      this.employeeServiceSub = observer.subscribe(
        (data) => {
          this.asyncService.finish();
          if (data) {
            this.commonService.showSuccessMsg(
              'Success! The employee has been added successfully.'
            );
            this.close();
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg(
              'Error! The employee is not added.'
            );
          }
        },
        (error) => {
          this.asyncService.finish();
          this.commonService.showErrorMsg('Error! The employee is not added.');
        }
      );
     }
  }

  close = (): void => {
    this.dialogRef.close();
  };

ngOnDestroy():void{
  if (this.employeeServiceSub) {
    this.employeeServiceSub.unsubscribe();
  }
}
}
