import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientRequest } from 'http';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/orders/services/orders.service';
import { imgBase64 } from 'src/logo';

@Component({
  selector: 'app-trip-challan-modal',
  templateUrl: './trip-challan-modal.component.html',
  styleUrls: ['./trip-challan-modal.component.scss']
})
export class TripChallanModalComponent implements OnInit {
  leaseSub: Subscription;

  disabled = false;
  trigger = true;

  leaseData = [];
  orderData = [];
  docDefinition: any;
  constructor(
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
   }

  ngOnInit(): void {
    console.log(this.data, 'Data of the corresponding trip')
    this.generatePdf()
  }

  checkingFunction(value: any){
    console.log(value)
    if(value===true){
      this.trigger = true
    }else{
      this.trigger = false
    }
  }

  generatePdf(){
    var status;
    if(this.data.status === 'inTransit'){
      status= 'At Intransit Point';
    }else if (this.data.status === 'unloadComplete'){
      status = 'At Unload Point';
    }else{
      status = 'At Success Point';
    }

    var deviceTime = new Date();

    const numWords = require('num-words');
    const word = numWords(this.data.truck_details.truck_fare);
    const finalWord = word.charAt(0).toUpperCase() + word.slice(1);

    const totalRent = parseInt(this.data.truck_details.truck_fare);
    const finalTotalRent=totalRent.toLocaleString('en-IN')

    var createdData =moment(this.data.created_date).format('DD/MM/YYYY');

    var loadingPerson = []
    this.data.truck_details.loading_points.map(data=>{
      var dataRow = []
      dataRow.push(data.loadingPerson)
      loadingPerson.push(dataRow)
    })
    var unloadingPerson = []
    this.data.truck_details.unloading_points.map(data=>{
      var dataRow = []
      dataRow.push(data.unloadingPerson)
      unloadingPerson.push(dataRow)
    })

    var loadingPoint = []
    this.data.truck_details.loading_points.map(data=>{
      var dataRow = []
      dataRow.push(data.loadingPoint)
      loadingPoint.push(dataRow)
    })
    var unloadingPoint = []
    this.data.truck_details.unloading_points.map(data=>{
      var dataRow = []
      dataRow.push(data.unloadingPoint)
      unloadingPoint.push(dataRow)
    })

    var loadPersonContact = []
    this.data.truck_details.loading_points.map(data=>{
      var dataRow = []
      dataRow.push(data.personContact)
      loadPersonContact.push(dataRow)
    })
    var unloadPersonContact = []
    this.data.truck_details.unloading_points.map(data=>{
      var dataRow = []
      dataRow.push(data.unloadpersonContact)
      unloadPersonContact.push(dataRow)
    })

    var productNumber = []
    this.data.truck_details.product.arr.map((data, index)=>{
      var dataRow = []
      dataRow.push(index+1)
      productNumber.push(dataRow)
    })

    var productName = []
    this.data.truck_details.product.arr.map((data, index)=>{
      var dataRow = []
      dataRow.push(data.productName)
      productName.push(dataRow)
    })

    var productQuantity = []
    this.data.truck_details.product.arr.map(data=>{
      var dataRow = []
      dataRow.push(data.productQuantity)
      productQuantity.push(dataRow)
    })

    var productWeight = []
    this.data.truck_details.product.arr.map(data=>{
      var dataRow = []
      dataRow.push(data.productWeight)
      productWeight.push(dataRow)
    })

    this.docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 135, 40, 60],
      header: [
        {
          columns: [
            [
              {
                image: 'imgBase64',
                width: 130,
              },
              {
                text: 'www.streatlogistics.com.bd',
                fontSize: 10,
                bold: false,
                alignment: 'left',
              },
              {
                text: `Order No: ${this.data.order_id}`,
                fontSize: 10,
                bold: false,
                alignment: 'left',
                margin: [0, 10, 0, 0],
              },
              {
                text: `Trip No: ${this.data.trip_id}`,
                fontSize: 10,
                bold: false,
                alignment: 'left',
                margin: [0, 0, 0, 0],
                layout: 'fixed',
              },
              {
                text: `Customer\'s Name: ${this.data.name}`,
                fontSize: 10,
                bold: false,
                alignment: 'left',
                margin: [0, 0, 0, 0],
              },
            ],
            [
              {
                text: 'Challan',
                fontSize: 18,
                bold: false,
                alignment: 'center',
                margin: [0, 75, 0, 0],
              },
              {
                text: `${status}`,
                fontSize: 10,
                bold: false,
                alignment: 'center',
                margin: [0, 1, 0, 0],
              },
            ],
            [
              {
                text: 'Streat Limited',
                fontSize: 25,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              {
                text: '427/1 Tejgaon, Industrial area, Dhaka, 1215',
                fontSize: 8,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              {
                text: '+880 01955664411',
                fontSize: 8,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              {
                text: 'hello@streatlogistics.com.bd',
                fontSize: 8,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              '\n',
              {
                text: `Date: ${createdData}`,
                fontSize: 8,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
            ],
          ],
          margin: [39, 20, 42, 0]
        },
      ],
      content:[
        {
          table: {
            widths: [76, 76, 76, 76, 76, 76],
            //heights: [, , , , 150],
            body: [
              [
                {
                  text: "Loading Person",
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: loadingPerson,
               },
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {},
                {
                  text: "Unloading Person",
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: unloadingPerson,
               },
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {},
              ],
              [
                {
                  text: 'Loading Person Contact',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: loadPersonContact,
               },
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {},
                {
                  text: 'Unloading Person Contact',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: unloadPersonContact,
               },
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {},
              ],
              [
                {
                  text: 'Loading Address',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: loadingPoint,
               },
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {},
                {
                  text: 'Unloading Address',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: unloadingPoint,
               },
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {},
              ],
            ],
          },
        },
        {
          table: {
            widths: [30, 30, 168, 76, 76, 76],
            heights: [, 150, , , ],
            body: [
              [
                { text: 'Sl.No.', style: '', colSpan: 0, alignment: 'center', bold: true, fillColor: '#C9C9C9',fontSize: 10,},
                {
                  text: 'Product Description',
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                  bold: true,
                  fillColor: '#C9C9C9',
                  fontSize: 10,
                },
                {},
                {
                  text: 'Carton/Drum',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fillColor: '#C9C9C9',
                  fontSize: 10,
                },
                { text: 'Weight', style: '', colSpan: 0, alignment: 'center', bold: true, fillColor: '#C9C9C9', fontSize: 10,},
                { text: 'Taka', style: '', colSpan: 0, alignment: 'center', bold: true, fillColor: '#C9C9C9', fontSize: 10,},
              ],
              [
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: productNumber,
               },
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: productName,
               },
                  style: '',
                  colSpan: 2,
                  alignment: 'left',
                  layout: 'noBorders',
                },
                {},
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: productQuantity,
               },
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {
                  fontSize: 10,
                  table: {
                    widths: ['100%'],
                    body: productWeight,
               },
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                  layout: 'noBorders',
                },
                {
                  fontSize: 10,
                  text: `${finalTotalRent}`,
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                },
              ],
              [
                { text: ``, style: '', colSpan: 4, alignment: 'center' },
                {},
                {},
                {},
                {
                  text: 'Total Rent:',
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  text: `${finalTotalRent}`,
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                },
              ],
              [
                { text: ``, style: '', colSpan: 4, alignment: 'center' },
                {},
                {},
                {},
                {
                  text: 'Advance:',
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ``,
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                },
              ],
              [
                { text: ``, style: '', colSpan: 4, alignment: 'center' },
                {},
                {},
                {},
                {
                  text: 'Due:',
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ``,
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                },
              ],
              [
                {
                  text: 'In Word',
                  style: {},
                  colSpan: 2,
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                },
                {},
                {
                  fontSize: 10,
                  text: `${finalWord} taka only`,
                  style: {},
                  colSpan: 4,
                  alignment: 'center',
                 },
                {},
                {},
                {},
              ],
              [
                {
                  text: 'Driver Name',
                  style: {},
                  colSpan: 2,
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                },
                {},
                {
                  fontSize: 10,
                  text: `${this.data.truck_details.driver_name}`,
                  style: {},
                  colSpan: 1,
                  alignment: 'left',
                },
                {
                  text: 'Driver Phone',
                  style: {},
                  colSpan: 0,
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                },
                {
                  fontSize: 10,
                  text: `${this.data.truck_details.driver_phone}`,
                  style: {},
                  colSpan: 2,
                  alignment: 'left',
                },
                {},
              ],
              [
                {
                  text: 'Truck Reg',
                  style: {},
                  colSpan: 2,
                  alignment: 'left',
                  bold: true,
                  fontSize: 10,
                },
                {},
                {
                  fontSize: 10,
                  text: `${this.data.truck_details.truck_reg}`,
                  style: {},
                  colSpan: 4,
                  alignment: 'center',
                 },
                {},
                {},
                {},
              ],
            ],
          },
        },
        {
          text: `Dispute Note: No Dispute`,
          fontSize: 10,
          alignment: 'left',
          margin: [0, 10, 0, 0],
        },
        {
          text: `All the aforementioned products are taken into my consideration`,
          fontSize: 10,
          alignment: 'left',
          margin: [0, 10, 0, 0],
        },
        { text: 'Conditions:\n', style: '', fontSize: 10, bold: true},
        {
          type: 'square',
          fontSize: 7,
          ul: [
            'All price is in BDT and excluding AIT, VAT, TAX & any other charges.',
            'The demurrage will be charged BDT2000 for each truck and BDT 3000 for each Trailer for the delay (after 6 hrs of reaching & upto 12 hours) at Load & Unload point and other standard demurrage policies will be applicable.',
            'If no issues raised in written within 03 days, will be considered this trip successfully completed.',
            'Any unavoidable circumstances, ie: political or natural disasters, Fuel or Toll price hikes, or issue arising in between the shipment OR during any festival (ie: before & after 20 days of EID), any amendment of rates in the agreement shall be fixed by the mutual understanding of both parties.',
            'The customer is responsible to declare the products type and nature, If the declared product and the supplied product differ customer is solely responsible for the products legitimacy, the responsibility for the undeclared or illegal product lies not with Streat Limited.',
            'If any law or regulation is imposed by the government and it leads to an increase in Transportation costs, then both parties will arrange for a re-negotiation of fare.',
          ]
        },
        '\n\n\n',
        {
          columns: [
            [
              {
                text: ` ______________________________`,
                fontSize: 10,
                alignment: 'center',
              },
              {
                text: ` Driver\'s Signature`,
                fontSize: 10,
                alignment: 'center',
              },
            ],
            [
              {
                text: ` ______________________________`,
                fontSize: 10,
                alignment: 'center',
              },
              {
                text: ` Receiver\'s Name & Sinature`,
                fontSize: 10,
                alignment: 'center',
              },
            ],
            [
              {
                text: ` ______________________________`,
                fontSize: 10,
                alignment: 'center',
              },
              {
                text: 'On Behalf of Streat Ltd',
                fontSize: 10,
                alignment: 'center',
              },
            ],
          ],
        },
      ],
      // footer:[
      //   { text: `An Initiative of Rangs Group`,
      //   style: '',
      //   alignment: 'center',
      //   fontSize: 15,
      //   margin:[0,10,0,0]
      //   },
      //   { text: `${deviceTime}`,
      //     style: '',
      //     alignment: 'center',
      //     fontSize: 8,
      //     margin:[0,10,0,0]
      //   },
      // ],
      footer: function (currentPage, pageCount) {
        return {
          margin: [10, 10, 40, 10],
          columns: [
            {
              fontSize: 9,
              text: [
                { text: `An Initiative of Rangs Group`,
                style: '',
                alignment: 'center',
                fontSize: 15,
                margin:[0,10,0,0]
                },
                '\n',
                { text: `${deviceTime}`,
                  style: '',
                  alignment: 'center',
                  fontSize: 8,
                  margin:[0,10,0,0]
                },
                '\n',
                {
                  text:
                    '-------------------------------------------\nPage' +
                    currentPage.toString() +
                    ' of ' +
                    pageCount,
                },
              ],
              alignment: 'center',
            },
          ],
        };
      },
      images: {
        imgBase64: imgBase64,
      },
      styles: {
        header: {
          bold: true,
          fontSize: 15,
        },
      },
      defaultStyle: {
        fontSize: 12,
      },
    }
  }
  buttonCall(): any {
    console.log('hello world');
    pdfMake.createPdf(this.docDefinition).open();
  }

}
