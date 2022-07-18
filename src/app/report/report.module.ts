import { NgModule } from '@angular/core';
import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderReportComponent } from './order-report/order-report.component';
import { OrderPdfService } from './services/order-pdf.service';
import { OrderReportService } from './services/order-report.service';


@NgModule({
declarations: [OrderReportComponent],
imports: [
SharedModule,
ReportRoutingModule
],
providers: [OrderPdfService, OrderReportService]
})
export class ReportModule { }