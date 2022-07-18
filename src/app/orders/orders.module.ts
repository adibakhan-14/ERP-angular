import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OrdersRoutingModule } from './orders-routing.module';

import { OrdersBoardItemComponent } from './components/orders-board-item.component';
import { TrucksBoardItemComponent } from './components/trucks-board-item.component';
import { OrdersBoardComponent } from './orders-board/orders-board.component';
import { CustomerAddModalComponent } from '../customer/customer-add-modal/customer-add-modal.component';
import { TruckAddModalComponent } from './truck-add-modal/truck-add-modal.component';
import { OrderAddModalComponent } from './order-add-modal/order-add-modal.component';
import { CustomerService } from '../customer/services/customer.service';
import { OrderService } from './services/orders.service';
import { DetailsCollectedModalComponent } from './details-collected-modal/details-collected-modal.component';
import { OrderConfirmedModalComponent } from './order-confirmed-modal/order-confirmed-modal.component';
import { OrderDetailShowComponent } from './order-detail-show/order-detail-show.component';
import { OrderDeleteComponent } from './order-delete/order-delete.component';
import { OrderConfirmModifiedComponent } from './order-confirm-modified/order-confirm-modified.component';
import { InProgressComponent } from './in-progress/in-progress.component';
import { UpdateStatusModalComponent } from './update-status-modal/update-status-modal.component';
import { TruckDeleteComponent } from './truck-delete/truck-delete.component';
import { TruckBoardComponent } from './truck-board/truck-board.component';
import { OrderDeleteModComponent } from './order-delete-mod/order-delete-mod.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { ProductAddModalComponent } from './product-add-modal/product-add-modal.component';
import { OrdersBoardV2Component } from './orders-board-v2/orders-board-v2.component';
import { InProgressV2Component } from './in-progress-v2/in-progress-v2.component';
import { InProgressFormComponent } from './in-progress-form/in-progress-form.component';
import { OrderDataTableComponent } from './order-data-table/order-data-table.component';
import { OrderAddModifiedModalComponent } from './order-add-modified-modal/order-add-modified-modal.component';
import { UpdateStatusV2Component } from './update-status-v2/update-status-v2.component';
import { LoadCompleteModalComponent } from './load-complete-modal/load-complete-modal.component';
import { InTransitModalComponent } from './in-transit-modal/in-transit-modal.component';
import { UnloadCompleteModalComponent } from './unload-complete-modal/unload-complete-modal.component';
import { ChallanModalComponent } from './challan-modal/challan-modal.component';
import { OrderPlaceViewModalComponent } from './order-place-view-modal/order-place-view-modal.component';
import { ProductTruckTaggingModalComponent } from './product-truck-tagging-modal/product-truck-tagging-modal.component';
import { TripChallanModalComponent } from './trip-challan-modal/trip-challan-modal.component';
import { ProductTruckSuccessfullModalComponent } from './product-truck-successfull-modal/product-truck-successfull-modal.component';
import { OrderEditModifiedComponent } from './order-edit-modified/order-edit-modified.component';
import { OrderPlaceViewLeaseModalComponent } from './order-place-view-lease-modal/order-place-view-lease-modal.component';
import { DetailsCollectedViewModalComponent } from './details-collected-view-modal/details-collected-view-modal.component';
import { OrderConfirmedViewModalComponent } from './order-confirmed-view-modal/order-confirmed-view-modal.component';
import { NewOrderConfirmModifiedComponent } from './new-order-confirm-modified/new-order-confirm-modified.component';
import { NewTruckTaggingModalComponent } from './new-truck-tagging-modal/new-truck-tagging-modal.component';
import { TripUnsuccessfullComponent } from './trip-unsuccessfull/trip-unsuccessfull.component';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { AddDriverComponent } from './add-driver/add-driver/add-driver.component';
import { DriverListComponent } from './add-driver/driver-list/driver-list.component';
import { NewCustomerListComponent } from './new-customer-list/new-customer-list.component';
import { NewTruckListtComponent } from './new-truck-listt/new-truck-listt.component';
import { DailyTripStatementComponent } from './daily-trip-statement/daily-trip-statement.component';
import { NewTruckEditComponent } from './new-truck-edit/new-truck-edit.component';
import { TruckEditModalComponent } from './truck-edit-modal/truck-edit-modal.component';
import { PartnerEditModalComponent } from './partner-edit-modal/partner-edit-modal.component';


@NgModule({
  declarations: [
    OrdersBoardComponent,
    OrdersBoardItemComponent,
    TrucksBoardItemComponent,
    TruckAddModalComponent,
    OrderAddModalComponent,
    DetailsCollectedModalComponent,
    OrderConfirmedModalComponent,
    OrderDetailShowComponent,
    OrderDeleteComponent,
    OrderConfirmModifiedComponent,
    InProgressComponent,
    UpdateStatusModalComponent,
    TruckDeleteComponent,
    TruckBoardComponent,
    OrderDeleteModComponent,
    OrderEditComponent,
    ProductAddModalComponent,
    OrdersBoardV2Component,
    InProgressV2Component,
    InProgressFormComponent,
    OrderDataTableComponent,
    OrderAddModifiedModalComponent,
    UpdateStatusV2Component,
    LoadCompleteModalComponent,
    InTransitModalComponent,
    UnloadCompleteModalComponent,
    ChallanModalComponent,
    OrderPlaceViewModalComponent,
    ProductTruckTaggingModalComponent,
    TripChallanModalComponent,
    ProductTruckSuccessfullModalComponent,
    OrderEditModifiedComponent,
    OrderPlaceViewLeaseModalComponent,
    DetailsCollectedViewModalComponent,
    OrderConfirmedViewModalComponent,
    NewOrderConfirmModifiedComponent,
    NewTruckTaggingModalComponent,
    TripUnsuccessfullComponent,
    AddPartnerComponent,
    PartnerListComponent,
    AddDriverComponent,
    DriverListComponent,
    NewCustomerListComponent,
    NewTruckListtComponent,
    DailyTripStatementComponent,
    NewTruckEditComponent,
    TruckEditModalComponent,
    PartnerEditModalComponent,

  ],
  entryComponents: [
    CustomerAddModalComponent,
    TruckAddModalComponent,
    OrderAddModalComponent,
    DetailsCollectedModalComponent,
    OrderConfirmedModalComponent,
    OrderEditComponent,
    OrderDataTableComponent,
  ],
  imports: [SharedModule, OrdersRoutingModule,
  ],
  providers: [CustomerService,OrderService],
})
export class OrdersModule {}
