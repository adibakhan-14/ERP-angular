// import { Component, OnInit,OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { AsyncService } from 'src/app/shared/services/async.service';
// import { CommonService } from 'src/app/shared/services/common.service';
// import { DashboardService } from '../services/dashboard.service';
// @Component({
//   selector: 'app-total-completed-trip',
//   templateUrl: './total-completed-trip.component.html',
//   styleUrls: ['./total-completed-trip.component.scss']
// })
// export class TotalCompletedTripComponent implements OnInit,OnDestroy {

//  totalCompleteTripCountSub: Subscription;
// totalTripCount:string;
//   constructor(
//     private dashBoardService: DashboardService,
//     private asyncService: AsyncService,
//     private commonService: CommonService,
//   ) { }

//   ngOnInit(): void {
//     this.totalCompleteTripCount();
//   }

// private totalCompleteTripCount= (): void => {
//   this.asyncService.start();
//   this.totalCompleteTripCountSub = this.dashBoardService.getAdminTotalTripCountData().subscribe(
//     (data) => {
//       if (data) {
//        this.totalTripCount = data.totalCompleted;
       
//       }
//       this.asyncService.finish();
//     },
//     (error) => {
//       this.asyncService.finish();
//       this.commonService.showErrorMsg(
//         'Error! Completge trip data is not loaded.'
//       );
//     }
//   );
// }
// ngOnDestroy(): void {
//   if (this.totalCompleteTripCountSub) {
//     this.totalCompleteTripCountSub.unsubscribe();
//   }
//   this.asyncService.finish();
// }
// }



// import { Component, OnDestroy, OnInit } from "@angular/core";
// import * as FusionCharts from 'fusioncharts';


// const data = {
//   chart: {
//     caption: "Trip Status",
//     showlegend: "1",
//     showpercentvalues: "1",
//     legendposition: "bottom",
//     usedataplotcolorforlabels: "1",
//     theme: "fusion"
//   },
//   data: [
//     {
//       label: "In Progress",
//       value: "326"
//     },
//     {
//       label: "Successful",
//       value: "2210"
//     },
//     {
//       label: "Cancelled",
//       value: "14"
//     },
    
//   ]
// };

// @Component({
//   selector: 'app-total-completed-trip',
//   templateUrl: './total-completed-trip.component.html',
//   styleUrls: ['./total-completed-trip.component.scss']
// })
// export class TotalCompletedTripComponent implements OnInit,OnDestroy {
//   ngOnInit(): void {
//     throw new Error("Method not implemented.");
//   }

//   ngOnDestroy(): void {}
//   width = 600;
//   height = 400;
//   type = "pie2d";
//   dataFormat = "json";
//   dataSource = data;
// }





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
const data = {
  chart: {
        caption: "Trip Status",
        showlegend: "1",
        showpercentvalues: "1",
        legendposition: "bottom",
        usedataplotcolorforlabels: "1",
        theme: "fusion"
      },
  
      data: [
            {
              label: "In Progress",
              value: "326"
            },
            {
              label: "Successful",
              value: "2210"
            },
            {
              label: "Cancelled",
              value: "14"
            },
            
          ],
};

@Component({
  selector: 'app-total-completed-trip',
  templateUrl: './total-completed-trip.component.html',
  styleUrls: ['./total-completed-trip.component.scss']
})
export class TotalCompletedTripComponent implements OnInit,OnDestroy {
  datas: Data = {
    chart: {
      caption: "Trip Status",
      showlegend: "1",
      showpercentvalues: "1",
      legendposition: "bottom",
      usedataplotcolorforlabels: "1",
      theme: "fusion"
    },
    data: [],
  };

  width = 600;
  height = 400;
  type = "pie2d";
  dataFormat = "json";
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
    this.getOrderStatusSub = this.dashBoardService.getAdminTotalPercentagetData()
      .subscribe(
        orderStatusData => {
          //   console.log('target valueee data', targetValueData);
          //  if (Object.keys(targetValueData).length > 0) {
          if (orderStatusData.length === 0) {
            this.dataSource = data;
          }
          else {
          
           this.datas.data = orderStatusData;
            //this.dataSource= data;
            
           console.log("PPPPPPPPPPPPPPPPPPPPP",this.datas,"lllllllllll");
            
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













































// import { Component, OnInit,OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { AsyncService } from 'src/app/shared/services/async.service';
// import { CommonService } from 'src/app/shared/services/common.service';
// import { DashboardService } from '../services/dashboard.service';
// @Component({
//   selector: 'app-total-completed-trip',
//   templateUrl: './total-completed-trip.component.html',
//   styleUrls: ['./total-completed-trip.component.scss']
// })
// export class TotalCompletedTripComponent implements OnInit,OnDestroy {

//  totalCompleteTripCountSub: Subscription;
// totalTripCount:string;
//   constructor(
//     private dashBoardService: DashboardService,
//     private asyncService: AsyncService,
//     private commonService: CommonService,
//   ) { }

//   ngOnInit(): void {
//     this.totalCompleteTripCount();
//   }

// private totalCompleteTripCount= (): void => {
//   this.asyncService.start();
//   this.totalCompleteTripCountSub = this.dashBoardService.getAdminTotalTripCountData().subscribe(
//     (data) => {
//       if (data) {
//        this.totalTripCount = data.totalCompleted;
       
//       }
//       this.asyncService.finish();
//     },
//     (error) => {
//       this.asyncService.finish();
//       this.commonService.showErrorMsg(
//         'Error! Completge trip data is not loaded.'
//       );
//     }
//   );
// }
// ngOnDestroy(): void {
//   if (this.totalCompleteTripCountSub) {
//     this.totalCompleteTripCountSub.unsubscribe();
//   }
//   this.asyncService.finish();
// }
// }
