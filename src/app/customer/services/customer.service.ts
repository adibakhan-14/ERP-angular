import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IContainer } from '../../shared/models/api-container.model';
import { Vendor } from '../models/vendor.model';
import { Customer } from '../models/customer.model';
import { Employee } from '../models/Employee.model';
import { TruckList } from 'src/app/orders/models/truck.model';




@Injectable()
export class CustomerService {
  constructor(private http: HttpClient) {}

  addCustomer(data: Customer): Observable<Customer> {
    if (data.picture_name === '') {
      delete data.picture_name;
    }
   // const postData = { item: data };
    return this.http
      .post<any>('/customer', data)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ? response.data : null
        ),
        catchError((error) => of(null))
      );
  }

  addEmployeeVendor(data: Employee): Observable<boolean> {
    if (data.picture_name === '') {
      delete data.picture_name;
    }
    return this.http
      .post<any>('/v/employee', data)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ?true : false
        ),
        catchError((error) => of(false))
      );
  }

  addEmployeeCustomer(data: Customer): Observable<boolean> {
    if (data.picture_name === '') {
      delete data.picture_name;
    }
    return this.http
      .post<any>('/c/employee', data)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ?true : false
        ),
        catchError((error) => of(false))
      );
  }

  addVendor(data: Vendor): Observable<boolean> {
    const postData = { item: data };
    return this.http
      .post<any>('/vendor', data)
      .pipe(
        map((response) => (response)
          // response.isExecuted || response.data ? true : false
        ),
        catchError((error) => of(false))
      );
  }
  updateCustomer(id: string, customer: Customer): Observable<boolean> {
    return this.http
      .patch<any>(`/update-customer?customer_id=${id}`,customer)
      .pipe(
        map((response) =>
         // response.isExecuted && response.data ? true : false
         response.isExecuted  ? true : false
        ),
        catchError((error) => of(false))
      );
  }
  updateVendor(id: string, vendor: Vendor): Observable<boolean> {
    return this.http
      .patch<any>(`/update-vendor?vendor_id=${id}`, vendor)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ? true : false
        ),
        catchError((error) => of(false))
      );
  }
  getCustomerList(): Observable<Customer[]> {
    return this.http.get<any>(`/all?orientation=customer`).pipe(
      map((response) => (response ? response.data : null)),
      catchError((error) => of(null))
    );
  }








  getCustomerId(currentUserName:string): Observable<any> {
    return this.http.get<any>(`/object?pk=${currentUserName}`).pipe(
      map((response) => (response ? response.data : null)),
      catchError((error) => of(null))
    );
  }

  getAllOrderList()
  {
    return this.http.get<any>(`/all?orientation=order`).pipe(
      map((response) => (response ? response.data : null)),
      catchError((error) => of(null))

    )
  }



}

