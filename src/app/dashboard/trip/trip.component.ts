import { Component, OnInit,OnDestroy } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

interface Data {
  chart: {};
  data: any[];
}
const defaultData = {
  chart: {
    caption: 'Order status',
    // subcaption: "In MMbbl = One Million barrels",
    // xaxisname: "Country",
    // yaxisname: "Reserves (MMbbl)",
    // numbersuffix: "K",
    theme: 'fusion',
  },
  data: [
    {
      label: 'Orders placed',
      value: '290',
    },
    {
      label: 'Details collected',
      value: '260',
    },
    {
      label: 'Orders confirmed',
      value: '180',
    },
    {
      label: 'Load Completed',
      value: '140',
    },
    {
      label: 'In transit',
      value: '115',
    },
    {
      label: 'Unload complete',
      value: '140',
    },
    {
      label: 'Consignment done',
      value: '115',
    },

  ],
};

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
})
export class TripComponent implements OnInit,OnDestroy {
  // width = '100%';
  // height = 230;
  // type = 'scrollstackedcolumn2d';

  datas: Data = {
    chart: {
      caption: 'Order status',
      theme: 'fusion',
    },
    data: [],
  };
  width = '100%';
  height = 200;
  type = 'column2d';
  dataFormat = 'json';
  dataSource = this.datas;
  getOrderStatusSub:Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashBoardService: DashboardService,
    private asyncService: AsyncService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
   // console.log('static trip statussssss datttaaaa', defaultData);
    this.loadOrderStatus(id)
    //console.log('trip status dataaasourceeee', this.datas);
  }
  private loadOrderStatus = (id:string): void => {
    this.asyncService.start();
    this.getOrderStatusSub = this.dashBoardService.getCustomerDashboardOrderStatusGraphData(id)
      .subscribe(
        orderStatusData => {
          //   console.log('target valueee data', targetValueData);
          //  if (Object.keys(targetValueData).length > 0) {
          if (orderStatusData.length === 0) {
            this.dataSource = defaultData;
          }
          else {
            this.datas.data= orderStatusData;
          }
          this.asyncService.finish();
        },
        error => {
          this.asyncService.finish();
        }
      );
  }
  


  ngOnDestroy(): void {
    if (this.getOrderStatusSub) {
      this.getOrderStatusSub.unsubscribe();
    }
  }
}
