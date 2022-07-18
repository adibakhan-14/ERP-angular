import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'aws-amplify';
import { first } from 'rxjs/operators';
import { AccountService } from '../_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../shared/services/common.service';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  toVerifyEmail: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    public snackBar: MatSnackBar,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', Validators.required],
      groupName: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
  get email() {
    return this.form.get('email');
  }
  get groupName() {
    return this.form.get('groupName');
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const user = {
      username: this.username.value,
      password: this.password.value,
      attributes: {
          email: this.username.value,
          // 'custom:groupName': this.groupName.value       // optional
        //  phone_number: contactNo.value,   // optional - E.164 number convention
          // other custom attributes
      }, 
      
    }
    this.loading = true;
    Auth.signUp(user)
    .then(data => {
      console.log(data, "adibaaaaaaaaa eita dataaaaa");

      // this.toVerifyEmail = true;
      // this.signstatus = "";
      this.commonService.showSuccessMsg('You Registered successfully!');
          this.router.navigate(['../login'], { relativeTo: this.route });

    })
    .catch(err => {
      console.log(err);
      this.commonService.showErrorMsg('Username/Password Incorrect');
      this.loading = false;
    });


    this.accountService
      .register(this.form.value)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log('reggggggggdattttttaaaaa',data);

          this.commonService.showSuccessMsg('You Registered successfully!');
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        (error) => {
          this.commonService.showErrorMsg(error);
          this.loading = false;
        }
      );

  }
}
