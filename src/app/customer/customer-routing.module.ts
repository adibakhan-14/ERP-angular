import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentCustomerComponent } from './component-customer/component-customer.component';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [{
  path: '', component: ComponentCustomerComponent,

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
