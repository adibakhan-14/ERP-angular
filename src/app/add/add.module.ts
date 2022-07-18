import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrdersBoardComponent } from '../orders/orders-board/orders-board.component';


export const routes = [
  { path: '', component: OrdersBoardComponent, pathMatch: 'full' },

  // { path: 'partner/list', component: VendorHistoryComponent, pathMatch: 'full' },
  // { path: 'partner/add', component: VendorAddModalComponent, pathMatch: 'full' },
  // { path: 'partner/edit', component: EditCountryComponent, pathMatch: 'full' },


]


@NgModule({
  declarations: [
    // VendorHistoryComponent,
    // VendorAddModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AddModule { }
