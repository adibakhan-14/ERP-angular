import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmedViewModalComponent } from './order-confirmed-view-modal.component';

describe('OrderConfirmedViewModalComponent', () => {
  let component: OrderConfirmedViewModalComponent;
  let fixture: ComponentFixture<OrderConfirmedViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderConfirmedViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmedViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
