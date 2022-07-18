import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver } from './driver.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient) { }

  driverAddService(data: Driver){
    return this.http.post<any>('/driver', data);
  }



  addDriver(data: any): Observable<any> {
    return this.http
      .post<any>('/driver', data).pipe(map((response) => (response.isExecuted && response.data ? true : false)),
      catchError((error) => of(false)));
  }


  getDriverList(): Observable<any> {
    return this.http.get<any>(`/all?orientation=driver`).pipe(
      map((response) => (response ? response.data : null)),
      catchError((error) => of(null))
    );
  }



  driverUpdateService(id: string, driver: Driver): Observable<boolean> {
    return this.http
      .patch<any>(`/update-driver?driver_id=${id}`, driver)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ? true : false
        ),
        catchError((error) => of(false))
      );
  }
  driverGetAllService(){}

}
