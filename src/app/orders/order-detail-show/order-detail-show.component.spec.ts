import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailShowComponent } from './order-detail-show.component';

describe('OrderDetailShowComponent', () => {
  let component: OrderDetailShowComponent;
  let fixture: ComponentFixture<OrderDetailShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
