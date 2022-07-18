import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Order, Product } from '../models/order.model';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-product-add-modal',
  templateUrl: './product-add-modal.component.html',
  styleUrls: ['./product-add-modal.component.scss']
})
export class ProductAddModalComponent implements OnInit {

  productForm: FormGroup;
  constructor(
    private orderService: OrderService,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private formBuilder: FormBuilder,
    public matDialogReference: MatDialogRef<ProductAddModalComponent>,
    public dialogRef: MatDialogRef<ProductAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public info: Product
    
    ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
     productName:['', [Validators.required]],
     remarks:[''],
     orientation: ['product', [Validators.required]],
    })
  }
  get productName(){
    return this.productForm.get('productName');
  }
  get remarks(){
    return this.productForm.get('remarks');
  }
  close = (): void => {
    this.dialogRef.close();
  };

  productAdd(product: Product){
    console.log(this.productForm.value, 'eeeee');
    let observer = of(null);
    this.matDialogReference.close([]);
    if(this.productForm.valid){
   
      this.orderService.addProduct(product).subscribe(
        (product) =>{
          if(!product){
            this.asyncService.finish();
            this.commonService.showSuccessMsg(
              'Success! The product has been added successfully.'
            );
            this.close();
            console.log("portesiiiiiiiiiii");
            
          }
          else{
            this.commonService.showErrorMsg(
              'Error! The product is not added.'
            );
            console.log("portese naaaaaaaaaaa");
            
          }
        },
       

      );
     
    }
    

  }
}
