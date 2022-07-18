import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

// const defaultData = {
//   chart: {
//     caption: 'Gross Profit',
//     //  enablesmartlabels: '0',
//     // showlabels: '0',
//     // showValues: '0',
//     // showpercentvalues: '0',
//     // showToolTip: '0',
//     // aligncaptionwithcanvas: '0',
//     // captionpadding: '0',
//     // decimals: '1',
//     theme: 'fusion',
//   },
//   data: [
//     // {
//     //   label: 'No Data',
//     //   value: '1'
//     // }
//     {
//       label: 'Profit',
//       value: '390',
//     },
//     {
//       label: 'Loss',
//       value: '60',
//     },
//   ],
// };
@Component({
  selector: 'app-gross-profit',
  templateUrl: './gross-profit.component.html',
  styleUrls: ['./gross-profit.component.scss'],
})
export class GrossProfitComponent implements OnInit,OnDestroy {
  width = '100%';
  height = 200;
  type = 'doughnut3d';
  dataFormat = 'json';
  // dataSource: any = defaultData;
  getCustomerTotalTripCountSub:Subscription;
  totalCustomerTripCount:string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashBoardService: DashboardService,
    private asyncService: AsyncService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.totalCustomerCompleteTripCount(id)
  }

  private totalCustomerCompleteTripCount= (id:string): void => {
    this.asyncService.start();
    this.getCustomerTotalTripCountSub = this.dashBoardService.getCustomerDashboardTotalCompleteTripCountData(id).subscribe(
      (data) => {
        if (data) {
         this.totalCustomerTripCount = data.totalCompleted;

        }
        this.asyncService.finish();
      },
      (error) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg(
          'Error! Completge trip data is not loaded.'
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.getCustomerTotalTripCountSub) {
      this.getCustomerTotalTripCountSub.unsubscribe();
    }
  }
}
