import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlaceViewLeaseModalComponent } from './order-place-view-lease-modal.component';

describe('OrderPlaceViewLeaseModalComponent', () => {
  let component: OrderPlaceViewLeaseModalComponent;
  let fixture: ComponentFixture<OrderPlaceViewLeaseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlaceViewLeaseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlaceViewLeaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
