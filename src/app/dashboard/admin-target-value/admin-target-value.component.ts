import { Component, OnInit } from '@angular/core';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
interface Data {
  chart: {};
  categories: any[];
  dataset: any[];
}
const defaultData =
{
  "chart": {
    "caption": "Todays target value",
    // "subCaption": "Bakersfield Central vs Los Angeles Topanga",
    // "xAxisName": "Day",
    "theme": "fusion"
  },
  "categories": [
    {
      "category": [
        {
          "label": "week1"
        },
        {
          "label": "week2"
        },
        {
          "label": "week3"
        },
        {
          "label": "week4"
        },

      ]
    }
  ],
  "dataset": [
    {
      "seriesname": "Target Value",
      "data": [
        {
          "value": "90"
        },
        {
          "value": "33"
        },
        {
          "value": "67"
        },
        {
          "value": "10"
        },
        {
          "value": "59"
        },
      ]
    },
    {
      "seriesname": "Actual Projection",
      "data": [
        {
          "value": "40"
        },
        {
          "value": "80"
        },
        {
          "value": "20"
        },
        {
          "value": "24"
        },
        {
          "value": "58"
        },
        {
          "value": "98"
        },
        {
          "value": "18"
        }
      ]
    }
  ],

}
// const defaultData = {
//   chart: {
//     caption: "Today's Target Value",
//     // yaxisname: "% of youth on this platform",
//     // subcaption: "2012-2016",
//     // showhovereffect: "1",
//     // numbersuffix: "%",
//     // drawcrossline: "1",
//     // plottooltext: "<b>$dataValue</b> of youth were on $seriesName",
//     theme: 'fusion',
//   },
//   categories: [
//     {
//       category: [
//         {
//           label: 'Week 0',
//         },
//         // {
//         //   label: 'Week 2',
//         // },
//         // {
//         //   label: 'Week 3',
//         // },
//         // {
//         //   label: 'Week 4',
//         // },
//       ],
//     },
//   ],
//   dataset: [
//     {
//       seriesname: 'Target Value',
//       data: [
//         {
//           value: '62',
//         },
//         {
//           value: '34',
//         },
//         {
//           value: '14',
//         },
//         // {
//         //   value: '106',
//         // },
//         // {
//         //   value: '88',
//         // },
//       ],
//     },
//     {
//       seriesname: 'Actual Projection',
//       data: [
//         {
//           value: '0',
//         },
//         {
//           value: '100',
//         },
//         {
//           value: '84',
//         },
//         // {
//         //   value: '42',
//         // },
//         // {
//         //   value: '54',
//         // },
//       ],
//     },
//   ],
// };
@Component({
  selector: 'app-admin-target-value',
  templateUrl: './admin-target-value.component.html',
  styleUrls: ['./admin-target-value.component.scss']
})
export class AdminTargetValueComponent implements OnInit {

  datas: Data = {
    chart: {
      caption: "Target Value vs Actual Projection",
      // yaxisname: "% of youth on this platform",
      // subcaption: "2012-2016",
      // showhovereffect: "1",
      // numbersuffix: "%",
      // drawcrossline: "1",
      // plottooltext: "<b>$dataValue</b> of youth were on $seriesName",
      theme: 'fusion',
    }
    ,
    categories: [
      {
        category: [
          {
            label: 'Week 1',
          },
          {
            label: 'Week 2',
          },
          {
            label: 'Week 3',
          },
          {
            label: 'Week 4',
          },
        ]

      }

    ],
    dataset: [],
  };
  getTargetValueDataSub: Subscription;

  width = "100%";
  height = 200;
  type = 'msline';
  dataFormat = 'json';
  //  dataSource=defaultData;

  //dataSource: any = data;
  dataSource = this.datas;
  constructor(
    private dashBoardService: DashboardService,
    private asyncService: AsyncService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    // console.log('static datttaaaa', defaultData);

    this.loadTargetValue();
    //    console.log('dataaasourceeee', this.datas);

  }

  private loadTargetValue = (): void => {
    this.asyncService.start();
    this.getTargetValueDataSub = this.dashBoardService.getAdminTargetValueData()
      .subscribe(
        targetValueData => {
          //   console.log('target valueee data', targetValueData);
          //  if (Object.keys(targetValueData).length > 0) {
          if (targetValueData.length === 0) {
            this.dataSource = defaultData;
          }
          else {
            this.datas.dataset = targetValueData;
          }
          this.asyncService.finish();
        },
        error => {
          this.asyncService.finish();
        }
      );
  }

  ngOnDestroy(): void {
    if (this.getTargetValueDataSub) {
      this.getTargetValueDataSub.unsubscribe();
    }
  }

}
