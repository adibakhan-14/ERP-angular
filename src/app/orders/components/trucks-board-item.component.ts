import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TruckBoardItem } from '../models/truck-board-item-model';
import { FormControl } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import * as moment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { TruckList } from '../models/truck.model';
import { OrderService } from '../services/orders.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'trucks-board-item',
  template: `
    <div style="cursor: pointer;">
      <div *ngIf="truck.truck_reg !== undefined; else elseBlock">
        <p>
          Truck Reg No: {{ truck && truck.truck_reg ? truck.truck_reg : '' }}
        </p>
        <hr style="width:100%;border-width:1px;color:#F7F5F5;background-color:#F7F5F5;">
        <p>Vendor Name : {{ truck?.vendor_name }}</p>
        <hr style="width:100%;border-width:1px;color:#F7F5F5;background-color:#F7F5F5;">
        <p>Loading Point : {{ truck?.loading_point }}</p>
        <hr style="width:100%;border-width:1px;color:#F7F5F5;background-color:#F7F5F5;">
        <p>Unloading Point : {{ truck?.unloading_point }}</p>
        <hr style="width:100%;border-width:1px;color:#F7F5F5;background-color:#F7F5F5;">
        <p>Rent time : {{ truck?.rent_time }}</p>
      </div>
      <ng-template #elseBlock>
        <p>Loading Point : {{ truck?.truck_loading_point }}</p>
        <hr style="width:100%;border-width:1px;color:#F7F5F5;background-color:#F7F5F5;">
        <p>Unloading Point : {{ truck?.truck_unloading_point }}</p>
        <button
          mat-icon-button
          (click)="onSubmit()"
          aria-label="Example icon button with a menu icon"
        >
          <mat-icon>check_circle_outline</mat-icon>
        </button>
        <div>
          <mat-form-field
            fxFlex="0 1 calc(30% - 10px)"
            fxFlex.lt-md="0 1 calc(50% - 10px)"
            fxFlex.lt-sm="100%"
            fxFlex.xs="100%"
            appearance="fill"
          >
            <mat-label>Search Truck</mat-label>
            <input
              matInput
              placeholder="Truck reg | Phone"
              aria-label="State"
              [matAutocomplete]="auto"
              [formControl]="customerControl"
            />
            <mat-icon matSuffix>search</mat-icon>
            <mat-autocomplete
              #auto="matAutocomplete"
              (optionSelected)="onSelectCustomer($event.option.value)"
            >
              <mat-option
                *ngFor="let state of filteredStates | async"
                [value]="state.trip_id"
              >
                <!-- <img class="example-option-img" aria-hidden [src]="state.image_path" height="25" /> -->
                <span>{{ state.truck_reg }}</span>
                |
                <small> {{ state.trip_id }}</small>
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
    p {
      font-size: 12px;
      font-family:Lato;
      }
    `,
  ],
})
export class TrucksBoardItemComponent implements OnInit {
  constructor(
    private router: Router,
    private orderService: OrderService,
    public asyncService: AsyncService,
    private commonService: CommonService,
  ) {}
  @Input() truck: TruckBoardItem;
  @Input() data: any;
  @Output() onDatePicked = new EventEmitter<any>();
  customerControl = new FormControl();
  filteredStates: Observable<TruckList[]>;
  leaseObject;
  truckData: TruckList[] = [];
  updateLeaseSub: Subscription;
  truckStatusSub: Subscription;
  removeTruckSub: Subscription;
  isClicked: boolean;
  leaseData = [];
  ngOnInit(): void {
    console.log('===order data===', this.data);

    let ownTruck = this.orderService.ownTruck();
    let otherTruck = this.orderService.otherTruck();
    forkJoin([ownTruck, otherTruck]).subscribe((results) => {
      this.truckData = [...results[0], ...results[1]];
      this.filteredStates = this.customerControl.valueChanges.pipe(
        startWith(''),
        map((state) =>
          state ? this._filterStates(state) : this.truckData.slice()
        )
      );
    });
  }

