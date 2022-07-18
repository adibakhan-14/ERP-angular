import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlaceViewModalComponent } from './order-place-view-modal.component';

describe('OrderPlaceViewModalComponent', () => {
  let component: OrderPlaceViewModalComponent;
  let fixture: ComponentFixture<OrderPlaceViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlaceViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlaceViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
