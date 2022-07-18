import { Component, OnInit,OnDestroy} from '@angular/core';
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
    caption: 'Trip History',
   
    theme: 'fusion',
  },
  data: [
    {
      label: 'Today',
      value: '290',
    },
    {
      label: 'Past Week',
      value: '260',
    },
    {
      label: 'Last Month',
      value: '180',
    },
   
  ],
};

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.scss']
})
export class TripHistoryComponent implements OnInit,OnDestroy {

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
  getTripHistorySub:Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashBoardService: DashboardService,
    private asyncService: AsyncService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadTripHistoryData(id)
  }

  private loadTripHistoryData = (id:string): void => {
    this.asyncService.start();
    this.getTripHistorySub = this.dashBoardService.getCustomerDashboardTripHistoryGraphData(id)
      .subscribe(
        tripHistoryData => {
          //   console.log('target valueee data', targetValueData);
          //  if (Object.keys(targetValueData).length > 0) {
          if ( tripHistoryData.length === 0) {
            this.dataSource = defaultData;
          }
          else {
            this.datas.data=  tripHistoryData;
          }
          this.asyncService.finish();
        },
        error => {
          this.asyncService.finish();
        }
      );
  }
  ngOnDestroy(): void {
    if (this.getTripHistorySub) {
      this.getTripHistorySub.unsubscribe();
    }
  }




}
