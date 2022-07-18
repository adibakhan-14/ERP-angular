import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IContainer } from '../../shared/models/api-container.model';
import { Truck } from '../models/truck.model';
import { OrdersBoardItem } from '../models/orders-board-item.model';
import { Order, Product } from '../models/order.model';
const axios = require('axios').default;


@Injectable()
export class OrderService {
  constructor(private http: HttpClient) { }
  addProduct(product: any){
    return this.http.post<any>('/product', product).pipe(map((response) => (response.isExecuted && response.product ? true: false)),
    catchError((error)=> of(false))
    );
    
  }
 
  addTruck(truck: Truck): Observable<boolean> {
    // const postData = { item: truck };
    return this.http.post<any>('/truck', truck).pipe(
      map((response) => (response.isExecuted && response.data ? true : false)),
      catchError((error) => of(false))
    );
  }
  // addOrder(order: any): Observable<boolean> {
  //   // const postData = { item: order };
  //   return this.http.post<any>('/order', order).pipe(
  //     map((response) => (response.isExecuted && response.data ? true : false)),
  //     catchError((error) => of(false))
  //   );
  // }
  addOrder(order: any): Observable<boolean> {
    return this.http.post<any>('/order-challan', order).pipe(
      map((response) => (response)),
      catchError((error) => of(false))
    );
  }
  addTrip(trip: any): Observable<boolean> {
    return this.http.post<any>('/trip', trip).pipe(
      map((response) => (response)),
      catchError((error) => of(false))
    );
  }
  addTripForExcel(trip: any): Observable<boolean> {
    return this.http.post<any>('/add-trip', trip).pipe(
      map((response) => (response)),
      catchError((error) => of(false))
    );
  }
  getOrders(){
    return this.http.get<any>("/all?orientation=order").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    )
  }
  getTrips(){
    return this.http.get<any>("/all?orientation=trip").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    )
  }
  getOrdersBoard(): Observable<any[]> {
    return this.http.get<any>("/all").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }
  getProduct(): Observable<any[]>{
    return this.http.get<any>("/all?orientation=product").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    )
  }
  
  /////used it only in detailed ---collected
  updateCollectedOrder(data: any): Observable<boolean> {
    return this.http
      .patch<IContainer>("/order", data)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ? true : false
        ),
        catchError((error) => of(false))
      );
  }

  getCustomer(): Observable<any[]> {
    return this.http.get<any>("/all?orientation=customer").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }
  getVendor(): Observable<any[]> {
    return this.http.get<any>("/all?orientation=vendor").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }

  getVendorList(): Observable<any[]> {
    return this.http.get<any>("/all?orientation=vendor").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }

  getDriverList(): Observable<any[]> {
    return this.http.get<any>("/all?orientation=driver").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }

  ownTruck(): Observable<any[]> {
    return this.http.get<any>("/status?status=rented").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }
  otherTruck(): Observable<any[]> {
    return this.http.get<any>("/status?status=returned").pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }
  returnedTruck():Observable<any[]>{
    return this.http.get<any>('/status?status=returned')
      .pipe(
        map((response) => response.isExecuted && response.data ? response.data : []
      ))
  }




  addlease(lease: any): Observable<boolean> {
    // const postData = { item: order };
    return this.http.post<any>('/lease', lease).pipe(
      map((response) => (response.isExecuted && response.data ? true : false)),
      catchError((error) => of(false))
    );
  }

  updateStatus(data: any): Observable<any> {
    return this.http
      .patch<IContainer>("/status-challan", data)
      .pipe(
        map((response) =>
          response.isExecuted ? true : false
        ),
        catchError((error) => of(false))
      );
  }

  getLease(orderId: string): Observable<any> {
    return this.http.get<any>(`/object?pk=${orderId}&sk=lease`).pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : null
      ),
      catchError(error => of(null))
    );
  }

  removeLeaseItem(orderId: string, truck: any): Observable<any> {
    return this.http.patch<any>(`/remove-lease-data?pk=${orderId}&sk=lease`, truck).pipe(
      map(response =>
        response.isExecuted ? true : false
      ),
      catchError(error => of(null))
    );
  }

  getTruckStatus(orderId: string): Observable<any> {
    return this.http.get<any>(`/truck-status?order_id=${orderId}`).pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : null
      ),
      catchError(error => of(null))
    );
  }

  // getStatusChallan(truckId: string): Observable<any> {
  //   return this.http.get<any>(`/status-challan`).pipe(
  //     map(response =>
  //       response.isExecuted && response.data ? response.data : null
  //     ),
  //     catchError(error => of(null))
  //   );
  // }



  updateTruck(truckId: string, truck: any): Observable<boolean> {
    return this.http
      .patch<any>(`/update-truck?truck_id=${truckId}`, truck)
      .pipe(
        map((response) =>
          response.isExecuted ? true : false
        ),
        catchError((error) => of(false))
      );
  }

  getOrderCancelList(): Observable<Order[]> {
    return this.http.get<any>(`/status?status=orderCancelled`).pipe(
      map((response) => (response ? response.data : null)),
      catchError((error) => of(null))
    );
  }

  getOrdersBoardOnecustomer(id: string): Observable<any[]> {
    return this.http.get<any>(`/customer/orders?sk=${id}`).pipe(
      map(response =>
        response.isExecuted && response.data ? response.data : []
      ),
      catchError(error => of([]))
    );
  }

  orderObjectUpdate(order: any): Observable<boolean> {
    // const postData = { item: order };
    return this.http.post<any>('/update-order-object', order).pipe(
      map((response) => (response.isExecuted && response.data ? true : false)),
      catchError((error) => of(false))
    );
  }

  

  // updateLease(data: any, orderId: string): Observable<boolean> {
  //   return this.http
  //     .patch<IContainer>(`/update-lease-modified?pk=${orderId}&sk=lease`, data)
  //     .pipe(
  //       map((response) =>
  //         response.isExecuted ? true : false
  //       ),
  //       catchError((error) => of(false))
  //     );
  // }
  updateLease(data: any): Observable<boolean> {
    return this.http
      .patch<IContainer>("/update-lease-modified", data)
      .pipe(
        map((response) =>
          response.isExecuted && response.data ? true : false
        ),
        catchError((error) => of(false))
      );
  }

  deleteOrder(orderId: string, customerId: string): Observable<boolean> {
    return this.http
      .delete<IContainer>(`/delete-object?pk=${orderId}&sk=${customerId}`)
      .pipe(
        map((response) =>
          response.isExecuted ? true : false
        ),
        catchError((error) => of(false))
      );
  }

  sendSms(data, orderStatus) {
    let massage = ""
    let sender = "Streat Limited"
    let number = data.map((d) => d.truck_loading_phone)
    let unloadingNumber = data.map((d) => d.truck_unloading_phone)

    number.push(data[0].phone)

    data.map(async (d) => {

      switch (orderStatus) {
        case 'orderConfirmed':
          massage = `Your order number ${d.order_id} is confirmed for ${d.truckSize} Pickup Van. Vehicle ${d.truck_reg} with Driver ${d.name} is approaching to ${d.truck_loading_point} in Time. Hotline: 01955-664411`
          number.map(async (num) => {
            try {
              const { data } = await axios.post(`https://vas.banglalink.net/sendSMS/sendSMS?msisdn=${num}&message=${massage}&userID=EraTechBLsms&passwd=ERAapi@019014&sender=${sender}`);
              return true

            } catch (error) {
              return false
            }
          })
          break;
        case 'loadCompleted':
          massage = `Load complete for order number  ${d.order_id} Vehicle ${d.truck_reg} with Driver ${d.name} is approaching to unload point now. Hotline: 01955-664411`
          unloadingNumber.map(async (num) => {
            try {
              const { data } = await axios.post(`https://vas.banglalink.net/sendSMS/sendSMS?msisdn=${num}&message=${massage}&userID=EraTechBLsms&passwd=ERAapi@019014&sender=${sender}`);
              console.log(data)
            } catch (error) {
              console.log(error)
            }
          })

          break;
        case 'unloadComplete':
          massage = `Unload complete for order number  ${d.order_id}. Thanks for choosing us. Hotline: 01955-664411`
          number.map(async (num) => {
            try {
              const { data } = await axios.post(`https://vas.banglalink.net/sendSMS/sendSMS?msisdn=${num}&message=${massage}&userID=EraTechBLsms&passwd=ERAapi@019014&sender=${sender}`);
              console.log(data)
            } catch (error) {
              console.log(error)
            }
          })
          break;

        default: {

          break;
        }
      }

    }

    )



  }
}
