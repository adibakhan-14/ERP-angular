import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeleteModComponent } from './order-delete-mod.component';

describe('OrderDeleteModComponent', () => {
  let component: OrderDeleteModComponent;
  let fixture: ComponentFixture<OrderDeleteModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDeleteModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeleteModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
