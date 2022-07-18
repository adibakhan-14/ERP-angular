import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTruckTaggingModalComponent } from './product-truck-tagging-modal.component';

describe('ProductTruckTaggingModalComponent', () => {
  let component: ProductTruckTaggingModalComponent;
  let fixture: ComponentFixture<ProductTruckTaggingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTruckTaggingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTruckTaggingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
