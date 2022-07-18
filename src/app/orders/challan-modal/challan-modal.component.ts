import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientRequest } from 'http';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/orders/services/orders.service';
import { imgBase64 } from 'src/logo';
// import { logoBase } from 'src/assets/logo';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// (<any>pdfMake).addVirtualFileSystem(pdfFonts);

@Component({
  selector: 'app-challan-modal',
  templateUrl: './challan-modal.component.html',
  styleUrls: ['./challan-modal.component.scss']
})
export class ChallanModalComponent {
  leaseSub: Subscription;

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
    this.leaseSub = this.orderService
      .getLease(this.data.order_id)
      .subscribe((data) => {
        this.leaseData = data;
        this.generatePdf();

        console.log(this.leaseData, 'ki Pacchiiiiiiiiiiiiiiiiiiiiii');

        // this.orderSub = this.orderService
        // .dri(this.data.order_id)
        // .subscribe((data) => {
        //   this.leaseData = data;

        // });
      });
  }

  generatePdf() {
    var bodyData = [];
    var totalSum = 0;
    this.leaseData[0].information[0].truck_details.map((data)=>{
      var dataRow = [];
      totalSum= totalSum+parseInt(data.fare)
      dataRow.push(data.fare);
      bodyData.push(dataRow);
    });
    var truckRegData = [];
    this.leaseData[0].information.map((data)=>{
      var truckRegRow = [];
      truckRegRow.push(data.truck_reg);
      truckRegData.push(truckRegRow);
    });
  
    let final_truck_data_1 = this.leaseData.map((data) => {
      var loadDistrict = [];
      var loadingPoint = [];
      var loadingPerson = [];
      var loadingPersonNo = [];
      var loadingDate=[];
      var loadingTime=[];

      var unloadDistrict = [];
      var unloadingPoint = [];
      var unloadingPerson = [];
      var unloadingPersonNo = [];
      var unloadingDate=[];
      var unloadingTime=[];

      var productMaterial =[];
      var productName =[];
      var productQuantity=[];
      var productWeight =[];

      var i = 0;
      for (let points in data.information[0].truck_details[0].destination) {
          if(points==='0'){
            for (let keys in data.information[0].truck_details[0].destination[points].loadingPoint) {
              loadDistrict.push(data.information[0].truck_details[0].destination[points].loadingPoint[keys].load_district);
              loadingPoint.push(data.information[0].truck_details[0].destination[points].loadingPoint[keys].loading_point);
              loadingPerson.push(data.information[0].truck_details[0].destination[points].loadingPoint[keys].loading_person);
              loadingPersonNo.push(data.information[0].truck_details[0].destination[points].loadingPoint[keys].loading_person_no);
              loadingDate.push(data.information[0].truck_details[0].destination[points].loadingPoint[keys].loading_date);
              loadingTime.push(data.information[0].truck_details[0].destination[points].loadingPoint[keys].loading_time);
            }
          }
          if(points==='1'){
            for (let keys in data.information[0].truck_details[0].destination[points].unloadingPoint) {
              unloadDistrict.push(data.information[0].truck_details[0].destination[points].unloadingPoint[keys].unload_district);
              unloadingPoint.push(data.information[0].truck_details[0].destination[points].unloadingPoint[keys].unloading_point);
              unloadingPerson.push(data.information[0].truck_details[0].destination[points].unloadingPoint[keys].unloading_person);
              unloadingPersonNo.push(data.information[0].truck_details[0].destination[points].unloadingPoint[keys].unloading_person_no);
              unloadingDate.push(data.information[0].truck_details[0].destination[points].unloadingPoint[keys].unloading_date);
              unloadingTime.push(data.information[0].truck_details[0].destination[points].unloadingPoint[keys].unloading_time);
            }
          }
          if(points==='2'){
            for (let keys in data.information[0].truck_details[0].destination[points].product) {
              productMaterial.push(data.information[0].truck_details[0].destination[points].product[keys].product_material);
              productName.push(data.information[0].truck_details[0].destination[points].product[keys].product_name);
              productQuantity.push(data.information[0].truck_details[0].destination[points].product[keys].product_quantity);
              productWeight.push(data.information[0].truck_details[0].destination[points].product[keys].product_weight);
            }
          }
        i = i + 1;
      }
      var dynamicInfo = {
        challanNo: data.pk[data.pk.length-1],
        pk: data.pk,
        trip_id: data.information[0].truck_details[0].trip_id,
        trip_number: data.information[0].truck_details[0].trip_number,
        created_date: moment(data.created_date).subtract(10, 'days').calendar(),

        load_district: loadDistrict,
        loading_point: loadingPoint,
        loading_person: loadingPerson,
        loading_person_no: loadingPersonNo,
        loading_date:loadingDate,
        loading_time:loadingTime,

        unload_district: unloadDistrict,
        unloading_point: unloadingPoint,
        unloading_person: unloadingPerson,
        unloading_person_no: unloadingPersonNo,
        unloading_date:unloadingDate,
        unloading_time:unloadingTime,

        product_material:productMaterial,
        product_name: productName,
        product_quantity:productQuantity,
        product_weight:productWeight,

        weight: data.information[0].truck_details[0].truck_type.weight,
        fare: data.information[0].truck_details[0].fare,
        license_number: data.information[0].license_number,
        truck_reg: data.information[0].truck_reg,
        customer_name: data.information[0].truck_details[0].trip_number[0]+data.information[0].truck_details[0].trip_number[1]+data.information[0].truck_details[0].trip_number[2]+data.information[0].truck_details[0].trip_number[3],
        phone: data.information[0].phone,
        vendor_id: data.information[0].vendor_id,
        rent_time: data.information[0].rent_time,
      };
      return dynamicInfo;
    });

    console.log(final_truck_data_1, `final_truck_data_1`);

    this.docDefinition = {
      pageSize: 'A4',
      content: [
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
                text: `Challan No: ${final_truck_data_1[0].challanNo}`,
                fontSize: 12,
                bold: false,
                alignment: 'left',
                margin: [0, 10, 0, 0],
              },
              // {
              //   text: `Trip No: ${final_truck_data_1[0].trip_number}`,
              //   fontSize: 12,
              //   bold: false,
              //   alignment: 'left',
              //   margin: [0, 0, 0, 0],
              //   layout: 'fixed',
              // },
              {
                text: `Customer\'s Name: ${final_truck_data_1[0].customer_name}`,
                fontSize: 12,
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
                margin: [0, 100, 0, 0],
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
                fontSize: 12,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              {
                text: '+880 01955664411',
                fontSize: 12,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              {
                text: 'hello@streatlogistics.com.bd',
                fontSize: 12,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              '\n',
              {
                text: `Date: ${final_truck_data_1[0].created_date}`,
                fontSize: 12,
                bold: false,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
            ],
          ],
        },
        '\n',
        {
          table: {
            widths: [76, 76, 76, 76, 76, 76],
            heights: [, , , , 225],
            body: [
              [
                {
                  text: "Loading Person",
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                },
                {
                  text: `${final_truck_data_1[0].loading_person}`,
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
                {
                  text: "Unloading Person",
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                },
                {
                  text: `${final_truck_data_1[0].unloading_person}`,
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
              ],
              [
                { text: 'Loading Address', style: '', colSpan: 0, alignment: 'center' },
                {
                  text: `${final_truck_data_1[0].loading_point}`,
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
                { text: 'Unloading Address', style: '', colSpan: 0, alignment: 'center' },
                {
                  text: `${final_truck_data_1[0].unloading_point}`,
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
              ],
              [
                {
                  text: 'Loading Person Contact',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                },
                {
                  text: `${final_truck_data_1[0].loading_person_no}`,
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
                {
                  text: 'Unloading Person Contact',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                },
                {
                  text: `${final_truck_data_1[0].unloading_person_no}`,
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
              ],
              [
                { text: 'Number', style: '', colSpan: 0, alignment: 'center' },
                {
                  text: 'Product Description',
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
                {
                  text: 'Carton/Drum',
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                },
                { text: 'Weight', style: '', colSpan: 0, alignment: 'center' },
                { text: 'Taka', style: '', colSpan: 0, alignment: 'center' },
              ],
              [
                {
                  text: `${final_truck_data_1[0].pk}`,
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                },
                {
                  text: `${final_truck_data_1[0].product_material}`,
                  style: '',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
                {
                  text: `${final_truck_data_1[0].product_quantity}`,
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                },
                {
                  text: `${final_truck_data_1[0].product_weight}`,
                  style: '',
                  colSpan: 0,
                  alignment: 'center',
                },
                {
                  // text: `${final_truck_data_1[0].fare}`,
                  // style: '',
                  // colSpan: 0,
                  // alignment: 'center',
                  table: {
                    widths: ['100%'],
                    body:bodyData
               },
                alignment: 'center',
                layout: 'noBorders',
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
                },
                {
                  text: `${totalSum}`,
                  style: {},
                  colSpan: 0,
                  alignment: 'center',
                },
              ],
              // [
              //   { text: ``, style: '', colSpan: 4, alignment: 'center' },
              //   {},
              //   {},
              //   {},
              //   {
              //     text: 'Commission:',
              //     style: {},
              //     colSpan: 0,
              //     alignment: 'center',
              //   },
              //   {},
              // ],
              // [
              //   { text: ``, style: '', colSpan: 4, alignment: 'center' },
              //   {},
              //   {},
              //   {},
              //   {
              //     text: 'In Advance:',
              //     style: {},
              //     colSpan: 0,
              //     alignment: 'center',
              //   },
              //   {},
              // ],
              // [
              //   { text: ``, style: '', colSpan: 4, alignment: 'center' },
              //   {},
              //   {},
              //   {},
              //   {
              //     text: 'Due Amount:',
              //     style: {},
              //     colSpan: 0,
              //     alignment: 'center',
              //   },
              //   {},
              // ],
              [
                {
                  text: 'Taka in word:',
                  style: {},
                  colSpan: 0,
                  alignment: 'left',
                },
                { text: ``, style: '', colSpan: 5, alignment: 'center' },
                {},
                {},
                {},
                {},
              ],
              // [
              //   {
              //     text: "Driver's Name",
              //     style: '',
              //     colSpan: 0,
              //     alignment: 'center',
              //   },
              //   {
              //     text: `${final_truck_data_1[0].name}`,
              //     style: '',
              //     colSpan: 2,
              //     alignment: 'center',
              //   },
              //   {},
              //   {
              //     text: "Driver's Name",
              //     style: '',
              //     colSpan: 0,
              //     alignment: 'center',
              //   },
              //   {
              //     text: `${final_truck_data_1[0].name}`,
              //     style: '',
              //     colSpan: 2,
              //     alignment: 'center',
              //   },
              //   {},
              // ],
              // [
              //   {
              //     text: 'license No',
              //     style: '',
              //     colSpan: 0,
              //     alignment: 'center',
              //   },
              //   {
              //     text: `${final_truck_data_1[0].license_number}`,
              //     style: '',
              //     colSpan: 2,
              //     alignment: 'center',
              //   },
              //   {},
              //   {
              //     text: "Cars's No",
              //     style: '',
              //     colSpan: 0,
              //     alignment: 'center',
              //   },
              //   {
              //     text: `${final_truck_data_1[0].truck_reg}`,
              //     style: '',
              //     colSpan: 2,
              //     alignment: 'center',
              //   },
              //   {},
              // ],
              [
                {
                  text: 'Truck Reg',
                  style: {},
                  colSpan: 0,
                  alignment: 'left',
                },
                { 
                  table: {
                    widths:['100%'],
                    body:truckRegData,
               },
               alignment: 'center',
               layout: 'noBorders',
               colSpan: 5,
                 },
                {},
                {},
                {},
                {},
              ],
            ],
          },
        },
        {
          text: `Dispute Note: No Dispute`,
          fontSize: 12,
          alignment: 'left',
          margin: [0, 10, 0, 0],
        },

        {
          text: `All the aforementioned products are taken into my consideration\n\n`,
          fontSize: 12,
          alignment: 'left',
          margin: [0, 10, 0, 0],
        },

        {
          columns: [
            [
              {
                text: ` ______________________________`,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: ` Driver\'s Signature`,
                fontSize: 12,
                alignment: 'center',
              },
            ],
            [
              {
                text: ` ______________________________`,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: ` Receiver\'s Name & Sinature`,
                fontSize: 12,
                alignment: 'center',
              },
            ],
            [
              {
                text: ` ______________________________`,
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: 'On Behalf of Streat Ltd',
                fontSize: 12,
                alignment: 'center',
              },
            ],
          ],
        },
        { text: '\nConditions:\n', style: '' },
      ],
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
    };
  }
  ///////////////////////////////////////////

  buttonCall(): any {
    console.log('hello world');
    pdfMake.createPdf(this.docDefinition).open();
  }
  ///////////////////////////////////////////
}

