import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { CustomerRoutingModule } from './customer-routing.module';
import { ComponentCustomerComponent } from './component-customer/component-customer.component';
import { CustomerAddModalComponent } from './customer-add-modal/customer-add-modal.component';
import { CustomerService } from './services/customer.service';

import { EmployeeAddModalComponent } from './employee-add-modal/employee-add-modal.component';
import { OrderService } from '../orders/services/orders.service';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderPdfService } from '../report/services/order-pdf.service';
import { OrderReportService } from '../report/services/order-report.service';
import { OrderReportComponent } from '../report/order-report/order-report.component';
import { CustomerEditModalComponent } from './customer-edit-modal/customer-edit-modal.component';
import { TruckListModalComponent } from './truck-list-modal/truck-list-modal.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { OrdercancelListComponent } from './ordercancel-list/ordercancel-list.component';

@NgModule({
  declarations: [ComponentCustomerComponent, CustomerAddModalComponent, EmployeeAddModalComponent, OrderHistoryComponent, CustomerEditModalComponent, TruckListModalComponent, CustomerListComponent, OrdercancelListComponent],
  entryComponents: [CustomerAddModalComponent, OrderReportComponent],
  imports: [SharedModule, CustomerRoutingModule],
  providers: [CustomerService, OrderService,
    //will be removed later the below code
    OrderPdfService,
    OrderReportService
  ],
})
export class CustomerModule { }
