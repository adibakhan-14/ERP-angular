import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { FusionChartsModule } from 'angular-fusioncharts';

// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ComponentDashboardComponent } from './component-dashboard/component-dashboard.component';
import { CompletedTripComponent } from './completed-trip/completed-trip.component';
import { GrossProfitComponent } from './gross-profit/gross-profit.component';
import { TripComponent } from './trip/trip.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TotalCompletedTripComponent } from './total-completed-trip/total-completed-trip.component';
import { AdminCompletedTripComponent } from './admin-completed-trip/admin-completed-trip.component';
import { AdminTargetValueComponent } from './admin-target-value/admin-target-value.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TargetValueAddModalComponent } from './target-value-add-modal/target-value-add-modal.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';
import { DashboardService } from './services/dashboard.service';
import { CustomerService } from '../customer/services/customer.service';
FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
@NgModule({
  declarations: [
    ComponentDashboardComponent,
    CompletedTripComponent,
    GrossProfitComponent,
    TripComponent,
    AdminDashboardComponent,
    TotalCompletedTripComponent,
    AdminCompletedTripComponent,
    AdminTargetValueComponent,
    TargetValueAddModalComponent,
    TripHistoryComponent
  ],
  imports: [FusionChartsModule, SharedModule, DashboardRoutingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),],
    providers: [DashboardService, CustomerService ],


})
export class DashboardModule {}