  public pickDate(date: any): void {
    this.onDatePicked.emit(date);
}
  private _filterStates(value: string): TruckList[] {
    const filterValue = value.toLowerCase();
    return this.truckData.filter(
      (state) =>
        state.truck_reg.toLowerCase().indexOf(filterValue) === 0 ||
        state.trip_id.toLowerCase().indexOf(filterValue) === 0
    );
  }
  onSelectCustomer(id) {
    // const truck = this.truckData.find((item) => item.truck_reg === id);
    //  this.truckTypes

    const truck = this.truckData.find((item) => item.trip_id === id);
    console.log('========truck=========', truck);
    if (truck.truck_reg !== undefined) {
      this.leaseObject = {
        pk: truck.trip_id,
        sk: truck.vendor_id,
        truck_reg: truck.truck_reg,
        status: truck.orientation === 'own' ? 'notAvailable' : 'rented',
        previous_status: truck.status,
        prev_rent_status:
          truck.orientation === 'own' ? 'available' : 'returned',
        updated_by: this.data.updated_by,
        order_id: this.data.order_id,
        truck_loading_point: this.truck.truck_loading_point,
        truck_unloading_point: this.truck.truck_unloading_point,
        truck_starting_date: this.truck.truck_starting_date,
        truck_loading_date: this.truck. truck_loading_date,
        trip_id: truck.trip_id,
        orientation: truck.orientation,
        vendor_id: truck.vendor_id,
        rent_time: moment(Date.now()).format(),
        round_trip: 'no',
      };
      this.leaseData.push(this.leaseObject);
    }
  }
  onSubmit() {
    this.asyncService.start();
    let mapData=this.leaseData.map((item) => ({
      pk: item.trip_id,
      sk: item.vendor_id,
      status: "pending",
      previous_status: item.status,
      prev_rent_status: item.orientation === 'own' ? 'available' : 'returned',
      updated_by: this.data.updated_by,
      order_id: this.data.order_id,
      loading_point: item.truck_loading_point,
      unloading_point: item.truck_unloading_point,
      rent_time: item.rent_time,
      round_trip: item.round_trip,
    }));
    // this.updateLeaseSub = this.orderService
    //   .updateLease( this.leaseData , this.data.order_id)
    //   .subscribe((value) => {
    //     if (value) {
    //       this.removeTruckSub = this.orderService
    //       .removeLeaseItem(this.data.pk,value)
    //       .subscribe(
    //         (data) => {
    //           if (data) {
    //             this.isClicked=true;
    //             this.pickDate(this.isClicked);
    //             this.asyncService.finish();
    //             this.commonService.showSuccessMsg(' Updated!!!');
    //           } else {
    //             this.asyncService.finish();
    //             this.commonService.showErrorMsg('Error! Not Updated!!');
    //           }
    //         },
    //         (error) => {
    //           this.asyncService.finish();
    //           this.commonService.showErrorMsg('Error! Not Updated!!');
    //         }
    //       );

    //       this.truckStatusSub = this.orderService
    //           .updateStatus(mapData)
    //           .subscribe(
    //             (data) => {
    //               if (data) {
    //                 this.asyncService.finish();
    //                 this.commonService.showSuccessMsg(' Updated!!!');
    //               } else {
    //                 this.asyncService.finish();
    //                 this.commonService.showErrorMsg('Error! Not Updated!!');
    //               }
    //             },
    //             (error) => {
    //               this.asyncService.finish();
    //               this.commonService.showErrorMsg('Error! Not Updated!!');
    //             }
    //           );
    //     }
    //   });
  }
  ngOnDestroy(): void {
    if (this.updateLeaseSub) {
      this.updateLeaseSub.unsubscribe();
    }
    if (this.truckStatusSub) {
      this.truckStatusSub.unsubscribe();
    }
    if (this.removeTruckSub) {
      this.removeTruckSub.unsubscribe();
    }
    this.asyncService.finish();
  }
}
