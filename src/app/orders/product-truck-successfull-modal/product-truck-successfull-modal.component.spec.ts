import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTruckSuccessfullModalComponent } from './product-truck-successfull-modal.component';

describe('ProductTruckSuccessfullModalComponent', () => {
  let component: ProductTruckSuccessfullModalComponent;
  let fixture: ComponentFixture<ProductTruckSuccessfullModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTruckSuccessfullModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTruckSuccessfullModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
