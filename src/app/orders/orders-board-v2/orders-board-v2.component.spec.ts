import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersBoardV2Component } from './orders-board-v2.component';

describe('OrdersBoardV2Component', () => {
  let component: OrdersBoardV2Component;
  let fixture: ComponentFixture<OrdersBoardV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersBoardV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersBoardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
