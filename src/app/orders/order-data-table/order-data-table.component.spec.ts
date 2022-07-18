import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDataTableComponent } from './order-data-table.component';

describe('OrderDataTableComponent', () => {
  let component: OrderDataTableComponent;
  let fixture: ComponentFixture<OrderDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
