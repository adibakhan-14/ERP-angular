import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomValidators } from 'src/app/shared/helpers/custom.validators';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderPdfService } from '../services/order-pdf.service';
import { OrderReportService } from '../services/order-report.service';
import * as moment from 'moment';


export interface Report {
  id: string;
  name: string;
}

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {
  downloadFlag = false;
  myControl = new FormControl();
  serviceIdControl = new FormControl();
  options: Report[] = [

    { id: 'customerWiseReport', name: 'Customer Wise Report' },
    { id: 'regularReport', name: 'Trip Statement' },
  ];
  filteredOptions: Observable<any[]>;
  filteredServices: Observable<any[]>;

  pdfFormatSub: any;
  pdfFormatInfo: any;
  reportSub: any;
  serviceCenterList: any[] = [];
  viewWarehouseSub: Subscription;

  centerId: string;

  isLogo: boolean;
  isName: boolean;
  isAddress: boolean;
  isHeader: boolean;
  isFooter: boolean;
  isComma: boolean;
  isLandscape: boolean;

  from: any;
  to: any;
  warehouseIssueReportData: any;
  reportId: any;

  reportData: any = {};
  serviceId: any;

  dateFormatControl = new FormControl('', Validators.required);
  roundNumberControl = new FormControl("",
    [
      Validators.required,
      Validators.max(9),
      CustomValidators.numeric
    ]
  );
  dateFormats: any[] = [
    { value: 'YYYY-MM-DD', viewValue: 'YYYY-MM-DD' },
    { value: 'DD-MM-YYYY', viewValue: 'DD-MM-YYYY' },
    { value: 'DD-MM-YY', viewValue: 'DD-MM-YY' },
    { value: 'DD-MMM-YYYY', viewValue: 'DD-MMM-YYYY' },

  ];
  customerId: any;
  customers$: Observable<any[]> = of([]);
  constructor(
    private commonService: CommonService,
    private asyncService: AsyncService,
    private reportServices: OrderReportService,
    private pdfService: OrderPdfService
  ) { }



  ngOnInit() {
    this.asyncService.finish()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(state => (state ? this._filterStates(state) : this.options.slice()))
    );

    this.customers$ = this.reportServices.getCustomers();
  }

  onRemoveSerachFiled() {
    this.myControl.setValue('');
  }




  get dateFormat() {
    return this.dateFormatControl
  }
  get roundNumber() {
    return this.roundNumberControl
  }

  private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      state =>
        state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onSelectReport(value) {
    this.reportId = value;
    this.downloadFlag = false
    let data = this.options.find(item => item.id === value).name;
    this.myControl.patchValue(data);
  }


  fromDate(date) {
    this.from = moment(date.value).format('YYYY-MM-DD');
  }
  toDate(date) {
    this.to = moment(date.value).format('YYYY-MM-DD');
  }

  onCustomerSelected(event) {
    this.downloadFlag = false
    this.customerId = event

  }

  search() {
    this.downloadFlag = false;
    this.asyncService.start();

    if (this.reportId === 'customerWiseReport') {
      this.reportSub = this.reportServices.getOrdersBoard(this.from, this.to, this.customerId).subscribe(
        (data) => {
          if (data) {
            if (data.length > 0) {

              this.downloadFlag = true;
              this.reportData[this.reportId] = data;
            } else {
              this.commonService.showErrorMsg('No data found')
            }
            this.asyncService.finish();

          } else {
            this.commonService.showErrorMsg('Error! Report data not found.');
            this.asyncService.finish();
          }
        },
        (error) => {
          this.commonService.showErrorMsg('Error! Report data not found.');
          this.asyncService.finish();
        }
      );
    }

    else if (this.reportId === 'regularReport') {
      this.reportSub = this.reportServices.getOrdersBoardRegular(this.from, this.to).subscribe(
        (data) => {
          if (data) {
            if (data.length > 0) {

              this.downloadFlag = true;
              this.reportData[this.reportId] = data;
            } else {
              this.commonService.showErrorMsg('No data found')
            }
            this.asyncService.finish();

          } else {
            this.commonService.showErrorMsg('Error! Report data not found.');
            this.asyncService.finish();
          }
        },
        (error) => {
          this.commonService.showErrorMsg('Error! Report data not found.');
          this.asyncService.finish();
        }
      );
    }
  }

  openPDF() {
    let pdfFormatInfo = {
      isLogo: this.isLogo,
      isName: this.isName,
      isAddress: this.isAddress,
      isHeader: this.isHeader,
      isFooter: this.isFooter,
      isComma: this.isComma,
      isLandscape: this.isLandscape,
      dateFormat: this.dateFormatControl.value,
      roundValue: this.roundNumberControl.value
    }

    if (this.reportId === 'customerWiseReport') {
      this.pdfService.orderSummery({
        pdfFormatInfo,
        apiData: this.reportData[this.reportId],
        from: this.from,
        to: this.to
      })
    }

    else if (this.reportId === 'regularReport') {
      this.pdfService.orderSummery({
        pdfFormatInfo,
        apiData: this.reportData[this.reportId],
        from: this.from,
        to: this.to
      })
    }
  }

}