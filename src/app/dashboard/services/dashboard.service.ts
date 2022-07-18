import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IContainer } from '../../shared/models/api-container.model';
import { TargetValue } from '../models/dashboard.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  addtargetValue(data: TargetValue): Observable<boolean> {
    return this.http
      .post<any>('/target', data)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ? true : false
        ),
        catchError((error) => of(false))
      );
  }

  getAdminTargetValueData(): Observable<any> {
    return this.http.get<any>('/c/target').pipe(
      map((response) => response ? response.data: null,
       // console.log('see the response',response)
       ),
      catchError((error) => of(null))
    );
  }
  getAdminTotalCustomerTypeTripCountGraphData(): Observable<any> {
    return this.http.get<any>('/admin/customer-trip-count').pipe(
      map((response) => response ? response.data: null,
       // console.log('see the response',response)
       ),
      catchError((error) => of(null))
    );
  }
  getAdminTotalTripCountData(): Observable<any> {
   // return this.http.get<any>("/admin/trip").pipe(
    return this.http.get<any>("/admin/total-truck-trip").pipe(
      map((response) =>
        response ? response: null,
  // console.log('see the response',response)
      ),
      catchError(error => of(null))
    );
  }

  getAdminTotalPercentagetData(): Observable<any> {
    return this.http.get<any>("/admin/trip-graph").pipe(
      map((response) =>
        response ? response.data: null,
      ),
      catchError(error => of(null))
    );
  }

  Allorderstatus(): Observable<any> {
    return this.http.get<any>(`/admin/all-order-status`).pipe(
      map((response) => (response ? response.data : null)),
      catchError((error) => of(null))
    );
  }


  getCustomerDashboardOrderStatusGraphData(customerId:string): Observable<any> {
    return this.http.get<any>(`/s/c/trip?sk=${customerId}`).pipe(
      map((response) => response ? response.data: null,
       ),
      catchError((error) => of(null))
    );
  }
  getCustomerDashboardTripHistoryGraphData(customerId:string): Observable<any> {

    return this.http.get<any>(`/c/c/status?sk=${customerId}`).pipe(
      map((response) => response ? response.data: null,
       ),
      catchError((error) => of(null))
    );
  }



  getCustomerDashboardTripStatusGraphData(customerId:string): Observable<any> {
    //have to change the api path ahere
    return this.http.get<any>(`/g/c/trip?sk=${customerId}`).pipe(
      map((response) =>
        response ? response.data: null,

      ),
      catchError(error => of(null))
    );
  }
  getCustomerDashboardTotalCompleteTripCountData(customerId:string): Observable<any> {
    return this.http.get<any>(`/client/total-truck-trip-count?sk=${customerId}`).pipe(
      map((response) =>
        response ? response: null,
      ),
      catchError(error => of(null))
    );
  }



}
