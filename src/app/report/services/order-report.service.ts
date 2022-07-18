
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IContainer } from '../../shared/models/api-container.model';

@Injectable()
export class OrderReportService {
  constructor(private http: HttpClient) { }

  getPdfFormat(): Observable<any> {
    return this.http.get<IContainer<string>>(`/setup-pdf-format`).pipe(
      map((response) =>
        response.isExecuted && response.data ? response.data : null
      ),
      catchError((error) => of(null))
    );
  }


  getOrdersBoard(from, to, id): Observable<any[]> {
    return this.http.get<any>(`/order-by-date?from=${from}&&to=${to}&&sk=${id}`).pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }

  getOrdersBoardRegular(from, to): Observable<any[]> {
    return this.http.get<any>(`/order-by-date?from=${from}&&to=${to}`).pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }

  // getCumulativeResult(from, to): Observable<any[]> {
  //   return this.http.get<any>(`/order-by-date?from=${from}&&to=${to}`).pipe(
  //     map(response =>
  //       response.isExecuted && response.data ? response.data : []
  //     ),
  //     catchError(error => of([]))
  //   );
  // }

  getCustomers(): Observable<any[]> {
    return this.http.get<any>(`/all?orientation=customer`).pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }

}

