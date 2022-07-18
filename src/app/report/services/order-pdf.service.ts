
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as logo from './logo.js';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { style } from '@angular/animations';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class OrderPdfService {
  constructor() { }

  formatMoney(amount, decimalCount, isComma) {
    let decimal = ".";
    let thousands = ",";
    try {
      if (!isComma) {
        thousands = '';
      }
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - parseInt(i)).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

  orderSummery(data) {
    console.log(data, 'service');
    var apiData = data.apiData
    var fromDate = moment(data.from).format('DD/MM/YYYY');
    var toDate = moment(data.to).format('DD/MM/YYYY');

    var table = [];
    var vendor_fare_arr = [];
    var truck_fare_arr = [];
    var totalSumOfVendorFare;
    var totalSumOfTruckFare;

    apiData.map((data, index) => {
      var row = [];
      var loadPoints = [];
      var unloadPoints = [];
      var truck_reg;
      var vendor_name;
      var vendor_fare;
      var truck_fare;



      if (data.hasOwnProperty('truck_details')) {
        if (data.truck_details.hasOwnProperty('loading_points')) {
          data.truck_details.loading_points.map(lp => {
            loadPoints.push(lp.loadingPoint ? lp.loadingPoint : "")
          })
        } else {
          loadPoints.push("")
        }
      }

      if (data.hasOwnProperty('truck_details')) {
        if (data.truck_details.hasOwnProperty('unloading_points')) {
          data.truck_details.unloading_points.map(lp => {
            unloadPoints.push(lp.unloadingPoint ? lp.unloadingPoint : "")
          })
        } else {
          unloadPoints.push("")
        }
      }

      if (data.hasOwnProperty('truck_details')) {
        truck_reg = data.truck_details.truck_reg
      } else {
        truck_reg = ""
      }

      if (data.hasOwnProperty('truck_details')) {
        if (data.truck_details.hasOwnProperty('vendor_name')) {
          vendor_name = data.truck_details.vendor_name
        } else {
          vendor_name = ""
        }
      } else {
        vendor_name = ""
      }

      if (data.hasOwnProperty('truck_details')) {
        if (data.truck_details.hasOwnProperty('vendor_fare')) {
          vendor_fare = parseInt(data.truck_details.vendor_fare).toLocaleString('en-IN')
          vendor_fare_arr.push(parseInt(data.truck_details.vendor_fare))
        } else {
          vendor_fare = ""
        }
      } else {
        vendor_fare = ""
      }

      if (data.hasOwnProperty('truck_details')) {
        if (data.truck_details.hasOwnProperty('truck_fare')) {
          truck_fare = parseInt(data.truck_details.truck_fare).toLocaleString('en-IN')
          truck_fare_arr.push(parseInt(data.truck_details.truck_fare))
        } else {
          truck_fare = ""
        }
      } else {
        truck_fare = ""
      }


      row.push(index+1, data.trip_id ? data.trip_id : "", data.name ? data.name : "", loadPoints ? loadPoints : "", unloadPoints ? unloadPoints : "", truck_reg, vendor_name, vendor_fare, truck_fare)
      table.push(row)
    })
    console.log(table)
    totalSumOfVendorFare = vendor_fare_arr.reduce((partialSum,a)=>partialSum + a, 0)
    totalSumOfTruckFare = truck_fare_arr.reduce((partialSum,a)=>partialSum + a, 0)

    let docDefinition = {
      pageSize: 'A4',
      // pageMargins: [L, T, R, B],
      pageMargins: [35, 60, 35, 60],
      header: [
        {
          columns: [
            [
              {
                text: 'Streat Limited',
                fontSize: 18,
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Overall Trip Statement',
                fontSize: 12,
                bold: true,
                alignment: 'center',
              },
              {
                text: `From: ${fromDate}  To: ${toDate}`,
                fontSize: 12,
                bold: true,
                alignment: 'center',
              },
            ],
          ],
          // margin: [39, 20, 42, 0]
        },
      ],
      footer: [
        {
          text: `An Initiative of Rangs Group`,
          style: '',
          alignment: 'center',
          fontSize: 15,
          margin: [0, 0, 0, 0]
        },
        '\n',
        {
          text: `${new Date()}`,
          style: '',
          alignment: 'center',
          fontSize: 8,
          margin: [0, 0, 0, 0]
        },
      ],
      content: [
        {
          fontSize: 10,
          fillColor: '#87ceeb',
          table: {
            widths: [10,54, 54, 54, 54, 54, 54, 54, 54],
            bold: true,
            fillColor: '#C9C9C9',
            body: [
              ['SL', 'Trip Number', 'Client Name', 'Loading Point', 'Unloading Point', 'Vehicle No & Size', 'Partner', 'Partner Fare in tk', 'Client Fare in tk'],
            ]
          },
        },
        {
          fontSize: 8,
          table: {
            widths: [10,54, 54, 54, 54, 54, 54, 54, 54],
            bold: true,
            fillColor: '#C9C9C9',
            body: table,
          },
        },
        {
          fontSize: 8,
          table: {
            widths: [10,54, 54, 54, 54, 54, 54, 54, 54],
            bold: true,
            fillColor: '#C9C9C9',
            body: [
            [
              {
                text: "Total Partner & Client fare",
                style: '',
                colSpan: 7,
                alignment: 'center',
                bold: true,
                fontSize: 8,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {
                text: `${totalSumOfVendorFare.toLocaleString('en-IN')}`,
                style: '',
                colSpan: 0,
                alignment: 'left',
                bold: true,
                fontSize: 8,
              },
              {
                text: `${totalSumOfTruckFare.toLocaleString('en-IN')}`,
                style: '',
                colSpan: 0,
                alignment: 'left',
                bold: true,
                fontSize: 8,
              },
            ]
          ],
          },
        }
      ],
    }
    pdfMake.createPdf(docDefinition).open();
  }

  // orderSummery(data) {
  //   console.log(data, 'service');

  //   let apiData = data.apiData


  //   let docDefinition = {
  //     header: function (currentPage, pageCount) {
  //       return {
  //         margin: 10,
  //         columns: [
  //           {
  //             fontSize: 9,
  //             text: [
  //               {
  //                 text: `Printing: ${new Date().toLocaleString()}`,
  //               },
  //             ],
  //             alignment: 'right',
  //           },
  //         ],
  //       };
  //     },
  //     footer: function (currentPage, pageCount) {
  //       return {
  //         margin: 10,
  //         columns: [
  //           {
  //             fontSize: 9,
  //             text: [
  //               {
  //                 text:
  //                   '--------------------------------------------------------------------------' +
  //                   '\n',
  //                 margin: [0, 20],
  //               },
  //               {
  //                 text: 'Page' + currentPage.toString() + ' of ' + pageCount,
  //               },
  //             ],
  //             alignment: 'center',
  //           },
  //         ],
  //       };
  //     },
  //     pageSize: 'A4',
  //     // pageOrientation: 'landscape',
  //     content: [
  //       {
  //         columns: [
  //           [
  //             {
  //               image: logo.imgBase64,
  //               width: 200,
  //               height: 80,
  //             },
  //           ],
  //           [
  //             {
  //               text: 'Truckload Limited',
  //               alignment: 'right',
  //               fontSize: 20,
  //               bold: true,
  //               margin: [0, 20, 0, 0],
  //             },
  //             {
  //               text: 'Address: 427/1, Dhaka, Bangladesh',
  //               alignment: 'right',
  //             },
  //             // {
  //             //   text: 'Email: dhsmotors@honda.com.bd',
  //             //   alignment: 'right',
  //             // },
  //           ],
  //         ],
  //       },
  //       {
  //         canvas: [
  //           {
  //             type: 'line',
  //             x1: 0,
  //             y1: 5,
  //             x2: 595 - 2 * 40,
  //             y2: 5,
  //             lineWidth: 2,
  //           },
  //         ],
  //       },
  //       {
  //         text: 'Daily trip Position',
  //         fontSize: 16,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 10, 0, 5],
  //       },
  //       {
  //         text: `${data.from}--${data.to}`,
  //         fontSize: 16,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 10, 0, 5],
  //       },
  //       {
  //         style: 'tableExample',
  //         table: {
  //           headerRows: 1,
  //           widths: [
  //             '20%',
  //             '15%',
  //             '15%',
  //             '15%',
  //             '15%',
  //             '20%',
  //           ],
  //           body: [
  //             [
  //               { text: 'Client Name', style: 'tableHeader' },
  //               { text: 'Client Type', style: 'tableHeader' },
  //               { text: 'Loading Point', style: 'tableHeader' },
  //               { text: 'Unloading Point', style: 'tableHeader' },
  //               { text: 'Vehicle Driver/Provider Name', style: 'tableHeader' },
  //               { text: 'Truck Fare', style: 'tableHeader' },
  //             ],
  //             ...apiData.map((p) => [
  //               p.name ? p.name : '',
  //               p.customer_type ? p.customer_type : '',

  //               p.truck_type.length > 0
  //                 ? {
  //                   style: 'tableExample',
  //                   // colSpan: 4,
  //                   margin: [0, 0, 0, 0],
  //                   table: {
  //                     widths: ['*'],
  //                     margin: [0, 0, 0, 0],
  //                     body: [
  //                       ...p.truck_type.map((q) => [
  //                         q.truck_loading_point ? q.truck_loading_point : '',
  //                       ]),
  //                     ],
  //                   },
  //                   layout: {
  //                     hLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     vLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     hLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                     vLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                   },
  //                 }
  //                 : '',
  //               p.truck_type.length > 0
  //                 ? {
  //                   style: 'tableExample',
  //                   // colSpan: 4,
  //                   margin: [0, 0, 0, 0],
  //                   table: {
  //                     widths: ['*'],
  //                     margin: [0, 0, 0, 0],
  //                     body: [
  //                       ...p.truck_type.map((q) => [
  //                         q.truck_unloading_point ? q.truck_unloading_point : '',
  //                       ]),
  //                     ],
  //                   },
  //                   layout: {
  //                     hLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     vLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     hLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                     vLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                   },
  //                 }
  //                 : '',
  //               p.truck_type.length > 0
  //                 ? {
  //                   style: 'tableExample',
  //                   // colSpan: 4,
  //                   margin: [0, 0, 0, 0],
  //                   table: {
  //                     widths: ['*'],
  //                     margin: [0, 0, 0, 0],
  //                     body: [
  //                       ...p.truck_type.map((q) => [
  //                         q.driver_name ? q.driver_name : '',
  //                       ]),
  //                     ],
  //                   },
  //                   layout: {
  //                     hLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     vLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     hLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                     vLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                   },
  //                 }
  //                 : '',
  //               p.truck_type.length > 0
  //                 ? {
  //                   style: 'tableExample',
  //                   // colSpan: 4,
  //                   margin: [0, 0, 0, 0],
  //                   table: {
  //                     widths: ['*'],
  //                     margin: [0, 0, 0, 0],
  //                     body: [
  //                       ...p.truck_type.map((q) => [
  //                         // q.truck_fare ? q.truck_fare : '',
  //                         {
  //                           text: q.truck_fare
  //                             ? parseInt(q.truck_fare)
  //                               .toFixed(2)
  //                               .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  //                             : 'N/A',
  //                           alignment: 'right',
  //                         },
  //                       ]),
  //                     ],
  //                   },
  //                   layout: {
  //                     hLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     vLineWidth: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 0
  //                         : 1;
  //                     },
  //                     hLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.body.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                     vLineColor: function (i, node) {
  //                       return i === 0 || i === node.table.widths.length
  //                         ? 'black'
  //                         : 'gray';
  //                     },
  //                   },
  //                 }
  //                 : '',
  //             ]),
  //             // [
  //             //   {
  //             //     text: 'Total',
  //             //     colSpan: 6,
  //             //     alignment: 'right',
  //             //     bold: true,
  //             //   },
  //             //   {},
  //             //   {},
  //             //   {},
  //             //   {},
  //             //   {},
  //             //   {
  //             //     text: this.totalDr
  //             //       .toFixed(2)
  //             //       .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
  //             //     alignment: 'right',
  //             //     bold: true,
  //             //   },
  //             //   {
  //             //     text: this.totalCr
  //             //       .toFixed(2)
  //             //       .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
  //             //     alignment: 'right',
  //             //     bold: true,
  //             //   },
  //             // ],
  //           ],
  //         },
  //         layout: {
  //           // paddingLeft: function (i, node) {
  //           //   return 0;
  //           // },
  //           // paddingRight: function (i, node) {
  //           //   return 0;
  //           // },
  //           paddingTop: function (i, node) {
  //             return 0;
  //           },
  //           paddingBottom: function (i, node) {
  //             return 0;
  //           },
  //         },
  //       },
  //       {
  //         text: `Cumulative Report`,
  //         fontSize: 16,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 10, 0, 5],
  //       },

  //       {
  //         style: 'tableExample',
  //         table: {
  //           headerRows: 1,
  //           //heights: [20, 50, 70],
  //           widths: [

  //             '33.33%',
  //             '33.33%',
  //             '33.33%',


  //           ],
  //           body: [
  //             [
  //             {text: 'Individual', style: 'tableHeader'},
  //             {text: 'SME', style: 'tableHeader'},
  //             {text: 'Corporate', style: 'tableHeader'}

  //           ],


  //           ],


  //             ...apiData.map((p) => [
  //               p.sme ? p.sme : '',
  //               p.individual ? p.individual : '',
  //               p.corporate ? p.corporate : '',



  //                 ]),










  //         }
  //       },

  //     ],
  //     styles: {
  //       tableExample: {
  //         margin: [5, 10, 10, 0],
  //         fontSize: 7,
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 8,
  //         color: 'black',
  //       },
  //     },

  //   };






  //   pdfMake.createPdf(docDefinition).open();

  // }
}

