import { Component, OnInit, } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Subscription} from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import * as FusionCharts from 'fusioncharts';
import { NgZone } from '@angular/core';
interface Data {
  chart: {};
  categories: any[];
  dataset: any[];
}

const categories =  [
  {
    "category": [
      { "label": "Today" },
      { "label": "Last Week" },
      { "label": "Last Month" },

    ]
  }
]
// STEP 3- Construct the dataset comprising multiple series
const dataset = [
  {
    "seriesname": "Individual",
    "data": [
      { "value": "12000" },
      { "value": "15000" },
      { "value": "23500" },

    ]
  },
  {
    "seriesname": "SME",
    "data": [
      { "value": "400" },
      { "value": "2900" },
      { "value": "8000" },

    ]
  },
  {
    "seriesname": "Corporate",
    "data": [
      { "value": "24400" },
      { "value": "8000" },
      { "value": "20800" },

    ]
  }
]




@Component({
  selector: 'app-admin-completed-trip',
  templateUrl: './admin-completed-trip.component.html',
  styleUrls: ['./admin-completed-trip.component.scss']
})
export class AdminCompletedTripComponent implements OnInit {

  constructor(
    private zone: NgZone,
    private dashBoardService: DashboardService,
    private asyncService: AsyncService,
    private commonService: CommonService,
  ) {
  // this.dataSource = {
  // "chart": {
  // "theme": "fusion",
  // "valuePadding": "5",
  // "caption": "Total Trip",
  // // "xAxisname": "Quarter",
  // // "yAxisName": "Revenues (In USD)",
  // // "numberPrefix": "\$",
  // "plotFillAlpha": "80",
  // "canvasPadding": "30",
  // "divLineIsDashed": "1",
  // "divLineDashLen": "1",
  // "divLineGapLen": "1"
  // },
  // "categories": categories,
  // "dataset": dataset,

  //     }; // end of this.dataSource

  }

  chartObj:any
  handler:any


  datas: Data = {
    "chart": {
      "theme": "fusion",
      "valuePadding": "5",
      "caption": "Total Trip",
      // "xAxisname": "Quarter",
      // "yAxisName": "Revenues (In USD)",
      // "numberPrefix": "\$",
      "plotFillAlpha": "80",
      "canvasPadding": "30",
      "divLineIsDashed": "1",
      "divLineDashLen": "1",
      "divLineGapLen": "1"
      },
    categories: categories,
    dataset: [],
  };
  dataSource = this.datas;
  getCompleteTripGraphDataSub:Subscription
  ngOnInit(): void {
  //  console.log('static trip statussssss datttaaaa', defaultData);
    this.loadAdminCompleteTripGraphData();
   // console.log('trip status dataaasourceeee', this.datas);
  }

  private loadAdminCompleteTripGraphData = (): void => {
    this.asyncService.start();
    this.  getCompleteTripGraphDataSub = this.dashBoardService. getAdminTotalCustomerTypeTripCountGraphData()
      .subscribe(
        completeTripGraphData => {
       //   console.log('target valueee data', targetValueData);
          //  if (Object.keys(targetValueData).length > 0) {

           if (
            completeTripGraphData.length === 0
          ) {
            this.datas.dataset = dataset;
          }
          else{
            this.datas.dataset = completeTripGraphData;
            console.log(completeTripGraphData);
          }

          // }
          // if (
          //   targetValueData.length=== 0
          // ) {
          //   this.dataSource = data;
          // }

          this.asyncService.finish();
        },
        error => {
          this.asyncService.finish();
        }
      );

  }


  initialized($event) {
    this.chartObj = $event.chart;
    this.handler = this.dataplotClickHandler.bind(this);
    this.chartObj.addEventListener('dataplotClick', this.handler);


}


  dataplotClickHandler(eventObj, dataObj) {
    this.zone.run(() => {
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',dataObj.categoryLabel);

    });
}


















}
