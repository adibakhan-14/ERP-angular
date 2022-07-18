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
    caption: 'Trip Status',
    // enablesmartlabels: '0',
    // showlabels: '0',
    // showValues: '0',
    // showpercentvalues: '0',
    // aligncaptionwithcanvas: '0',
    // captionpadding: '0',
    // decimals: '0',
    // showToolTip: '',
    // "defaultCenterLabel": "Total revenue: $64.08K",
    // "centerLabel": "Revenue from $label: $value",
    decimals: '0',
    theme: 'fusion',
  },
  data: [
    {
      label: 'Successful',
      value: '143',
    },
    {
      label: 'cancelled',
      value: '80',
    },
    {
      label: 'On progress',
      value: '115',
    },
  ],
};
@Component({
  selector: 'app-completed-trip',
  templateUrl: './completed-trip.component.html',
  styleUrls: ['./completed-trip.component.scss'],
})
export class CompletedTripComponent implements OnInit, OnDestroy {

  datas: Data = {
    chart: {
      caption: 'Trip status',
      theme: 'fusion',
    },
    data: [],
  };
  // width = '100%';
  // height = 330;
  width = '100%';
  height = 200;
  type = 'doughnut2d';
  dataFormat = 'json';
  //dataSource: any = defaultData;
  dataSource= this.datas;
  getCustomerTripCountGraphSub:Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashBoardService: DashboardService,
    private asyncService: AsyncService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  //  console.log('doughnut2dstatic trip statussssss datttaaaa', defaultData);
     this.loadCompleteTripStatus(id)
    //  console.log('doughnut2dtrip status dataaasourceeee', this.datas);
  }
  private loadCompleteTripStatus = (id:string): void => {
    this.asyncService.start();
    this.getCustomerTripCountGraphSub = this.dashBoardService.getCustomerDashboardTripStatusGraphData(id)
      .subscribe(
        tripStatusData => {
          //   console.log('target valueee data', targetValueData);
          //  if (Object.keys(targetValueData).length > 0) {
          if (tripStatusData.length === 0) {
            this.dataSource = defaultData;
          }
          else {
            this.datas.data= tripStatusData;
          }
          this.asyncService.finish();
        },
        error => {
          this.asyncService.finish();
        }
      );
  }
  
  ngOnDestroy(): void {
    if (this.getCustomerTripCountGraphSub) {
      this.getCustomerTripCountGraphSub.unsubscribe();
    }
  }

}
