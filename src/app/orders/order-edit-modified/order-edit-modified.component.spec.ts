import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditModifiedComponent } from './order-edit-modified.component';

describe('OrderEditModifiedComponent', () => {
  let component: OrderEditModifiedComponent;
  let fixture: ComponentFixture<OrderEditModifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEditModifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEditModifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
