import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersBoardComponent } from './orders-board/orders-board.component';
import { OrderAddModalComponent } from './order-add-modal/order-add-modal.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrdersBoardV2Component } from './orders-board-v2/orders-board-v2.component';
import { OrderAddModifiedModalComponent } from './order-add-modified-modal/order-add-modified-modal.component';
import { OrderEditModifiedComponent } from './order-edit-modified/order-edit-modified.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { NewCustomerListComponent } from './new-customer-list/new-customer-list.component';
import { AddDriverComponent } from './add-driver/add-driver/add-driver.component';
import { DriverListComponent } from './add-driver/driver-list/driver-list.component';
import { NewTruckListtComponent } from './new-truck-listt/new-truck-listt.component';


const routes: Routes = [
  {path: '',component: OrdersBoardComponent,},
  { path: 'addOrder', component: OrderAddModifiedModalComponent },
  { path: 'editOrder', component: OrderEditModifiedComponent },
  { path: 'orderEdit', component: OrderEditComponent },

  { path: 'partner/add', component: AddPartnerComponent },
  { path: 'partner/list', component: PartnerListComponent },

  { path: 'newCustomer/list', component: NewCustomerListComponent },
  { path: 'newTruck/list', component: NewTruckListtComponent },

  { path: 'driver/add', component: AddDriverComponent },
  { path: 'driver/list', component: DriverListComponent },




  // {
  //   path: '',
  //   component: OrdersBoardV2Component,
  // },
  // { path: 'addOrder', component: OrdersBoardV2Component },
  // { path: 'orderEdit', component: OrderEditComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
