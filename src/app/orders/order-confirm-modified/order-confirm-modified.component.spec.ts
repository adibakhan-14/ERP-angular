import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmModifiedComponent } from './order-confirm-modified.component';

describe('OrderConfirmModifiedComponent', () => {
  let component: OrderConfirmModifiedComponent;
  let fixture: ComponentFixture<OrderConfirmModifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderConfirmModifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmModifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
