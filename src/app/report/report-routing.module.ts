import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChallanComponent } from './challan/challan.component';
import { OrderReportComponent } from './order-report/order-report.component';

const routes: Routes = [
  {
    path: '',
    component: OrderReportComponent,
  },
  // { path: 'challan', component: ChallanComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
